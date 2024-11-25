import { useEffect, useState } from "react";
import Frame from "../Frame";
import MathPlot from "./partial/MathPlot";
import { Button, Switch, Text } from "@mantine/core";
import HSlider from "../../components/HSlider";
import VSlider from "../../components/VSlider";
import * as Tone from 'tone';
import { audio1, audio2 } from '../../Music'
import LoopPlayer from "./partial/LoopPlayer";
import { getRandomAudio } from "../AudioPicker";

function EQExercise() {
  const [inputExpr, setInputExpr] = useState('0');
  const [plotExpr, setPlotExpr] = useState('0');
  // const [logScale, setLogScale] = useState(true);
  const [sliderVal, setSliderVal] = useState(0);

  return (
    <Frame>
      <MathPlot expr={plotExpr} x_bounds={{ min: 0, max: 22000 }} y_bounds={{ min: -1, max: 1 }} x_tick={2000} y_tick={0.5} curve_name="Frequency Response" log_scale={true} />
      {/* <TextInput label="Expression" placeholder="Enter expression" onChange={(event) => setInputExpr(event.target.value)} />
      <Button onClick={() => setPlotExpr(inputExpr)}>Click me</Button>
      <Switch checked={logScale} onChange={(event) => setLogScale(event.currentTarget.checked)} /> */}
      <LoopPlayer audioFile={getRandomAudio()} />
    </Frame>
  )
}

export default EQExercise;