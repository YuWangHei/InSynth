import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { getRandomAudio } from '../../../Music/AudioPicker';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const EQContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
`;

const GraphContainer = styled.div`
  width: 800px;
  height: 400px;
  background: #2a2a2a;
  padding: 20px;
  border-radius: 10px;
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

const PlaybackControls = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  padding: 15px;
  background: #2a2a2a;
  border-radius: 10px;
`;

const PlaybackButton = styled(Button)`
  background: ${props => props.$mode === 'target' ? '#ff4444' : '#00ff88'};
  &:hover {
    background: ${props => props.$mode === 'target' ? '#cc3333' : '#00cc6a'};
  }
`;

const Score = styled.div`
  font-size: 24px;
  color: white;
  margin-top: 20px;
`;

function SynthExercise() {
  // Original audio context and elements
  const audioContext = useRef(null);
  const audioElement = useRef(null);
  const filters = useRef([]);

  // Target EQ audio context and elements
  const targetAudioContext = useRef(null);
  const targetAudioElement = useRef(null);
  const targetFilters = useRef([]);

  const chartRef = useRef(null);
  const isDragging = useRef(false);
  const currentDragPoint = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingTarget, setIsPlayingTarget] = useState(false);
  const [isPlayingOriginal, setIsPlayingOriginal] = useState(false);

  const frequencies = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
  const [eqValues, setEqValues] = useState({
    32: 0, 64: 0, 125: 0, 250: 0, 500: 0,
    1000: 0, 2000: 0, 4000: 0, 8000: 0, 16000: 0
  });
  const [targetEQ, setTargetEQ] = useState({});
  const [score, setScore] = useState(0);

  const music = getRandomAudio();

  useEffect(() => {
    // Setup main audio context
    audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    audioElement.current = new Audio(music);
    const source = audioContext.current.createMediaElementSource(audioElement.current);

    // Setup target audio context
    targetAudioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    targetAudioElement.current = new Audio(music);
    const targetSource = targetAudioContext.current.createMediaElementSource(targetAudioElement.current);

    // Setup main filters
    filters.current = frequencies.map(freq => {
      const filter = audioContext.current.createBiquadFilter();
      filter.type = 'peaking';
      filter.frequency.value = freq;
      filter.Q.value = 1;
      filter.gain.value = 0;
      return filter;
    });

    // Setup target filters
    targetFilters.current = frequencies.map(freq => {
      const filter = targetAudioContext.current.createBiquadFilter();
      filter.type = 'peaking';
      filter.frequency.value = freq;
      filter.Q.value = 1;
      filter.gain.value = 0;
      return filter;
    });

    // Connect main audio chain
    source.connect(filters.current[0]);
    for (let i = 0; i < filters.current.length - 1; i++) {
      filters.current[i].connect(filters.current[i + 1]);
    }
    filters.current[filters.current.length - 1].connect(audioContext.current.destination);

    // Connect target audio chain
    targetSource.connect(targetFilters.current[0]);
    for (let i = 0; i < targetFilters.current.length - 1; i++) {
      targetFilters.current[i].connect(targetFilters.current[i + 1]);
    }
    targetFilters.current[targetFilters.current.length - 1].connect(targetAudioContext.current.destination);

    // Add drag event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      if (audioContext.current) audioContext.current.close();
      if (targetAudioContext.current) targetAudioContext.current.close();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // ... (keep the mouse handling functions the same)
  const calculateDbFromY = (y, rect) => {
    const height = rect.height;
    const relativeY = y - rect.top;
    const value = Math.round(48 * (1 - relativeY / height) - 24);
    return Math.max(-24, Math.min(24, value));
  };

  const handleEQChange = (freq, value) => {
    setEqValues(prev => ({
      ...prev,
      [freq]: value
    }));

    const filterIndex = frequencies.indexOf(Number(freq));
    if (filterIndex !== -1 && filters.current[filterIndex]) {
      filters.current[filterIndex].gain.value = value;
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging.current && currentDragPoint.current !== null) {
      const chart = chartRef.current;
      if (!chart) return;

      const rect = chart.canvas.getBoundingClientRect();
      const newValue = calculateDbFromY(e.clientY, rect);

      const freq = frequencies[currentDragPoint.current];
      handleEQChange(freq, newValue);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    currentDragPoint.current = null;
  };

  const chartData = {
    labels: frequencies.map(f => `${f}Hz`),
    datasets: [
      {
        label: 'Your EQ',
        data: Object.values(eqValues),
        borderColor: '#00ff88',
        backgroundColor: '#00ff88',
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Target EQ',
        data: Object.values(targetEQ),
        borderColor: '#ff4444',
        backgroundColor: '#ff4444',
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: -24,
        max: 24,
        grid: {
          color: '#444'
        },
        ticks: {
          color: '#fff'
        }
      },
      x: {
        grid: {
          color: '#444'
        },
        ticks: {
          color: '#fff'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#fff'
        }
      },
      tooltip: {
        enabled: true,
        mode: 'nearest',
        intersect: false
      }
    },
    onClick: (event, elements) => {
      if (elements.length > 0 && elements[0].datasetIndex === 0) {
        isDragging.current = true;
        currentDragPoint.current = elements[0].index;
      }
    },
    onHover: (event, elements) => {
      event.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
    }
  };

  const checkScore = () => {
    let totalDifference = 0;
    frequencies.forEach(freq => {
      totalDifference += Math.abs(eqValues[freq] - targetEQ[freq]);
    });
    const newScore = Math.max(0, 100 - (totalDifference / frequencies.length));
    setScore(Math.round(newScore));
  };

  const playOriginal = async () => {
    if (isPlayingTarget) {
      await stopTarget();
    }
    if (isPlaying) {
      await stopMain();
    }

    if (!isPlayingOriginal) {
      if (targetAudioContext.current.state === 'suspended') {
        await targetAudioContext.current.resume();
      }
      // Reset all target filters to 0
      targetFilters.current.forEach(filter => {
        filter.gain.value = 0;
      });
      targetAudioElement.current.currentTime = 0;
      await targetAudioElement.current.play();
      setIsPlayingOriginal(true);
    } else {
      await stopOriginal();
    }
  };

  const playTarget = async () => {
    if (isPlayingOriginal) {
      await stopOriginal();
    }
    if (isPlaying) {
      await stopMain();
    }

    if (!isPlayingTarget) {
      if (targetAudioContext.current.state === 'suspended') {
        await targetAudioContext.current.resume();
      }
      // Apply target EQ values
      Object.entries(targetEQ).forEach(([freq, value], index) => {
        targetFilters.current[index].gain.value = value;
      });
      targetAudioElement.current.currentTime = 0;
      await targetAudioElement.current.play();
      setIsPlayingTarget(true);
    } else {
      await stopTarget();
    }
  };

  const stopOriginal = async () => {
    targetAudioElement.current.pause();
    targetAudioElement.current.currentTime = 0;
    setIsPlayingOriginal(false);
  };

  const stopTarget = async () => {
    targetAudioElement.current.pause();
    targetAudioElement.current.currentTime = 0;
    setIsPlayingTarget(false);
  };

  const stopMain = async () => {
    audioElement.current.pause();
    audioElement.current.currentTime = 0;
    setIsPlaying(false);
  };

  const togglePlay = async () => {
    if (isPlayingOriginal) {
      await stopOriginal();
    }
    if (isPlayingTarget) {
      await stopTarget();
    }

    if (!isPlaying) {
      if (audioContext.current.state === 'suspended') {
        await audioContext.current.resume();
      }
      audioElement.current.currentTime = 0;
      await audioElement.current.play();
      setIsPlaying(true);
    } else {
      await stopMain();
    }
  };

  const generateTargetEQ = () => {
    const newTargetEQ = {};
    frequencies.forEach(freq => {
      newTargetEQ[freq] = Math.round((Math.random() * 48) - 24);
    });
    setTargetEQ(newTargetEQ);
  };

  // ... (keep the rest of the code the same, including chartData and chartOptions)

  return (
    <EQContainer>
      <h1>EQ Training Exercise</h1>

      <GraphContainer>
        <Line ref={chartRef} data={chartData} options={chartOptions} />
      </GraphContainer>

      <PlaybackControls>
        <PlaybackButton onClick={playOriginal}>
          {isPlayingOriginal ? 'Stop Original' : 'Play Original'}
        </PlaybackButton>
        <PlaybackButton $mode="target" onClick={playTarget}>
          {isPlayingTarget ? 'Stop Target' : 'Play Target'}
        </PlaybackButton>
        <Button onClick={togglePlay}>
          {isPlaying ? 'Stop Your EQ' : 'Play Your EQ'}
        </Button>
      </PlaybackControls>

      <Controls>
        <Button onClick={generateTargetEQ}>
          New Target EQ
        </Button>
        <Button onClick={checkScore}>
          Check Score
        </Button>
      </Controls>

      <Score>Score: {score}</Score>
    </EQContainer>
  );
}

export default SynthExercise;