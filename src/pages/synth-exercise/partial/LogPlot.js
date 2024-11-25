import { Chart, registerables } from "chart.js";
import { Line } from "react-chartjs-2";

// Register all necessary components for Chart.js
Chart.register(...registerables);

function LogPlot({ data, params: { x_bounds: { a: x_min, b: x_max }, y_bounds: { a: y_min, b: y_max }, x_tick, y_tick } }) {
  return (
    <Line
      data={data}
      options={{
        responsive: true,
        scales: {
          x: {
            type: 'logarithmic',
            min: x_min,
            max: x_max,
            ticks: {
              autoSkip: true,
            },
            title: {
              display: true,
              text: 'Frequency'
            }
          },
          y: {
            type: 'linear',
            min: y_min,
            max: y_max,
            ticks: {
              autoSkip: true,
            },
            title: {
              display: true,
              text: 'Amplitude'
            }
          }
        }
      }}
    />
  )
}

export default LogPlot;