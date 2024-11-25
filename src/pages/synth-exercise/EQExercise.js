import { useState } from "react";
import Frame from "../Frame";
import MathPlot from "./partial/MathPlot";
import { Button, Switch, TextInput } from "@mantine/core";

function EQExercise() {
  const [inputExpr, setInputExpr] = useState('0');
  const [plotExpr, setPlotExpr] = useState('0');
  const [logScale, setLogScale] = useState(false);

  return (
    <Frame>
      <MathPlot expr={plotExpr} x_bounds={{ a: -1, b: 11 }} y_bounds={{ a: -10, b: 10 }} curve_name="Frequency Response" log_scale={logScale} />
      <TextInput label="Expression" placeholder="Enter expression" onChange={(event) => setInputExpr(event.target.value)} />
      <Button onClick={() => setPlotExpr(inputExpr)}>Click me</Button>
      <Switch checked={logScale} onChange={(event) => setLogScale(event.currentTarget.checked)} />
    </Frame>
  )
}

export default EQExercise;