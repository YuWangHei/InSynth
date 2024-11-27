import { useEffect, useState } from "react";
import { Box, Button, Group, Switch, Text } from "@mantine/core";
import MathPlot from "./plot/MathPlot";
import StaticPlayer from "./StaticPlayer";
import { freq_centers, generateLogSamples, generatePeakingCurveSegment, sliderGainRatio } from "./eq_helper";
import CustomContainer from "../../../../components/CustomContainer";
import EQPanel from "./EQPanel";

function EQStatic({ audioFile }) {
  // Whether the user is listening to the target
  const [viewTarget, setViewTarget] = useState(false);
  // The filter record of what the user currently has
  const [filters, setFilters] = useState(freq_centers.map((val) => {
    return { type: 'peaking', freq: val, q: 1, gain: 0 };
  }));
  // y_values on the plot
  const [yValues, setYValues] = useState(new Array(generateLogSamples().length).fill(0));


  // Receive changes from EQPanel sliders
  const onSlide = (newSliderValues) => {
    // Forward filter changes to StaticPlayer
    // No. of filters = no. of sliders
    const newFilters = filters.map((obj, idx) => {
      obj.gain = newSliderValues[idx] / 100 * sliderGainRatio;
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


  // Submit answer for answer checking
  const onSubmit = () => {
    console.log('submitted!');
  }


  return (
    <CustomContainer size="md" title={"\"Static\" EQ"}>
      {/* MathPlot, blur when listening to target */}
      <div style={{ filter: viewTarget ? 'blur(5px)' : 'none', pointerEvents: viewTarget ? 'none' : 'auto' }}>
        <MathPlot y_values={yValues} x_bounds={{ min: 0, max: 22000 }} y_bounds={{ min: -2, max: 2 }} x_tick={2000} y_tick={2} curve_name="Frequency Response" log_scale={true} />
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
    </CustomContainer>
  )
}

export default EQStatic;