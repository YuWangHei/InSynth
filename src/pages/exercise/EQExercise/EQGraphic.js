import { useEffect, useState } from "react";
import { Button, Card, Container, Group, Stack, Switch, Text, Title } from "@mantine/core";
import MathPlot from "./partial/plot/MathPlot";
import StaticPlayer from "./partial/StaticPlayer";
import { freq_centers, generateLogSamples } from "./partial/eq_helper";
import EQPanel from "./partial/EQPanel";
import { useLocation, useNavigate } from "react-router-dom";
import { getRandomAudio } from "../../../Music/AudioPicker";
import { log_tick_pos } from "./partial/eq_helper";

// Reference: https://mp3cut.net/equalizer
function EQGraphic() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    qCount = 3
  } = location.state || {};

  const [audioFile, setAudioFile] = useState(getRandomAudio());
  // Whether the user is listening to the target
  const [viewTarget, setViewTarget] = useState(false);
  // The filter record of what the user currently has
  const [filters, setFilters] = useState(freq_centers.map((val, idx) => {
    // https://stackoverflow.com/questions/48844865/in-the-web-audio-api-how-to-set-correctly-the-q-value-of-a-biquadfilter-for-1-3
    // https://stackoverflow.com/questions/30065093/web-audio-api-equalizer
    // https://www.earlevel.com/main/2016/12/01/evaluating-filter-frequency-response/

    const prev_octave = val / 2;
    const next_octave = val * 2;
    const lower = val - (val - prev_octave);
    const upper = val + (next_octave - val);
    const qValue = val / (upper - lower);

    // First frequency range: low shelf instead of peaking
    if (idx === 0) {
      return { type: 'lowshelf', freq: val, q: 1, gain: 0 }; // q is unused in shelf
    }
    // Last frequency range: high self instead of peaking
    if (idx === freq_centers.length - 1) {
      return { type: 'highshelf', freq: val, q: 1, gain: 0 }; // q is unused in shelf
    }
    // Frequency ranges in the middle: peaking filters
    return { type: 'peaking', freq: val, q: 1, gain: 0 };
  }));
  // y_values on the plot
  const [yValues, setYValues] = useState(new Array(generateLogSamples().length).fill(0));

  // Action on start
  useEffect(() => {
    const newAudioFile = getRandomAudio();
    setAudioFile(newAudioFile);
  }, []);

  // Create new set of EQ as answer
  const getNewEQ = () => {
    const pattern = Math.floor(Math.random() * 3);
    // Pattern 1: Random two peaks with random values
    if (pattern === 0) {

    }
    else if (pattern === 1) {

    }
    else if (pattern === 2) {

    }
    else {

    }
  }

  const nextQuestion = () => {
    // Obtain new audio file
    const newAudioFile = getRandomAudio();
    setAudioFile(newAudioFile);
    // Generate new eq
  }

  const startOver = () => {

  }

  // Receive changes from EQPanel sliders
  const onSlide = (newSliderValues) => {
    // Forward filter changes to StaticPlayer
    // No. of filters = no. of sliders
    const newFilters = filters.map((obj, idx) => {
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
    setFilters(newFilters);
  }


  // Receive changes from StaticPlayer
  const onFilter = (magResponseList, phaseResponseList) => {
    const y_values = new Array(generateLogSamples().length).fill(0);
    for (let i = 0; i < filters.length; i++) {
      for (let j = 0; j < yValues.length; j++) {
        y_values[j] += (magResponseList[i][j] - 1);
      }
    }
    setYValues(y_values);
  }


  // When submit is clicked
  const onSubmit = () => {
    console.log('submitted!');
    // Check answer
    // Next question
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
            <div style={{ filter: viewTarget ? 'blur(5px)' : 'none', pointerEvents: viewTarget ? 'none' : 'auto' }}>
              <MathPlot
                y_values={yValues}
                x_bounds={{ min: 0, max: 22000 }}
                y_bounds={{ min: -1, max: 1 }}
                x_tick={2000}
                y_tick={0.5}
                x_tick_cb={x_tick_cb}
                y_tick_cb={y_tick_cb}
                curve_name="Frequency Response"
                log_scale={true}
              />
            </div>
            {/* Panel for frequency-amplitude equalization */}
            <div style={{ filter: viewTarget ? 'blur(5px)' : 'none', pointerEvents: viewTarget ? 'none' : 'auto' }}>
              <EQPanel onChange={onSlide} />
            </div>
            {/* Switch, select to listen to synth audio or target audio */}
            <Group>
              <Text>Listen to... Synth</Text>
              <Switch onChange={(event) => setViewTarget(event.currentTarget.checked)} />
              <Text>Target</Text>
            </Group>
            {/* Audio player */}
            <StaticPlayer audioFile={audioFile} filters={filters} onChange={onFilter} />
            {/* Submit button */}
            <Button onClick={onSubmit}>Submit</Button>
          </Stack>
        </Card>
      </Stack>
    </Container>
  )
}

export default EQGraphic;