import { useState, useEffect } from "react";
import { Group, Text, Switch } from "@mantine/core";
import MathPlot from "./plot/MathPlot";
import LoopPlayer from "./LoopPlayer";
import CustomContainer from "../../../components/CustomContainer";

function EQParametric({ audioFile }) {
  const [plotExpr, setPlotExpr] = useState('0');
  // Whether the user is listening to the target
  const [viewTarget, setViewTarget] = useState(false);

  // To play safe, when an audioFile is passed, reset states
  useEffect(() => {
    setPlotExpr('0');
    setViewTarget(false);
  }, [audioFile]);

  return (
    <CustomContainer size="md" title="Parametric EQ">
      {/* MathPlot, blur when listening to target */}
      <div style={{ filter: viewTarget ? 'blur(5px)' : 'none' }}>
        <MathPlot expr={plotExpr} x_bounds={{ min: 0, max: 22000 }} y_bounds={{ min: -1, max: 1 }} x_tick={2000} y_tick={0.5} curve_name="Frequency Response" log_scale={true} />
      </div>
      {/* Switch, select to listen to synth audio or target audio */}
      <Group>
        <Text>Synth</Text>
        <Switch onChange={(event) => setViewTarget(event.currentTarget.checked)} />
        <Text>Target</Text>
      </Group>
      {/* Audio player */}
      <LoopPlayer audioFile={audioFile} />
    </CustomContainer>
  )
}

export default EQParametric;