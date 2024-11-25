import { Flex } from "@mantine/core";
import styled from "styled-components";

const Slider = styled.input`
  -webkit-appearance: slider-vertical;
  height: 200px;
  width: 20px;
  background: #4a4a4a;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    background: #00ff88;
    border-radius: 50%;
    cursor: pointer;
  }
`;

function VSlider({ value, onChange, min = -100, max = 100, step = 1 }) {
  return (
    <Slider type='range' value={value} onChange={onChange} min={min} max={max} step={step} />
  );
}

function HSlider({ value, onChange, min, max, step }) {
  return (
    <Slider type='range' value={value} onChange={onChange} min={min} max={max} step={step} />
  )
}

export { VSlider, HSlider };