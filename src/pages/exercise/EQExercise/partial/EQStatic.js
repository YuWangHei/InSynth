import { useEffect, useState } from "react";
import { Box, Button, Group, Switch, Text } from "@mantine/core";
import MathPlot from "./plot/MathPlot";
import StaticPlayer from "./StaticPlayer";
import { freq_centers } from "./eq_helper";
import CustomContainer from "../../../../components/CustomContainer";
import EQPanel from "./EQPanel";
import VSlider from "../../../../components/VSlider";

function EQStatic({ audioFile }) {
  const [plotExpr, setPlotExpr] = useState('0');
  // Whether the user is listening to the target
  const [viewTarget, setViewTarget] = useState(false);
  // The filter record of what the user currently has
  const [filters, setFilters] = useState(freq_centers.map((val) => {
    return { type: 'peaking', freq: val, q: 1, gain: 0 };
  }));


  // Receive changes from EQPanel sliders
  const onSlide = (newSliderValues) => {
    // Forward filter changes to StaticPlayer


    // Adjust plot
  }


  // Submit answer for answer checking
  const onSubmit = () => {
    console.log('submitted!');
  }


  return (
    <CustomContainer size="md" title={"\"Static\" EQ"}>
      {/* MathPlot, blur when listening to target */}
      <div style={{ filter: viewTarget ? 'blur(5px)' : 'none', pointerEvents: viewTarget ? 'none' : 'auto' }}>
        <MathPlot expr={plotExpr} x_bounds={{ min: 0, max: 22000 }} y_bounds={{ min: -6, max: 6 }} x_tick={2000} y_tick={2} curve_name="Frequency Response" log_scale={true} />
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
      {/* Submit button */}
      <Button onClick={onSubmit}>Submit</Button>
      {/* Audio player */}
      <StaticPlayer audioFile={audioFile} filters={filters} />
    </CustomContainer>
  )
}

export default EQStatic;