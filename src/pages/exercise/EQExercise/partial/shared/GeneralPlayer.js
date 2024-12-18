import { useEffect, useRef, useState } from "react";
import { generateLogSamples } from "./utilsGeneral";

function GeneralPlayer({ applyFilter, props }) {
  const audioFile = props.audioFile;
  const filters = props.filters;
  const onChange = props.onChange;
  const trigger = props.trigger

  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const audioBufferRef = useRef(null);
  const filtersRef = useRef([]);
  const sampleSpace = new Float32Array(generateLogSamples());
  const magResponseRef = useRef([]);
  const phaseResponseRef = useRef([]);
  const [filterChange, setFilterChange] = useState(0);
  const [initialized, setInitialized] = useState(false);

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
      applyFilter(filtersRef.current[idx], audioContextRef, obj);
      return null;
    });

    // Start playing the audio
    sourceRef.current.loop = true;
    sourceRef.current.start(0);
  };

  const onMount = () => {
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
      // Update filterChange to force re-rendering after loading audio
      setFilterChange(filterChange + 1);
    }

    loadAudio();
  }

  // Actions on mount
  useEffect(() => {
    onMount();
    return () => {
      // Cleanup
      audioContextRef.current.close();
    }
  }, []);

  // Actions when filters are changed
  const onFilters = () => {
    console.log("Player received");
    console.log(filters);
    if (filters.length !== 0 && filtersRef.current.length !== 0) {
      filters.map((obj, idx) => {
        // Apply filter to the audio
        applyFilter(filtersRef.current[idx], audioContextRef, obj);
        // Obtain the frequency response ratio change from this filter
        filtersRef.current[idx].getFrequencyResponse(sampleSpace, magResponseRef.current[idx], phaseResponseRef.current[idx]);
        // Pass data to parent
        onChange(magResponseRef.current, phaseResponseRef.current);
        return null;
      });
    }
    else {
      console.log("Filters not applied");
    }
  }

  // Actions when filters are changes
  useEffect(() => {
    if (initialized) {
      onFilters();
    }
    else {
      onMount();
      setInitialized(true);
      setFilterChange(filterChange + 1);
    }
  }, [filterChange, filters, trigger]);

  // Return not UI
  return null;
}

export default GeneralPlayer;