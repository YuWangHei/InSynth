import { useState } from "react";
import Frame from "../Frame";
import MathPlot from "./partial/MathPlot";
import { Button, Switch, TextInput } from "@mantine/core";

function EQExercise() {
  const [inputExpr, setInputExpr] = useState('log10(x)');
  const [plotExpr, setPlotExpr] = useState('log10(x)');
  const [logScale, setLogScale] = useState(false);

  return (
    <Frame>
      <MathPlot expr={plotExpr} x_bounds={{ min: 0, max: 22000 }} y_bounds={{ min: -5, max: 5 }} x_tick={2000} curve_name="Frequency Response" log_scale={logScale} />
      <TextInput label="Expression" placeholder="Enter expression" onChange={(event) => setInputExpr(event.target.value)} />
      <Button onClick={() => setPlotExpr(inputExpr)}>Click me</Button>
      <Switch checked={logScale} onChange={(event) => setLogScale(event.currentTarget.checked)} />
    </Frame>
  )
}

export default EQExercise;