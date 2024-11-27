import * as math from "mathjs";
import { Flex } from "@mantine/core";
import LinearPlot from "./LinearPlot";
import LogPlot from "./LogPlot";
import { sampling_freq, generateLogSamples, log_tick_pos, generatePeakingCurveSegment } from "../eq_helper";
import { useEffect, useState } from "react";

// x_bounds must be divisible by x_tick
function MathPlot({ filters = [], x_bounds = { min: 0, max: 5 }, y_bounds = { min: 0, max: 1 }, x_tick = 1, y_tick = 1, curve_name = 'curve', log_scale = false }) {
  // Take samples for plotting
  const x_range = x_bounds.max - x_bounds.min;
  const x_intervals = x_range / x_tick // number of interval needed
  const sample_size = sampling_freq * x_intervals;
  const x_values = log_scale ? generateLogSamples() : Array.from({ length: sample_size }, (val, idx) => (x_bounds.min + idx * x_intervals * x_tick / sample_size)); // generate linear scale and log scale samples separately

  const createData = (filters = []) => {
    // Initial data: all zeros
    const y_values = new Array(sample_size).fill(0);
    // Sum all filters to give the resulting graph
    filters.map((obj) => {
      if (obj.type === 'peaking') {
        const return_values = generatePeakingCurveSegment(obj);
        if (return_values) {
          return_values.map((val, idx) => {
            y_values[idx] += val;
          });
        }
      }
    });
    // Create data separately
    // For log scale
    if (log_scale) {
      const newData = {
        labels: x_values, // x labels
        datasets: [
          {
            label: curve_name,
            data: y_values,
            fill: false,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            pointRadius: 0,
          }
        ]
      }
      return newData;
    }
    // For linear scale
    const newData = {
      datasets: [
        {
          label: curve_name,
          data: x_values.map((val, idx) => {
            return { x: val, y: y_values[idx] };
          }),
          fill: false,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          pointRadius: 0,
        }
      ]
    }
    return newData;
  }

  const [data, setData] = useState(createData());

  // On new pass of filter to here
  useEffect(() => {
    const newData = createData(filters);
    setData(newData);
  }, [filters]);

  // Options for chart
  const linear_params = { x_bounds, y_bounds, x_tick, y_tick };
  const log_params = { y_bounds, y_tick };

  return (
    <Flex>
      {log_scale ?
        <LogPlot
          data={data}
          params={log_params}
        />
        :
        <LinearPlot
          data={data}
          params={linear_params}
        />}
    </Flex>
  )
}

export default MathPlot;