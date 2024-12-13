import { useEffect, useRef } from "react";
import { CustomEQFilter, generateLogSamples, getInitGraphicFilters } from "./utilsGraphic";

// audioIdentity: what audio is currently playing, in StaticPlayer, it is just a direct pass to notify the subsequent program)
// filters: expect fixed number of filters, i.e. no adding or removing filters after initialization
function StaticPlayer({ audioFile, audioIdentity, filters = getInitGraphicFilters(), onChange }) {
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const audioBufferRef = useRef(null);
  const filtersRef = useRef([]);
  const sampleSpace = new Float32Array(generateLogSamples());
  const magResponseRef = useRef([]);
  const phaseResponseRef = useRef([]);


  // One-time actions
  useEffect(() => {
    // Action on mount

    // Create AudioContext
    audioContextRef.current = new window.AudioContext();

    // Create nested arrays for frequency response
    for (let i = 0; i < filters.length; i++) {
      magResponseRef.current[i] = new Float32Array(sampleSpace.length);
      phaseResponseRef.current[i] = new Float32Array(sampleSpace.length);
    }

    // Load audio file
    const loadAudio = async () => {
      const response = await fetch(audioFile);
      const audioData = await response.arrayBuffer();
      audioBufferRef.current = await audioContextRef.current.decodeAudioData(audioData);
      playAudio();
    }

    loadAudio();

    // Action on unmount
    return () => {
      // Cleanup
      audioContextRef.current.close();
    }
  }, []);


  // Action when filters are changed
  useEffect(() => {
    console.log("Listening to", audioIdentity);
    if (filters.length !== 0 && filtersRef.current.length !== 0) {
      filters.map((obj, idx) => {
        // Apply filter to the audio
        applyFilter(filtersRef.current[idx], obj);
        // Obtain the frequency response ratio change from this filter
        filtersRef.current[idx].getFrequencyResponse(sampleSpace, magResponseRef.current[idx], phaseResponseRef.current[idx]);
        // Pass data to parent
        onChange(audioIdentity, magResponseRef.current, phaseResponseRef.current);
        return null;
      });
    }
  }, [filters]);


  const playAudio = () => {
    // Ensure audio is loaded
    if (!audioBufferRef.current) return;

    // Skip if audio is already playing
    if (sourceRef.current) return;

    // Create source and filters
    sourceRef.current = audioContextRef.current.createBufferSource();
    sourceRef.current.buffer = audioBufferRef.current;
    for (let i = 0; i < filters.length; i++) {
      filtersRef.current[i] = audioContextRef.current.createBiquadFilter();
    }

    // Connect nodes
    if (filters.length) {
      sourceRef.current.connect(filtersRef.current[0]);
      for (let i = 0; i < filters.length - 1; i++) {
        filtersRef.current[i].connect(filtersRef.current[i + 1]);
      }
      filtersRef.current[filters.length - 1].connect(audioContextRef.current.destination);
    }
    else {
      sourceRef.current.connect(audioContextRef.current.destination);
    }

    // Apply filters for the first time
    filters.map((obj, idx) => {
      applyFilter(filtersRef.current[idx], obj);
      return null;
    });

    // Start playing the audio
    sourceRef.current.loop = true;
    sourceRef.current.start(0);
  };

  // Set the parameters of the given filterNode
  // Note: gain is percentage change in amplitude (from -1 to 1), which can be +ve or -ve
  const applyFilter = (filterNode, obj = new CustomEQFilter('peaking', 62, 1, 0)) => {
    // console.log(`Gain: ${obj.gain}`) // DEBUG
    filterNode.type = obj.type;
    filterNode.frequency.setValueAtTime(obj.freq, audioContextRef.current.currentTime);
    filterNode.Q.setValueAtTime(obj.q, audioContextRef.current.currentTime);
    // gain received is the percentage change, translate percentage to dB
    // If percentage change is -100%, set to valid value to prevent infinity
    let newQ = obj.q;
    let newGain = obj.gain;
    if (obj.gain === -1) {
      // console.log('cleared 100'); // DEBUG
      newGain = -0.99;
    }
    // If percentage change is negative, set q to compensate bandwidth
    if (obj.gain < 0) {
      newQ = Math.pow(-newGain * 2, -newGain);
    }
    // dB = 20 * log(A), where A is the percentage change
    const dBGain = 20 * Math.log10(1 + newGain);
    // console.log(obj.freq, dBGain, newQ); // DEBUG
    filterNode.gain.setValueAtTime(dBGain, audioContextRef.current.currentTime);
    filterNode.Q.setValueAtTime(newQ, audioContextRef.current.currentTime);
  };

  // Return no UI
  return null;
}

export default StaticPlayer;