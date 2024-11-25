import { Line } from "react-chartjs-2";

function LinearPlot({ data, params: { x_bounds: { a: x_min, b: x_max }, y_bounds: { a: y_min, b: y_max }, x_tick, y_tick } }) {
  return (
    <Line
      data={data}
      options={{
        responsive: true,
        scales: {
          x: {
            type: 'linear',
            min: x_min,
            max: x_max,
            ticks: {
              stepSize: x_tick,
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
              stepSize: y_tick,
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

export default LinearPlot;