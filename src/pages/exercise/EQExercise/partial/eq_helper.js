const sampling_freq = 60;
const freq_centers = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
const log_bounds = { min: 20, max: 22000 };
const log_tick_pos = [log_bounds.min, ...freq_centers, log_bounds.max];

// Generate x_values for log scale graph
function generateLogSamples() {
  const arr = [];
  for (let i = 0; i < log_tick_pos.length; i++) {
    // Define bounds: {sampling_freq} no. of elements are going to be uniformly distributed within this interval
    let bounds;
    if (i !== log_tick_pos.length - 1) {
      bounds = { min: log_tick_pos[i], max: log_tick_pos[i + 1] };
      // Push each sample into array
      for (let j = 0; j < sampling_freq; j++) {
        const x = bounds.min + j * (bounds.max - bounds.min) / sampling_freq;
        arr.push(x);
      }
    }
  }
  return arr;
}

export { sampling_freq, freq_centers, log_bounds, log_tick_pos, generateLogSamples };