import { useEffect, useRef, useState } from "react";
import { generateLogSamples } from "../graphic/utilsGraphic";

function ParametricPlayer({ audioFile, filters, onChange, trigger }) {
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const audioBufferRef = useRef(null);
  const filtersRef = useRef([]);
  const sampleSpace = new Float32Array(generateLogSamples());
  const magResponseRef = useRef([]);
  const phaseResponseRef = useRef([]);
  const [filterChange, setFilterChange] = useState(0);


  // Actions when filters are changed
  const onFilters = () => {
    if (filters.length !== 0 && filtersRef.current.length !== 0) {
      filters.map((obj, idx) => {
        // Apply filter to the audio
        applyFilter(filtersRef.current[idx], obj);
        // Obtain the frequency response ratio change from this filter
        filtersRef.current[idx].getFrequencyResponse(sampleSpace, magResponseRef.current[idx], phaseResponseRef.current[idx]);
        // Pass data to parent
        onChange(magResponseRef.current, phaseResponseRef.current);
        return null;
      });
    }
  }

  // Actions when filters are changes
  useEffect(() => {
    onFilters();
  }, [filterChange, filters, trigger]);


  // Actions on mount
  useEffect(() => {
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

    // Action on unmount
    return () => {
      // Cleanup
      audioContextRef.current.close();
    }
  }, []);
}

export default ParametricPlayer;