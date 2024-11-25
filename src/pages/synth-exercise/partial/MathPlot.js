import * as math from "mathjs";
import { Line } from "react-chartjs-2";
import LinearPlot from "./LinearPlot";
import LogPlot from "./LogPlot";

const sampling_freq = 12; // 100 samples per interval

// x_bounds must be divisible by x_tick
function MathPlot({ expr = '0', x_bounds = { a: 0, b: 5 }, y_bounds = { a: 0, b: 1 }, x_tick = 1, y_tick = 1, curve_name = 'curve', x_label = 'x-axis', y_label = 'y-axis', log_scale = false }) {
  // Take samples for plotting
  const x_range = x_bounds.b - x_bounds.a;
  const x_intervals = x_range / x_tick // number of interval needed
  const sample_size = sampling_freq * x_intervals;
  const x_values = Array.from({ length: sample_size }, (val, idx) => (x_bounds.a + idx * x_intervals / sample_size));
  const y_values = x_values.map(x => math.evaluate(expr, { x: x }));
  const data = {
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
  const params = { x_bounds, y_bounds, x_tick, y_tick };

  return (
    <div>
      {log_scale ?
        <LinearPlot
          data={data}
          params={params}
        />
        :
        <LinearPlot
          data={data}
          params={params}
        />}
    </div>
  )
  return (
    <Line data={{
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
    }} options={{
      responsive: true,
      scales: {
        x: {
          type: 'linear',
          min: x_bounds.a,
          max: x_bounds.b,
          ticks: {
            stepSize: x_tick,
            autoSkip: true,
          },
          title: {
            display: true,
            text: x_label
          }
        },
        y: {
          type: 'linear',
          min: y_bounds.a,
          max: y_bounds.b,
          ticks: {
            stepSize: y_tick,
            autoSkip: true,
          },
          title: {
            display: true,
            text: y_label
          }
        }
      }
    }} />
  )
}

export default MathPlot;