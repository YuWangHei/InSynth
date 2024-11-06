import React, { useState, useEffect, useRef } from 'react';
import Frame from '../Frame';
import styled from 'styled-components';

// Styled components
const EQContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
`;

const EQControls = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-end;
  background: #2a2a2a;
  padding: 20px;
  border-radius: 10px;
`;

const Band = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Slider = styled.input`
  -webkit-appearance: slider-vertical;
  height: 200px;
  width: 20px;
  background: #4a4a4a;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    background: #00ff88;
    border-radius: 50%;
    cursor: pointer;
  }
`;

const FreqLabel = styled.span`
  color: white;
  font-size: 12px;
`;

const Controls = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background: #00ff88;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  
  &:hover {
    background: #00cc6a;
  }
`;

const Score = styled.div`
  font-size: 24px;
  color: white;
  margin-top: 20px;
`;

function SynthExercise() {
  const audioContext = useRef(null);
  const audioElement = useRef(null);
  const filters = useRef([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [eqValues, setEqValues] = useState({
    32: 0,
    64: 0,
    125: 0,
    250: 0,
    500: 0,
    1000: 0,
    2000: 0,
    4000: 0,
    8000: 0,
    16000: 0
  });
  const [targetEQ, setTargetEQ] = useState({});
  const [score, setScore] = useState(0);

  // Initialize Web Audio API
  useEffect(() => {
    audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    audioElement.current = new Audio('/NOKIA RINGTONE [1994].mp3'); // Replace with actual audio path
    
    const source = audioContext.current.createMediaElementSource(audioElement.current);
    
    // Create filters for each frequency band
    const frequencies = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
    filters.current = frequencies.map(freq => {
      const filter = audioContext.current.createBiquadFilter();
      filter.type = 'peaking';
      filter.frequency.value = freq;
      filter.Q.value = 1;
      filter.gain.value = 0;
      return filter;
    });

    // Connect the filters in series
    source.connect(filters.current[0]);
    for (let i = 0; i < filters.current.length - 1; i++) {
      filters.current[i].connect(filters.current[i + 1]);
    }
    filters.current[filters.current.length - 1].connect(audioContext.current.destination);

    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  const handleEQChange = (freq, value) => {
    setEqValues(prev => ({
      ...prev,
      [freq]: value
    }));
    
    // Update filter gain
    const filterIndex = Object.keys(eqValues).indexOf(freq.toString());
    if (filterIndex !== -1 && filters.current[filterIndex]) {
      filters.current[filterIndex].gain.value = value;
    }
  };

  const generateTargetEQ = () => {
    const newTargetEQ = {};
    Object.keys(eqValues).forEach(freq => {
      newTargetEQ[freq] = Math.round((Math.random() * 24) - 12); // Random value between -12 and +12
    });
    setTargetEQ(newTargetEQ);
  };

  const togglePlay = () => {
    if (audioContext.current.state === 'suspended') {
      audioContext.current.resume();
    }
    
    if (!isPlaying) {
      audioElement.current.play();
    } else {
      audioElement.current.pause();
      audioElement.current.currentTime = 0;
    }
    setIsPlaying(!isPlaying);
  };

  const checkScore = () => {
    let totalDifference = 0;
    Object.keys(eqValues).forEach(freq => {
      totalDifference += Math.abs(eqValues[freq] - targetEQ[freq]);
    });
    const newScore = Math.max(0, 100 - (totalDifference / Object.keys(eqValues).length));
    setScore(Math.round(newScore));
  };

  return (
    <Frame>
      <EQContainer>
        <h1>EQ Training Exercise</h1>
        
        <EQControls>
          {Object.entries(eqValues).map(([freq, value]) => (
            <Band key={freq}>
              <Slider
                type="range"
                min="-12"
                max="12"
                value={value}
                onChange={(e) => handleEQChange(freq, Number(e.target.value))}
              />
              <FreqLabel>{freq}Hz</FreqLabel>
            </Band>
          ))}
        </EQControls>

        <Controls>
          <Button onClick={togglePlay}>
            {isPlaying ? 'Stop' : 'Play'}
          </Button>
          <Button onClick={generateTargetEQ}>
            New Target EQ
          </Button>
          <Button onClick={checkScore}>
            Check Score
          </Button>
        </Controls>

        {targetEQ && Object.keys(targetEQ).length > 0 && (
          <div>
            <h3>Target EQ Values:</h3>
            {Object.entries(targetEQ).map(([freq, value]) => (
              <div key={freq}>{freq}Hz: {value}dB</div>
            ))}
          </div>
        )}

        <Score>Score: {score}</Score>
      </EQContainer>
    </Frame>
  );
}

export default SynthExercise;