import { useEffect, useState } from "react";
import { Alert, Button, Card, Container, Group, RingProgress, Stack, Text, Title } from "@mantine/core";
import MathPlot from "./partial/shared/MathPlot";
import StaticPlayer from "./partial/graphic/StaticPlayer";
import { log_tick_pos, getInitGraphicFilters, filter_count, sample_count, getNewGraphicSol, checkSolution } from "./partial/graphic/utilsGraphic";
import EQPanel from "./partial/graphic/EQPanel";
import { useLocation } from "react-router-dom";
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
  const location = useLocation();
  const {
    qCount = 3
  } = location.state || {};

  // The audio file to be played
  const [audioFile, setAudioFile] = useState(getRandomAudio());
  // Whether the user is listening to the target
  const [viewTarget, setViewTarget] = useState(true);
  // The filter to be fed to StaticPlayer
  const [filters, setFilters] = useState(getInitGraphicFilters());
  // Trigger rendering
  const [trigger, setTrigger] = useState(0);
  // Indicate that whether the need of change in graph comes from trigger
  const [fromTrigger, setFromTrigger] = useState(false);
  // Indicate that whether the need of change in graph comes from onSwitch or onSlider
  const [fromSlider, setFromSlider] = useState(false);
  // The filters edited by user
  const [userFilters, setUserFilters] = useState(getInitGraphicFilters());
  // y_values on the plot to display user frequency response
  const [yValues, setYValues] = useState(new Array(sample_count).fill(0));
  // The filters used in the solution of current question
  const [solFilters, setSolFilters] = useState(getNewGraphicSol());
  // sol_values on the plot to display solution frequency response (only when easy mode is ON)
  const [solValues, setSolValues] = useState(new Array(sample_count).fill(0));
  // Number of questions the user have answered, and how many of them are correct
  const [score, setScore] = useState({ completed: 0, correct: 0 });
  // Whether the user has used easy mode
  const [easyMode, setEasyMode] = useState(false);
  // State of the question: the user is answering or watching result?
  const [submitted, setSubmitted] = useState(false);
  // Whether the solution is correct after submission
  const [feedback, setFeedback] = useState(false);
  // The flag to be passed to EQPanel to reset sliders
  const [resetSliders, setResetSliders] = useState(0);
  // Player key: the StaticPlayer will be remounted when the key changes
  const [playerKey, setPlayerKey] = useState(0);
  // To record whether the player has started trying out his question
  const [firstSwitch, setFirstSwitch] = useState(false);

  // Action on start
  useEffect(() => {
    // Get random audio file and solution in state definition or else error occurs
    setTrigger(trigger + 1);
  }, []);

  useEffect(() => {
    if (trigger) {
      setFilters(solFilters);
      setFromTrigger(true);
    }
  }, [trigger]);

  // Extra rendering taken to help reset of graph after resetting sliders
  useEffect(() => {
    const newYValues = new Array(sample_count);
    newYValues.fill(0);
    setYValues(newYValues);
    const newSolValues = new Array(sample_count);
    newSolValues.fill(0);
    setSolValues(newSolValues);
  }, [resetSliders]);

  // Reset all answers, display and state of a question
  const initSetup = () => {
    setTrigger(trigger + 1);
    setFromTrigger(false);
    setSolFilters(getInitGraphicFilters());
    setUserFilters(getInitGraphicFilters());

    setResetSliders(resetSliders + 1); // Keep changing value to force re-rendering
    const newYValues = new Array(sample_count);
    newYValues.fill(0);
    setYValues(newYValues);
    const newSolValues = new Array(sample_count);
    newSolValues.fill(0);
    setSolValues(newSolValues);

    setViewTarget(true);
    setSubmitted(false);
    setEasyMode(false);
    setFirstSwitch(false);

    // Obtain new audio file
    const newAudioFile = getRandomAudio();
    setAudioFile(newAudioFile);
    // Generate new eq solution
    const newSolFilters = getNewGraphicSol();
    setSolFilters(newSolFilters);
    setPlayerKey(playerKey + 1);
  }

  // On submit when question completed has not reached total question available
  const nextQuestion = () => {
    // Clear filters, values and sliders
    initSetup();
  }

  // On submit when question completed has reached total question available
  const startOver = () => {
    // Clear filters, values and sliders
    initSetup();
    // Reset question record
    setScore({ completed: 0, correct: 0 });
  }

  // Switch to listen to user eq or solution eq
  const onSwitch = () => {
    // Complete first switch
    if (!firstSwitch) {
      setFirstSwitch(true);
    }
    // Disable fromTrigger here to prevent error caused by multiple rendering at once
    setFromTrigger(false);
    // Update viewTarget
    const newViewTarget = !viewTarget;
    setViewTarget(newViewTarget);
    // Reverse the identity
    if (newViewTarget) {
      setFilters(solFilters);
    }
    // If the page was solution, display user next
    else {
      setFilters(userFilters);
    }
    setFromSlider(false);
  }

  // Receive changes from EQPanel sliders (viewTarget must be false)
  const onSlide = (newSliderValues) => {
    // Disable fromTrigger here to prevent error caused by multiple rendering at once
    setFromTrigger(false);
    // Handle slider changes
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
    // Update newest user filters, and stay on user view
    setUserFilters(newUserFilters);
    setFilters(newUserFilters);
    setFromSlider(true);
  }

  // When easy mode is enabled
  const onEasyMode = () => {
    setEasyMode(true);
    // Force to trigger StaticPlayer to generate frequency response
    if (viewTarget) {
      setTrigger(trigger + 1);
    }
  }

  // Receive changes from StaticPlayer
  // Note: the order of React computation is: update of state -> re-rendering components -> useEffect -> receive callback from child
  const onResponse = (magResponseList, phaseResponseList) => {
    // Sample the received magResponseList into log samples
    const received_values = new Array(sample_count).fill(0);
    for (let i = 0; i < filter_count; i++) {
      for (let j = 0; j < sample_count; j++) {
        received_values[j] += (magResponseList[i][j] - 1);
      }
    }

    // Identify whether this is induced from onSlide, and can assume current view is user
    if (fromSlider) {
      setYValues(received_values);
    }
    // Identify if this is induced from trigger: if is trigger, update solValues only (currently only onEasyMode causes trigger)
    else if (fromTrigger) {
      setSolValues(received_values);
    }
    // Else, it must be switch
    // Due to the order of React computation, on switching pages, the frequency response should be updating the view that is gone
    else {
      if (viewTarget) {
        setYValues(received_values);
      }
      else {
        setSolValues(received_values);
      }
    }
  }

  // When submit button is clicked
  const onSubmit = () => {
    // Check answer
    const result = checkSolution(yValues, solValues);
    // Update answer record
    let completed = score.completed + 1;
    let correct = score.correct;
    if (result) { // If correct
      setFeedback(true);
      correct++;
    }
    else {
      setFeedback(false);
    }
    setScore({ completed: completed, correct: correct });
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

            {/* Setting Header */}
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
                    onClick={onEasyMode}
                    disabled={easyMode || submitted}
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
                  { value: ((score.completed - score.correct) / qCount) * 100, color: "red" },
                  { value: (score.correct / qCount) * 100, color: "green" },
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
              <EQPanel onChange={onSlide} resetFlag={resetSliders} />
            </div>

            {/* Feedback for the question */}
            {submitted && (
              <Alert
                color={feedback ? "green" : "red"}
                title={
                  <Text fw={700} size="lg">
                    {feedback ?
                      (easyMode ?
                        "Correct! Try it yourself next time!" :
                        "Correct!"
                      ) :
                      "Not quite!"
                    }
                  </Text>}
              />
            )}
            {/* Feedback for the set of questions */}
            {score.completed >= qCount && (
              <Alert
                color="green"
                title={<Text fw={700} size="lg">Finished!</Text>}
              >
                <Text fw={500} size="md" mt={4}>
                  All {qCount} Questions are finished. <br />
                  Your score is {score.correct}/{score.completed}!!!
                </Text>
              </Alert>
            )}

            {/* Submit button */}
            <Button
              onClick={onSubmit}
              disabled={submitted || !firstSwitch}
            >
              {firstSwitch ? "Submit" : "Try it out first!"}
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
            <StaticPlayer key={playerKey} audioFile={audioFile} filters={filters} onChange={onResponse} trigger={trigger} />

          </Stack>
        </Card>
      </Stack>
    </Container>
  )
}

export default EQGraphic;