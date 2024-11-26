import { useEffect, useState } from "react";
import { Box, Button, Group, Switch, Text } from "@mantine/core";
import MathPlot from "./plot/MathPlot";
import LoopPlayer from "./LoopPlayer";
import { freq_centers } from "./eq_helper";
import CustomContainer from "../../../components/CustomContainer";
import EQPanel from "./EQPanel";
import VSlider from "../../../components/VSlider";

function EQStatic({ audioFile }) {
  const [plotExpr, setPlotExpr] = useState('0');
  // Whether the user is listening to the target
  const [viewTarget, setViewTarget] = useState(false);
  // The EQ record of what the user currently has
  const [EQ, setEQ] = useState(freq_centers.map((val) => {
    return { freq: val, q: 1, gain: 0 };
  }));

  // To play safe, when an audioFile is passed, reset states
  useEffect(() => {
    setPlotExpr('0');
    setViewTarget(false);
    setEQ(freq_centers.map((val) => {
      return { freq: val, q: 1, gain: 0 };
    }));
  }, [audioFile]);

  return (
    <CustomContainer size="md" title={"\"Static\" EQ"}>
      {/* MathPlot, blur when listening to target */}
      <div style={{ filter: viewTarget ? 'blur(5px)' : 'none', pointerEvents: viewTarget ? 'none' : 'auto' }}>
        <MathPlot expr={plotExpr} x_bounds={{ min: 0, max: 22000 }} y_bounds={{ min: -1, max: 1 }} x_tick={2000} y_tick={0.5} curve_name="Frequency Response" log_scale={true} />
      </div>
      {/* Panel for frequency-amplitude equalization */}
      <div style={{ filter: viewTarget ? 'blur(5px)' : 'none', pointerEvents: viewTarget ? 'none' : 'auto' }}>
        <EQPanel />
      </div>
      {/* Switch, select to listen to synth audio or target audio */}
      <Group>
        <Text>Listen to... Synth</Text>
        <Switch onChange={(event) => setViewTarget(event.currentTarget.checked)} />
        <Text>Target</Text>
      </Group>
      {/* Submit button */}
      <Button>Submit</Button>
      {/* Audio player */}
      <LoopPlayer audioFile={audioFile} />
      <VSlider />
    </CustomContainer>
  )
}

export default EQStatic;