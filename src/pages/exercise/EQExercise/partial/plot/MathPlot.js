import * as math from "mathjs";
import { Flex } from "@mantine/core";
import LinearPlot from "./LinearPlot";
import LogPlot from "./LogPlot";
import { sampling_freq, generateLogSamples, log_tick_pos } from "../eq_helper";

// x_bounds must be divisible by x_tick
function MathPlot({ expr = '0', x_bounds = { min: 0, max: 5 }, y_bounds = { min: 0, max: 1 }, x_tick = 1, y_tick = 1, curve_name = 'curve', log_scale = false }) {
  // Take samples for plotting
  const x_range = x_bounds.max - x_bounds.min;
  const x_intervals = x_range / x_tick // number of interval needed
  const sample_size = sampling_freq * x_intervals;
  const x_values = log_scale ? generateLogSamples() : Array.from({ length: sample_size }, (val, idx) => (x_bounds.min + idx * x_intervals * x_tick / sample_size)); // generate linear scale and log scale samples separately
  const y_values = x_values.map(x => math.evaluate(expr, { x }));
  // console.log(x_values);
  // Create data separately
  const linear_data = {
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
  const log_data = {
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

  // Options for chart
  const linear_params = { x_bounds, y_bounds, x_tick, y_tick };
  const log_params = { y_bounds, y_tick };

  return (
    <Flex>
      {log_scale ?
        <LogPlot
          data={log_data}
          params={log_params}
        />
        :
        <LinearPlot
          data={linear_data}
          params={linear_params}
        />}
    </Flex>
  )
}

export default MathPlot;