import { useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";

function LinearPlot({ data, params: { x_bounds: { min: x_min, max: x_max }, y_bounds: { min: y_min, max: y_max }, x_tick, y_tick } }) {
  // Create reference to the chart for ease of cleanup
  const chartRef = useRef(null);
  // Whenever there is any changes, cleanup chart
  useEffect(() => {
    return () => {
      // Destroy chart instance if it exists
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
    // The chart will be generated once again because something has changed
  }, []);

  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'linear',
        title: {
          display: true,
          text: 'Frequency (Hz)'
        },
        min: x_min,
        max: x_max,
        ticks: {
          stepSize: x_tick,
          autoSkip: true,
        },
      },
      y: {
        type: 'linear',
        title: {
          display: true,
          text: 'Amplitude'
        },
        min: y_min,
        max: y_max,
        ticks: {
          stepSize: y_tick,
          autoSkip: true,
        },
      }
    }
  };

  return (
    <Line ref={chartRef} data={data} options={options} />
  )
}

export default LinearPlot;