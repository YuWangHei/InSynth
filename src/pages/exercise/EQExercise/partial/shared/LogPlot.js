import { useRef, useEffect, useMemo } from "react";
import { Chart as ChartJS, LogarithmicScale } from "chart.js";
import { Line } from "react-chartjs-2";
import { log_tick_pos } from "../graphic/utilsGraphic";

// Register necessary Chart.js components
ChartJS.register(LogarithmicScale);

// Chart.js plugin to customize ticks
const customLogScalePlugin = {
  id: "customLogScale",
  beforeInit: (chart) => {
    const log_scale = chart.options.scales.x;
    if (log_scale.type === "logarithmic") {
      // Override the default ticks generation
      log_scale.afterBuildTicks = (scale) => {
        // Replace default ticks with custom positions
        scale.ticks = log_tick_pos.map((value) => ({
          value: value, // Tick position
        }));

        // Ensure the scale knows about the min and max
        scale.min = Math.min(...log_tick_pos);
        scale.max = Math.max(...log_tick_pos);

        return scale.ticks;
      };
    }
  },
};

ChartJS.register(customLogScalePlugin);

const LogPlot = ({ data, params: { y_bounds: { min: y_min, max: y_max }, y_tick, x_tick_cb, y_tick_cb } }) => {
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
  }, []);

  const options = useMemo(() => ({
    responsive: true,
    //maintainAspectRatio: false, // Prevent aspect ratio from affecting scaling
    scales: {
      x: {
        type: "logarithmic",
        title: {
          display: true,
          text: "Frequency (Hz)",
        },
        ticks: {
          callback: x_tick_cb,
        },
      },
      y: {
        type: "linear",
        title: {
          display: true,
          text: "Amplitude",
        },
        min: y_min,
        max: y_max,
        ticks: {
          stepSize: y_tick,
          callback: y_tick_cb,
        },
      },
    },
  }), [y_min, y_max, y_tick]);

  return (
    <Line ref={chartRef} data={data} options={options} />
  );
};

export default LogPlot;