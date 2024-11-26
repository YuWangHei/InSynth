import { Button, Flex } from "@mantine/core";
import { useEffect, useState, useRef } from "react";

// filters: expect fixed number of filters, i.e. no adding or removing filters after initialization
function StaticPlayer({ audioFile, filters = [] }) {
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const audioBufferRef = useRef(null);
  const filtersRef = useRef([]);


  // One-time actions
  useEffect(() => {
    // Action on mount
    // Create AudioContext
    audioContextRef.current = new window.AudioContext();
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
    if (filters.length !== 0 && filtersRef.current.length !== 0) {
      filters.map((obj, idx) => {
        applyFilter(filtersRef.current[idx], obj.type, obj.freq);
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
      applyFilter(filtersRef.current[idx], obj.type, obj.freq);
    });

    // Start playing the audio
    sourceRef.current.loop = true;
    sourceRef.current.start(0);
  };

  // Set the parameters of the given filterNode
  const applyFilter = (filterNode, type, freq) => {
    filterNode.type = type;
    filterNode.frequency.setValueAtTime(freq, audioContextRef.current.currentTime);
  };

  // Return no UI
  return null;
}

export default StaticPlayer;