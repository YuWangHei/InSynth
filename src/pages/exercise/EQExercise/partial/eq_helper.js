import * as math from 'mathjs'

const sampling_freq = 60;
const freq_centers = [60, 150, 400, 1000, 2400, 5800, 14000];
const log_bounds = { min: 20, max: 22000 };
const log_tick_pos = [log_bounds.min, ...freq_centers, log_bounds.max];
const sliderGainRatio = 24; // max in slider corresponds to 18 dB

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

// From center frequency, q factor, and gain, generate an array of samples taken on the peaking filter approximation
// Reference: https://math.stackexchange.com/questions/4045362/efficient-way-to-model-this-peaking-filter-function
function generatePeakingCurveSegment(obj) {
  console.log('Enter')
  const { freq, q, gain } = obj;
  if (gain === 0) return false;
  const width = freq / q; // bandwidth

  // Define constants to be used for formula construction
  const c = [
    '((C * (B^4 - 8 * (B^2) * (A^2) + 16 * (A^4))) / (B^4))',
    '((16 * C * ((B^2) * A - 4 * (A^3))) / (B^4))',
    '((-8 * C * ((B^2) - 12 * (A^2))) / (B^4))',
    '((-64 * C * A) / (B^4))',
    '((16 * C) / (B^4))',
  ];

  // Substitude values into c
  const val_c = c.map((str) => str.replaceAll('A', `${freq}`).replaceAll('B', `${width}`).replaceAll('C', `${gain}`));

  // Construct formula
  const formula = val_c.map((str, idx) => `${str} * (x^${idx})`).join(' + ');

  // Sampling
  console.log(formula);
  const x_values = generateLogSamples();
  const y_values = x_values.map(x => {
    if (x >= (freq - width / 2) && x <= (freq + width / 2)) {
      console.log('calculating')
      try {
        return math.evaluate(formula, { x });
      } catch (error) {
        console.error('Error evaluating formula:', error);
        return 0;
      }

    }
    return 0;
  });
  console.log(y_values);
  return y_values;
}

export { sampling_freq, freq_centers, log_bounds, log_tick_pos, sliderGainRatio, generateLogSamples, generatePeakingCurveSegment };