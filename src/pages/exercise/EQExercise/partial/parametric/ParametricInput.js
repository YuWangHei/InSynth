import { Divider, Flex, Group, Stack } from "@mantine/core";
import ParameterBlock from "./ParameterBlock";
import { useEffect, useState } from "react";
import { CustomEQFilter } from "./utilsParametric";


function ParametricInput({ filterSettings = [], onChange, resetFlag }) {
  const [filters, setFilters] = useState([]);

  // On start, initialize filters
  useEffect(() => {
    const newFilters = filterSettings.map((obj) => {
      return new CustomEQFilter(obj.type, 663, 1, 0);
    });
    setFilters(newFilters);
    // Return changes to parent
    if (onChange) {
      onChange(newFilters);
    }
  }, []);

  useEffect(() => {
    if (resetFlag) {
      const newFilters = filterSettings.map((obj) => {
        return new CustomEQFilter(obj.type, 663, 1, 0);
      });
      setFilters(newFilters);
    }
  }, [filterSettings, resetFlag]);

  const onSlide = (newFilter, index) => {
    const newFilters = [...filters];
    newFilters[index] = new CustomEQFilter(filters[index].type, newFilter.freq, newFilter.q, newFilter.gain);
    setFilters(newFilters);
    // Return changes to parent
    if (onChange)
      onChange(newFilters);
  }

  return (
    <Flex justify="center">
      {filterSettings.map((obj, idx) => {
        return (
          <Stack key={`input-stack-${idx}`} align="center">
            <Divider />
            <ParameterBlock key={`input-block-${idx}`} setting={obj} onChange={onSlide} blockIndex={idx} />
          </Stack>
        )
      })}
    </Flex>
  )
}

export default ParametricInput;