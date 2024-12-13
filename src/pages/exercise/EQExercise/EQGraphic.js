import { useEffect, useState } from "react";
import { Button, Card, Container, Group, RingProgress, Stack, Text, Title } from "@mantine/core";
import MathPlot from "./partial/plot/MathPlot";
import StaticPlayer from "./partial/StaticPlayer";
import { log_tick_pos, getInitGraphicFilters, filter_count, sample_count, getNewGraphicSol, checkSolution } from "./partial/utilsGraphic";
import EQPanel from "./partial/EQPanel";
import { useLocation, useNavigate } from "react-router-dom";
import { getRandomAudio } from "../../../Music/AudioPicker";
import { IconArrowRight, IconRefresh } from "@tabler/icons-react";

// Reference: https://mp3cut.net/equalizer
/**
 * Main logic:
 * Sliders allow users to edit their answers
 * StaticPlay is the only audio playing object in this page
 * User can switch to listen to their answers and the solution: instead of replaying a different audio, the current approach is to update filters [state] to seamlessly apply the changes within StaticPlayer
 * When the user is listening to solution, editing is disabled
 * When easy mode is ON, it cannot be turned to OFF again
 * When easy mode is ON, when the user is listening to solution, a red line shows to show the frequency response of the solution
 * 
 * Data Flow:
 * Sliders edit CustomEQFilter array
 * => the state changes cause changes in StaticPlayer
 * => StaticPlayer plays audio with the input filter, and return the parent with the frequency response of the currently playing audio
 * => parent received the frequency response, update values state
 * => the state changes cause changes in MathPlot to plot a different graph
 * 
 */
function EQGraphic() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    qCount = 3
  } = location.state || {};

  // The audio file to be played
  const [audioFile, setAudioFile] = useState(getRandomAudio());
  // Whether the user is listening to the target
  const [viewTarget, setViewTarget] = useState(false);
  // Indicates that whether the audio playing is by the user or solution
  const [audioIdentity, setAudioIdentity] = useState(0); // -1: user, 0: init pass to solution, 1: solution
  // The filter to be fed to StaticPlayer
  const [filters, setFilters] = useState(getInitGraphicFilters());
  // The filters edited by user
  const [userFilters, setUserFilters] = useState(getInitGraphicFilters());
  // y_values on the plot to display user frequency response
  const [yValues, setYValues] = useState(new Array(sample_count).fill(0));
  // The filters used in the solution of current question
  const [solFilters, setSolFilters] = useState(getInitGraphicFilters());
  // sol_values on the plot to display solution frequency response (only when easy mode is ON)
  const [solValues, setSolValues] = useState(new Array(sample_count).fill(0));
  // Number of questions the user have answered, and how many of them are correct
  const [score, setScore] = useState({ completed: 0, correct: 0, easyCorrect: 0 });
  // Whether the user has used easy mode
  const [easyMode, setEasyMode] = useState(false);
  // State of the question: the user is answering or watching result?
  const [submitted, setSubmitted] = useState(false);
  // The flag to be passed to EQPanel to reset sliders
  const [resetSliders, setResetSliders] = useState(false);

  // Action on start
  useEffect(() => {
    // Get random audio file in state definition or else error occurs
    // Generate the first question
    const sol_filters = getNewGraphicSol();
    setSolFilters(sol_filters);
    // Initialize solValues
    setFilters(sol_filters);
  }, []);

  // Turn back to false after resetting sliders
  // useEffect(() => {
  //   if (resetSliders) {
  //     setResetSliders(false);
  //   }
  // }, [resetSliders]);

  const initSetup = () => {
    setFilters(getInitGraphicFilters());
    setSolFilters(getInitGraphicFilters());
    setUserFilters(getInitGraphicFilters());
    setYValues(new Array(sample_count).fill(0));
    setSolValues(new Array(sample_count).fill(0));
    // console.log("#######################Reset slider", resetSliders);
    setResetSliders(true);
  }

  // On submit when question completed has not reached total question available
  const nextQuestion = () => {
    // Clear filters, values and sliders
    initSetup();
    // Obtain new audio file
    const newAudioFile = getRandomAudio();
    setAudioFile(newAudioFile);
    // Generate new eq solution
    const newSolFilters = getNewGraphicSol();
    setSolFilters(newSolFilters);
    // Set back to not submitted and disable easy mode
    setSubmitted(false);
    setEasyMode(false);
  }

  // On submit when question completed has reached total question available
  const startOver = () => {
    // Reset question record
    setScore({ completed: 0, correct: 0, easyCorrect: 0 });
    // Clear filters, values and sliders
    initSetup();
    // Obtain new audio file
    const newAudioFile = getRandomAudio();
    setAudioFile(newAudioFile);
    // Generate new eq solution
    const newSolFilters = getNewGraphicSol();
    setSolFilters(newSolFilters);
    // Set back to not submitted and disable easy mode
    setSubmitted(false);
    setEasyMode(false);
  }

  // Switch to listen to user eq or solution eq
  const onSwitch = () => {
    // Update viewTarget
    const newViewTarget = !viewTarget;
    setViewTarget(newViewTarget);
    // If now we are listening to solution eq
    if (newViewTarget) {
      // Tell StaticPlayer to play solution audio
      setFilters(solFilters);
      setAudioIdentity(-1); // reversed to hardcode desired outcome
    }
    // If now we are listening to user eq
    else {
      // Tell StaticPlayer to play user audio
      setFilters(userFilters);
      setAudioIdentity(1); // reversed to hardcode desired outcome
    }
  }

  // Receive changes from EQPanel sliders (viewTarget must be false)
  const onSlide = (newSliderValues) => {
    // Forward filter changes to StaticPlayer
    // No. of filters = no. of sliders
    const newUserFilters = userFilters.map((obj, idx) => {
      const percentGain = newSliderValues[idx] / 100;
      obj.gain = percentGain;
      // To compensate the expansion of bandwidth on significant decrease in gain, adjust q when gain is negative to keep bandwidth in place
      if (percentGain < 0) {
        obj.q = -percentGain;
      }
      else {
        obj.q = 1;
      }
      return obj;
    });
    setUserFilters(newUserFilters);
    // viewTarget must be false onSlide, the filters fed to StaticPlayer must be the user eq
    setFilters(newUserFilters);
    setAudioIdentity(-1);
  }

  // Receive changes from StaticPlayer
  const onResponse = (identity, magResponseList, phaseResponseList) => {
    // console.log("Received response", identity);
    // Sample the received magResponseList into log samples
    const received_values = new Array(sample_count).fill(0);
    for (let i = 0; i < filter_count; i++) {
      for (let j = 0; j < sample_count; j++) {
        received_values[j] += (magResponseList[i][j] - 1);
      }
    }
    // If now is viewing the solution, received magResponseList is about the solValues
    if (identity >= 0) {
      if (identity === 0) {
        // console.log("First pass");
      }
      setSolValues(received_values);
      // console.log("put response to sol")
    }
    // If now is viewing the user, received magResponseList is about the yValues
    else if (identity < 0) {
      setYValues(received_values);
      // console.log('put response to user')
    }
  }

  const OnEasyModeClicked = () => {
    setEasyMode(true);
    // Force re-render to update graph
    setSolValues(solValues);
    setViewTarget(viewTarget);
  }

  // When submit button is clicked
  const onSubmit = () => {
    // Check answer
    const result = checkSolution(yValues, solValues);
    // Display solution

    // Update answer record
    let completed = score.completed + 1;
    let correct = score.correct;
    let easyCorrect = score.easyCorrect;
    if (result) { // If correct
      if (easyMode) { // Easy mode was used
        easyCorrect++;
      }
      else { // Real correct
        correct++;
      }
    }
    setScore({ completed: completed, correct: correct, easyCorrect: easyCorrect });
    setSubmitted(true);
  }


  const x_tick_cb = (val) => (log_tick_pos.includes(val) ? val : '');
  const y_tick_cb = (val) => (val >= 0 ? `+${val * 100}%` : `-${val * 100}%`);

  return (
    <Container size="md" px="md">
      <Stack spacing="lg">
        {/* Title and Subtitle */}
        <Title order={1} align="center">
          Graphic EQ Exercise
          <Text size="md" fs={700} c="dimmed">
            {qCount} Questions
          </Text>
        </Title>
        {/* Main Section */}
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Stack spacing="md" justify="flex-start">

            {/* Setting header */}
            <Group position="apart" justify="space-between" align="center">
              <Stack>
                {/* Select to listen to synth audio or target audio */}
                <Group>
                  <Button
                    onClick={onSwitch}
                    color={viewTarget ? "green" : "rgba(255, 18, 18, 1)"}
                    size="lg"
                  >
                    {`Switch to ${viewTarget ? "Your Audio" : "Target Audio"}`}
                  </Button>
                  <Text size="lg">{`Now listening to ${viewTarget ? "Target Audio" : "Your Audio"}`}</Text>
                </Group>
                <Group>
                  <Button
                    onClick={OnEasyModeClicked}
                    disabled={easyMode}
                    color="indigo"
                    size="lg"
                  >
                    {easyMode ? "Easy Mode: ON" : "Easy Mode: OFF"}
                  </Button>
                </Group>
              </Stack>
              <RingProgress
                size={140}
                label={
                  <Text size="lg" ta="center">
                    {score.completed}/{qCount}
                  </Text>
                }
                sections={[
                  { value: ((score.completed - score.correct - score.easyCorrect) / qCount) * 100, color: "red" },
                  { value: (score.correct / qCount) * 100, color: "green" },
                  { value: (score.easyCorrect / qCount) * 100, color: "blue" }
                ]}
              />
            </Group>

            {/* Blur region */}
            <div style={{ filter: viewTarget ? 'blur(5px)' : 'none', pointerEvents: viewTarget ? 'none' : 'auto' }}>
              {/* Graph for frequency response */}
              <MathPlot
                y_values={yValues}
                // sol_values={solValues}
                sol_values={((easyMode && viewTarget) || submitted) ? solValues : null}
                x_bounds={{ min: 20, max: 22000 }} // not related, log plot does not take x_bounds
                y_bounds={{ min: -1, max: 1 }}
                x_tick={2000}
                y_tick={0.5}
                x_tick_cb={x_tick_cb}
                y_tick_cb={y_tick_cb}
                curve_name="Frequency Response"
                log_scale={true}
              />
              {/* Panel for graphic equalization */}
              <EQPanel onChange={onSlide} />
            </div>

            {/* Submit button */}
            <Button
              onClick={onSubmit}
              disabled={submitted}
            >
              Submit
            </Button>

            {/* Next Question button */}
            <Button
              onClick={score.completed >= qCount ? startOver : nextQuestion}
              disabled={!submitted}
              rightSection={score.completed >= qCount ? <IconRefresh size={20} /> : <IconArrowRight size={20} />}
              variant={score.completed >= qCount ? "filled" : "light"}
            >
              {score.completed >= qCount ? "Start Over" : "Next Question"}
            </Button>

            {/* Audio player */}
            <StaticPlayer audioFile={audioFile} audioIdentity={audioIdentity} filters={filters} onChange={onResponse} />

          </Stack>
        </Card>
      </Stack>
    </Container>
  )
}

export default EQGraphic;