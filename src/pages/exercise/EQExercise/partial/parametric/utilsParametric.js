import { randomRange, CustomEQFilter, sampling_freq, freq_centers, log_bounds, log_tick_pos, generateLogSamples, sample_count } from "../shared/utilsGeneral";

// dB adjustment ranges from -12 to 12, directly matching the unit of web audio api filters
const dbBound = { min: -12, max: 12 };
const qBound = { min: 0.1, max: 10 };

const getNewParametricSol = (count) => {
  const sol_fiilters = [];
  for (let i = 0; i < count; i++) {
    sol_fiilters.push(new CustomEQFilter('peaking', 1000 * i, 1, -12));
  }
  return sol_fiilters;
  // Peaking
  if (count >= 1) {
    let pos1, gain1, q1;
    pos1 = randomRange(log_bounds.min, log_bounds.max);
    gain1 = randomRange(dbBound.min, dbBound.max);
    q1 = randomRange(qBound.min, qBound.max);
    sol_fiilters.push(new CustomEQFilter('peaking', pos1, q1, gain1));
  }
  // Peaking + low shelf or low pass
  if (count >= 2) {
    let pattern2 = randomRange(0, 1);
    let pos2 = randomRange(log_bounds.min, freq_centers[3]);
    // Low shelf
    if (pattern2) {
      let gain2 = randomRange(dbBound.min, dbBound.max);
      sol_fiilters.push(new CustomEQFilter('lowshelf', pos2, null, gain2)); // q is unused in low shelf
    }
    // Low pass
    else {
      let q2 = randomRange(qBound.min, qBound.max);
      sol_fiilters.push(new CustomEQFilter('lowpass', pos2, q2, null)); // gain is unused in low pass
    }
  }
  // Peaking + low shelf or low pass + high shelf or high pass
  if (count >= 3) {
    let pattern3 = randomRange(0, 1);
    let pos3 = randomRange(freq_centers[6], log_bounds.max);
    // High shelf
    if (pattern3) {
      let gain3 = randomRange(dbBound.min, dbBound.max);
      sol_fiilters.push(new CustomEQFilter('highshelf', pos3, null, gain3)); // q is unused in high shelf
    }
    // High pass
    else {
      let q3 = randomRange(qBound.min, qBound.max);
      sol_fiilters.push(new CustomEQFilter('highpass', pos3, q3, null)); // gain is unused in high pass
    }
  }
  // Peaking + low shelf or low pass + high shelf or high pass + peaking
  if (count >= 4) {
    let pos4, gain4, q4;
    pos4 = randomRange(freq_centers[3], freq_centers[6]);
    gain4 = randomRange(dbBound.min, dbBound.max);
    q4 = randomRange(qBound.min, qBound.max);
    sol_fiilters.push(new CustomEQFilter('peaking', pos4, q4, gain4));
  }
  return sol_fiilters;
}

const getFilterSettings = (solFilters) => {
  const filterSettings = solFilters.map((obj, idx) => {
    return {
      type: obj.type,
      freq: true,
      gain: (obj.type === 'lowpass' || obj.type === 'highpass') ? false : true,
      q: (obj.type === 'lowshelf' || obj.type === 'highshelf') ? false : true,
    }
  });
  return filterSettings;
}

const checkParametricSolution = (userFilters, solFilters) => {
  return false;
}

export { randomRange, CustomEQFilter, sampling_freq, freq_centers, log_bounds, log_tick_pos, generateLogSamples, sample_count, dbBound, qBound, getNewParametricSol, getFilterSettings, checkParametricSolution }