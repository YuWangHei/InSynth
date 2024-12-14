import { useEffect, useState } from "react";
import HSlider from "../../../../../components/HSlider";
import { Card, Stack, Text } from "@mantine/core";
import { dbBound, log_bounds, qBound } from "./utilsParametric";

// setting: {type: string, freq: bool, gain: bool, q: bool}
function ParameterBlock({ setting, onChange, blockIndex = 0, resetFlag }) {
  // Map the type to name
  const typeToName = { "peaking": "Peaking Filter", "lowshelf": "Low Shelf Filter", "lowpass": "Low Pass Filter", "highshelf": "High Shelf Filter", "highpass": "High Pass Filter" };
  const [filter, setFilter] = useState({ freq: 663, gain: 0, q: 1 });

  useEffect(() => {
    if (resetFlag) {
      setFilter({ freq: 0, gain: 0, q: 1 });
    }
  }, [resetFlag]);

  const onFreqSlide = (newVal, index) => {
    const newFilter = { freq: newVal, gain: filter.gain, q: filter.q };
    setFilter(newFilter);
    if (onChange) {
      onChange(newFilter, blockIndex);
    }
  }

  const onGainSlide = (newVal, index) => {
    const newFilter = { freq: filter.freq, gain: newVal, q: filter.q };
    setFilter(newFilter);
    if (onChange) {
      onChange(newFilter, blockIndex);
    }
  }

  const onQSlide = (newVal, index) => {
    const newFilter = { freq: filter.freq, gain: filter.gain, q: newVal };
    setFilter(newFilter);
    if (onChange) {
      onChange(newFilter, blockIndex);
    }
  }

  const freqScaler = (min, max, x) => {
    const log_min = Math.log10(min);
    const log_max = Math.log10(max);
    const scaled_x = Math.pow(10, x * (log_max - log_min) + log_min);
    return scaled_x.toFixed(0);
  }

  const qScaler = (min, max, x) => {
    const log_min = Math.log10(min);
    const log_max = Math.log10(max);
    const scaled_x = Math.pow(10, x * (log_max - log_min) + log_min);
    return scaled_x.toFixed(1);
  }

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Stack>
        <Text>{typeToName[setting.type]}</Text>
        {setting.freq &&
          <Stack>
            <Text>Frequency: {filter.freq}</Text>
            <HSlider onChange={onFreqSlide} min={log_bounds.min} max={log_bounds.max} scalingFunc={freqScaler} resetFlag={resetFlag} />
          </Stack>
        }
        {setting.gain &&
          <Stack>
            <Text>Gain: {filter.gain}</Text>
            <HSlider onChange={onGainSlide} min={dbBound.min} max={dbBound.max} resetFlag={resetFlag} />
          </Stack>
        }
        {setting.q &&
          <Stack>
            <Text>Q Factor: {filter.q}</Text>
            <HSlider onChange={onQSlide} min={qBound.min} max={qBound.max} scalingFunc={qScaler} resetFlag={resetFlag} />
          </Stack>
        }
      </Stack>
    </Card>
  )
}

export default ParameterBlock;