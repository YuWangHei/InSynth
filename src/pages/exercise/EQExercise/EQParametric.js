import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Alert, Group, Text, Container, Stack, Title, Card, Button, RingProgress } from "@mantine/core";
import MathPlot from "./partial/shared/MathPlot";
import { getRandomAudio } from "../../../Music/AudioPicker";
import { checkParametricSolution, getFilterSettings, getNewParametricSol, log_tick_pos, sample_count } from "./partial/parametric/utilsParametric";
import ParametricInput from "./partial/parametric/ParametricInput";
import ParametricPlayer from "./partial/parametric/ParametricPlayer";
import { IconArrowRight, IconRefresh } from "@tabler/icons-react";

function EQParametric() {
  const location = useLocation();
  const {
    filterCount = 2,
    qCount = 3
  } = location.state || {};

  // The audio file to be played
  const [audioFile, setAudioFile] = useState(getRandomAudio());
  // Whether the user is listening to the target
  const [viewTarget, setViewTarget] = useState(true);
  // The filter to be fed to ParametricPlayer
  const [filters, setFilters] = useState([]);
  // Trigger rendering
  const [trigger, setTrigger] = useState(0);
  // Indicate that whether the need of change in graph comes from trigger
  const [fromTrigger, setFromTrigger] = useState(false);
  // Indicate that whether the need of change in graph comes from onSwitch or onSlider
  const [fromSlider, setFromSlider] = useState(false);
  // Filter settings instructions on creating slider components
  const [filterSettings, setFilterSettings] = useState([]);

  // The filters edited by user
  const [userFilters, setUserFilters] = useState([]);
  // y_values on the plot to display user frequency response
  const initYValues = new Array(sample_count);
  initYValues.fill(0);
  const [yValues, setYValues] = useState(initYValues);
  // The filters used in the solution of current question
  const [solFilters, setSolFilters] = useState(getNewParametricSol(filterCount));
  // sol_values on the plot to display solution frequency response (only when easy mode is ON)
  const initSolValues = new Array(sample_count);
  initSolValues.fill(0);
  const [solValues, setSolValues] = useState(initSolValues);
  // Number of questions the user have answered, and how many of them are correct

  const [score, setScore] = useState({ completed: 0, correct: 0 });
  // Whether the user has used easy mode
  const [easyMode, setEasyMode] = useState(false);
  // State of the question: the user is answering or watching result?
  const [submitted, setSubmitted] = useState(false);
  // Whether the solution is correct after submission
  const [feedback, setFeedback] = useState(false);
  // The flag to be passed to FilterSettings to reset sliders
  const [resetSliders, setResetSliders] = useState(0);
  // Player key: the StaticPlayer will be remounted when the key changes
  const [playerKey, setPlayerKey] = useState(0);
  // To record whether the player has started trying out his question
  const [firstSwitch, setFirstSwitch] = useState(false);

  // Action on start
  useEffect(() => {
    // Get random audio file and solution in state definition to avoid errors
    setTrigger(trigger + 1);
  }, []);

  useEffect(() => {
    if (trigger) {
      console.log("solFilters:");
      console.log(solFilters);
      setFilters(solFilters);
      setFilterSettings(getFilterSettings(solFilters));
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
    setUserFilters([]);

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
    const newSolFilters = getNewParametricSol(filterCount);
    setSolFilters(newSolFilters);
    setFilterSettings(getFilterSettings(newSolFilters));
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
    console.log("Switched clicked");
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
  // newFilters: array of CustomEQFilter
  const onSlide = (newFilters) => {
    console.log("sliding")
    console.log(newFilters);
    // Disable fromTrigger here to prevent error caused by multiple rendering at once
    setFromTrigger(false);
    // Update newest user filters, and stay on user view
    setUserFilters(newFilters);
    setFilters(newFilters);
    setFromSlider(true);
  }

  // When easy mode is enabled
  const onEasyMode = () => {
    setEasyMode(true);
    // Force to trigger ParametricPlayer to generate frequency response
    if (viewTarget) {
      setTrigger(trigger + 1);
    }
  }

  // Receive changes from StaticPlayer
  // Note: the order of React computation is: update of state -> re-rendering components -> useEffect -> receive callback from child
  const onResponse = (magResponseList, phaseResponseList) => {
    console.log("responded");
    console.log(magResponseList);
    // Sample the received magResponseList into log samples
    const received_values = new Array(sample_count).fill(0);
    for (let i = 0; i < solFilters.length; i++) {
      for (let j = 0; j < sample_count; j++) {
        received_values[j] += (magResponseList[i][j] - 1);
      }
    }

    // Identify whether this is induced from onSlide, and can assume current view is user
    if (fromSlider) {
      console.log("from slider")
      setYValues(received_values);
    }
    // Identify if this is induced from trigger: if is trigger, update solValues only (currently only onEasyMode causes trigger)
    else if (fromTrigger) {
      console.log('from trigger')
      setSolValues(received_values);
    }
    // Else, it must be switch
    // Due to the order of React computation, on switching pages, the frequency response should be updating the view that is gone
    else {
      if (viewTarget) {
        console.log('from page switch to sol')
        setYValues(received_values);
      }
      else {
        console.log('from page switch to user')
        setSolValues(received_values);
      }
    }
  }

  // When submit button is clicked
  const onSubmit = () => {
    // Check answer
    const result = checkParametricSolution(userFilters, solFilters);
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

  // Foor cookie
  useEffect(() => {
    if (score.completed === qCount) {
      const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith("EQEx="))
        ?.split("=")[1];
      let data = (cookieValue) ? JSON.parse(cookieValue) : { totalEx: 0, totalQ: 0, correct: 0, wrong: 0 };
      data.totalEx++;
      data.totalQ += score.completed;
      data.correct += score.correct;
      data.wrong += score.completed - score.correct;
      document.cookie = `EQEx=${JSON.stringify(data)};`;
    }
  }, [score]);

  const x_tick_cb = (val) => (log_tick_pos.includes(val) ? val : '');
  const y_tick_cb = (val) => (`${val} dB`);

  return (
    <Container size="md" px="md">
      <Stack spacing="lg">
        {/* Title and Subtitle */}
        <Title order={1} align="center">
          Parametric EQ Exercise
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
              {/* Input field for parametric equalization */}
              <ParametricInput filterSettings={filterSettings} onChange={onSlide} resetFlag={resetSliders} />
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
            <ParametricPlayer key={playerKey} audioFile={audioFile} filters={filters} onChange={onResponse} trigger={trigger} />
          </Stack>
        </Card>
      </Stack>
    </Container>
  )
}

export default EQParametric;