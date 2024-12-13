import { Flex } from "@mantine/core";
import LinearPlot from "./LinearPlot";
import LogPlot from "./LogPlot";
import { sampling_freq, generateLogSamples } from "../graphic/utilsGraphic";
import { useEffect, useState } from "react";

// x_bounds must be divisible by x_tick
function MathPlot({
  y_values = [],
  sol_values = null,
  x_bounds = { min: 0, max: 5 },
  y_bounds = { min: 0, max: 1 },
  x_tick = 1,
  y_tick = 1,
  x_tick_cb = (val) => val,
  y_tick_cb = (val) => val,
  curve_name = 'curve',
  log_scale = false
}) {
  // Take samples for plotting
  const x_range = x_bounds.max - x_bounds.min;
  const x_intervals = x_range / x_tick // number of interval needed
  const sample_size = sampling_freq * x_intervals;
  const x_values = log_scale ? generateLogSamples() : Array.from({ length: sample_size }, (val, idx) => (x_bounds.min + idx * x_intervals * x_tick / sample_size)); // generate linear scale and log scale samples separately

  const createLogData = () => {
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
    if (sol_values) { // If solution line is not null
      newData.datasets.push({
        label: 'Solution',
        data: sol_values,
        fill: false,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        pointRadius: 0,
      })
    }
    return newData;
  }

  const createLinearData = () => {
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
    if (sol_values) { // If solution line is not null
      newData.datasets.push({
        label: 'Solution',
        data: sol_values,
        fill: false,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      })
    }
    return newData;
  }

  const [data, setData] = useState(log_scale ? createLogData() : createLinearData());

  // On new pass of user filter to here
  useEffect(() => {
    const newData = log_scale ? createLogData() : createLinearData();
    setData(newData);
  }, [y_values, sol_values]);

  // Options for chart
  const linear_params = { x_bounds, y_bounds, x_tick, y_tick };
  const log_params = { y_bounds, y_tick, x_tick_cb, y_tick_cb };

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