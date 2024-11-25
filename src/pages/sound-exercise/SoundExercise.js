import React, { useState, useEffect, useRef } from 'react';
import { Button, Group, Text, Container, Paper, RingProgress} from '@mantine/core';
import Frame from '../Frame';
import * as Tone from 'tone';
function SoundExercise() {
  const [result, setResult] = useState('');
  const [currentWaveform, setCurrentWaveform] = useState(null);
  const [showSpectrum, setShowSpectrum] = useState(false);
  const [showWaveform, setShowWaveform] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const canvasRef = useRef(null);
  const waveformCanvasRef = useRef(null);
  const analyzerRef = useRef(null);
  const waveformAnalyzerRef = useRef(null);
  const animationRef = useRef(null);
  const waveformAnimationRef = useRef(null);
  const TotalScore = 10;
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (waveformAnimationRef.current) {
        cancelAnimationFrame(waveformAnimationRef.current);
      }
    };
  }, []);

  const initializeAudio = async () => {
    await Tone.start();
    // Create analyzer nodes only after audio context is started
    analyzerRef.current = new Tone.Analyser('fft', 2048);
    waveformAnalyzerRef.current = new Tone.Analyser('waveform', 1024);
    analyzerRef.current.smoothing = 0;
  };

  const drawWaveform = () => {
    const canvas = waveformCanvasRef.current;
    if (!canvas) return; // Add this check

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    const values = waveformAnalyzerRef.current.getValue();
    
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#00ff00';
    
    ctx.moveTo(0, height / 2);
    values.forEach((value, i) => {
      const x = (width * i) / values.length;
      const y = ((value + 1) / 2) * height;
      ctx.lineTo(x, y);
    });
    
    ctx.stroke();
    waveformAnimationRef.current = requestAnimationFrame(drawWaveform);
  };

  const drawSpectrum = () => {
    const canvas = canvasRef.current;
    if (!canvas) return; // Add this check

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    const values = analyzerRef.current.getValue();
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Number of bars to display
    const barCount = 32;
    const barWidth = (width / barCount) * 0.8; // Leave 20% gap between bars
    const gap = (width / barCount) * 0.2;
    
    // Draw frequency bars
    ctx.fillStyle = '#00ff00';
    
    for (let i = 0; i < barCount; i++) {
      // Average several FFT values for each bar
      const startIndex = Math.floor((i / barCount) * values.length);
      const endIndex = Math.floor(((i + 1) / barCount) * values.length);
      let sum = 0;
      
      for (let j = startIndex; j < endIndex; j++) {
        sum += values[j];
      }
      
      const average = sum / (endIndex - startIndex);
      
      // Convert dB value to height
      const barHeight = ((average + 140) * height / 140);
      
      // Draw bar
      const x = i * (barWidth + gap);
      ctx.fillRect(x, height - barHeight, barWidth, barHeight);
    }
    
    animationRef.current = requestAnimationFrame(drawSpectrum);
  };

  const playWaveform = (type) => {
    const synth = new Tone.Synth({
      oscillator: { type },
      envelope: {
        attack: 0.1,
        decay: 0.2,
        sustain: 0.5,
        release: 0.8
      }
    }).chain(analyzerRef.current, waveformAnalyzerRef.current, Tone.Destination);

    // Start visualizations
    drawSpectrum();
    drawWaveform();
    
    // Play note
    synth.triggerAttackRelease('A4', '1');
  };

  const handlePlayRandomWaveform = async () => {
    // Initialize audio if not already initialized
    if (Tone.context.state !== "running") {
      await initializeAudio();
    }
    if (score.total > TotalScore) {
      setResult("Start Next Round!")
      return;
    }
    const waveforms = ['sine', 'square', 'sawtooth'];
    const randomWaveform = waveforms[Math.floor(Math.random() * waveforms.length)];
    
    setCurrentWaveform(randomWaveform);
    playWaveform(randomWaveform);
    setResult('');
  };

  // Function to handle user's guess
  const handleGuess = (guess) => {
    if (!currentWaveform) {
      setResult('Please click "Play" first!');
      return;
    }

    if (guess === currentWaveform) {
      setResult('Correct! You identified the waveform.');
      setScore(prev => ({
        correct: prev.correct + 1,
        total: prev.total + 1
      }));
    } else {
      setResult(`Incorrect! The correct answer was ${currentWaveform}.`);
      setScore(prev => ({
        ...prev,
        total: prev.total + 1
      }));
    }
  };

  return (
    <Frame>
      <Container size="lg" mt="xl">
        <Paper shadow="md" p="xl" radius="md" align="center">
          <h1>Sound Exercise</h1>
          
          <Text size="lg" weight={500} align="center" mb="md">
            {result}
          </Text>
  
          {/* Main content area with flex layout */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            marginBottom: '2rem' 
          }}>
            {/* Left side with Play button and wave buttons */}
            <div style={{ flex: '2', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Button 
                onClick={handlePlayRandomWaveform} 
                variant="gradient" 
                gradient={{ from: 'indigo', to: 'cyan' }}
                size="xl"
                mb={30}
              >
                Play
              </Button>
  
              <Group spacing="md">
                <Button onClick={() => handleGuess('square')} disabled={score.total >= 10} color="blue">
                  Square Wave
                </Button>
                <Button onClick={() => handleGuess('sawtooth')} disabled={score.total >= 10} color="orange">
                  Sawtooth Wave
                </Button>
                <Button onClick={() => handleGuess('sine')} disabled={score.total >= 10} color="green">
                  Sine Wave
                </Button>
              </Group>
            </div>
  
            {/* Right side with RingProgress */}
            <div style={{ flex: '1' }}>
              <RingProgress
                size={150}
                label={
                  <Text size="lg" ta="center">
                    {score.total}/{TotalScore}
                  </Text>
                }
                sections={[
                  { value: (score.correct / TotalScore)*100, color: 'green' },
                  { value: ((score.total - score.correct) / TotalScore)*100, color: 'red' },
                ]}
              />
            </div>
          </div>
  
          {/* Visualization controls */}
          <Group position="center" mb="xl" align="center">
            <Button onClick={() => setShowSpectrum(!showSpectrum)} color="teal">
              {showSpectrum ? 'Hide Spectrum' : 'Show Spectrum'}
            </Button>
            <Button onClick={() => setShowWaveform(!showWaveform)} color="grape">
              {showWaveform ? 'Hide Waveform' : 'Show Waveform'}
            </Button>
          </Group>
  
          {/* Visualizations */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            {showSpectrum && (
              <div>
                <Text weight={500} mb="sm">Spectrum</Text>
                <canvas ref={canvasRef} width="400" height="200" 
                  style={{ backgroundColor: '#1a1a1a', borderRadius: '8px' }} />
              </div>
            )}
            {showWaveform && (
              <div>
                <Text weight={500} mb="sm">Waveform</Text>
                <canvas ref={waveformCanvasRef} width="400" height="200" 
                  style={{ backgroundColor: '#1a1a1a', borderRadius: '8px' }} />
              </div>
            )}
          </div>
        </Paper>
      </Container>
    </Frame>
  );
}

export default SoundExercise;