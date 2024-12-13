// General purpose function: Generate integer from min to max inclusively
const randomRange = (min = -100, max = 100) => {
  const result = Math.floor(Math.random() * (max + 1)) + min;
  return result;
}

// Prototype for customized eq filter object
class CustomEQFilter {
  constructor(type, freq, q, gain) {
    this.type = type;
    this.freq = freq;
    this.q = q;
    this.gain = gain;
  }
}

// Constants (Part 1)
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
// https://stackoverflow.com/questions/48844865/in-the-web-audio-api-how-to-set-correctly-the-q-value-of-a-biquadfilter-for-1-3
// https://stackoverflow.com/questions/30065093/web-audio-api-equalizer
// https://www.earlevel.com/main/2016/12/01/evaluating-filter-frequency-response/

// Possibly useful but unused:
// https://dsp.stackexchange.com/questions/3091/plotting-the-magnitude-response-of-a-biquad-filter
// https://www.w3.org/TR/audio-eq-cookbook/#formulae
// https://stackoverflow.com/questions/25692034/plotting-a-frequency-response-from-biquad-filter

// TODO: remove?
// const prev_octave = val / 2;
// const next_octave = val * 2;
// const lower = val - (val - prev_octave);
// const upper = val + (next_octave - val);
// const qValue = val / (upper - lower);
function getInitGraphicFilters() {
  const init_filters = freq_centers.map((val, idx) => {
    // First frequency range: low shelf instead of peaking
    if (idx === 0) {
      return new CustomEQFilter('lowshelf', val, 1, 0); // q is unused in shelf
    }
    // Last frequency range: high self instead of peaking
    if (idx === freq_centers.length - 1) {
      return new CustomEQFilter('highshelf', val, 1, 0); // q is unused in shelf
    }
    // Frequency ranges in the middle: peaking filters
    return new CustomEQFilter('peaking', val, 1, 0);
  });
  return init_filters;
}

// Constants (Part 2)
const filter_count = getInitGraphicFilters().length;
const sample_count = generateLogSamples().length;

// Create new set of EQ solution (array of filters) for graphic eq
const getNewGraphicSol = () => {
  return getInitGraphicFilters().map((obj) => {
    return new CustomEQFilter(obj.type, obj.freq, obj.q, -0.8);
  })
  const pattern = randomRange(0, 9);
  const sol_filters = getInitGraphicFilters();
  // return sol_filters.map((obj) => obj.gain = -10);
  // Pattern 1 (6): Random two filters with random values
  if (0 <= pattern <= 5) {
    // Pick two random frequency ranges
    let pos1, pos2, gain1, gain2;
    pos1 = Math.floor(Math.random() * freq_centers.length);
    do {
      pos2 = Math.floor(Math.floor(Math.random() * freq_centers.length));
    } while (pos1 === pos2);
    // Pick two random gain values to be assigned to them
    do {
      gain1 = randomRange(-80, 80);
    } while (gain1 > -19 && gain1 < 19); // Prevent change is too minor
    do {
      gain2 = randomRange(-80, 80);
    } while (gain2 > -19 && gain2 < 19); // Prevent change is too minor
    sol_filters[pos1].gain = gain1 / 100;
    sol_filters[pos2].gain = gain2 / 100;
  }
  // Pattern 2 (2): Three continuous frequency ranges
  else if (6 <= pattern <= 7) {
    let mid_pos = Math.floor(Math.random() * (freq_centers.length - 2)) + 1;
    let mid_gain, left_gain, right_gain;
    // Pick mid_gain, and use randomness to differenciate left and right gain by around 0 to 20
    do {
      mid_gain = randomRange(-60, 60);
    } while (mid_gain > -29 && mid_gain < 29); // Reserve space for adjustment for side ranges
    left_gain = randomRange(mid_gain - 20, mid_gain + 20);
    right_gain = randomRange(mid_gain - 20, mid_gain + 20);
    sol_filters[mid_pos].gain = mid_gain / 100;
    sol_filters[mid_pos - 1].gain = left_gain / 100;
    sol_filters[mid_pos + 1].gain = right_gain / 100;
  }
  // Pattern 3 (2): Boost on sides
  else {
    const case_flag = randomRange(0, 2); // 3 cases: left only, right only, both left and right
    let left_gain = 0, right_gain = 0;
    // If case_flag is odd, left exists
    if (case_flag % 2) {
      do {
        left_gain = randomRange(-80, 80);
      } while (left_gain > -19 && left_gain < 19);
    }
    // If case_flag is even, right exists
    else {
      do {
        right_gain = randomRange(-80, 80);
      } while (right_gain > -19 && right_gain < 19);
    }
    // If case_flag is 2, both exists (add back left only)
    if (case_flag === 2) {
      do {
        left_gain = randomRange(-80, 80);
      } while (left_gain > -19 && left_gain < 19);
    }
    sol_filters[0].gain = left_gain / 100;
    sol_filters[filter_count - 1].gain = right_gain / 100;
  }
  // After finish creating the solution, return
  return sol_filters;
}

// Check the answer by calculating the difference of each point in the user answer from the solution, and check if the difference is acceptable
const allowance = 10 / 100; // How much error can be accepted to call an answer correct
function checkSolution(yValues, solValues) {
  if (yValues.length !== solValues.length) {
    throw Error('Program error in checkSolution(): yValues and solValues have different length.');
  }
  for (let i = 0; i < solValues.length; i++) {
    if (Math.abs(yValues[i] - solValues[i]) > allowance) {
      return false;
    }
  }
  return true;
}

export { sampling_freq, freq_centers, log_bounds, log_tick_pos, generateLogSamples, CustomEQFilter, getInitGraphicFilters, filter_count, sample_count, getNewGraphicSol, checkSolution };