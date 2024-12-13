import { Flex, Group, Stack, Text } from "@mantine/core";
import { freq_centers } from "./utilsGraphic";
import VSlider from "../../../../components/VSlider";
import { useEffect, useState } from "react";

function EQPanel({ onChange, resetFlag }) {
  const [sliderValues, setSliderValues] = useState(freq_centers.map(() => 0));

  useEffect(() => {
    if (resetFlag) {
      setSliderValues(freq_centers.map(() => 0));
    }
  }, [resetFlag]);

  // Edit sliderValues onSlide
  const onSlide = (newVal, index) => {
    const newSliderValues = [...sliderValues];
    newSliderValues[index] = newVal;
    setSliderValues(newSliderValues);
    // Return the changes to parent
    if (onChange)
      onChange(newSliderValues);
  }

  return (
    <Flex justify="center">
      <Group gap="xl" justify="space-between">
        {freq_centers.map((val, idx) => {
          return (
            <Stack key={`panel-stack-${idx}`} align="center">
              <VSlider min={-100} max={100} onChange={onSlide} index={idx} key={`panel-vslider-${idx}`} resetFlag={resetFlag} />
              <Text key={`panel-text-${idx}`}>{`${val} Hz`}</Text>
            </Stack>
          )
        })}
      </Group>
    </Flex>
  )
}

export default EQPanel;