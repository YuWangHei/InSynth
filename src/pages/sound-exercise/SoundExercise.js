import React, { useState, useEffect, useRef } from 'react';
import { Button, Group, Text, Container, Paper, RingProgress, Grid, Alert} from '@mantine/core';
import { IconPlayerPlayFilled} from '@tabler/icons-react';
import Frame from '../Frame';
import * as Tone from 'tone';

const waves = [
  { 
    name: 'Square Wave', 
  },
  { 
    name: 'Sawtooth Wave', 
  },
  { 
    name: 'Sine Wave', 
  },
  { 
    name: 'Triangle Wave', 
  }
];

function SoundExercise() {
  const [result, setResult] = useState('');
  const [currentWaveform, setCurrentWaveform] = useState(null);
  const [showSpectrum, setShowSpectrum] = useState(false);
  const [showWaveform, setShowWaveform] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [isPlayed, setIsPlayed] = useState(false);
  const [isGuessed, setIsGuessed] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

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
    try {
      await Tone.start();
      if (!analyzerRef.current) {
        analyzerRef.current = new Tone.Analyser('fft', 2048);
        waveformAnalyzerRef.current = new Tone.Analyser('waveform', 1024);
        analyzerRef.current.smoothing = 0;
      }
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
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

  const playWaveform = async (type) => {
    if (!analyzerRef.current || !waveformAnalyzerRef.current) {
      await initializeAudio();
    }
    
    const waveformMap = {
      'Sine Wave': 'sine',
      'Square Wave': 'square',
      'Sawtooth Wave': 'sawtooth'
    };
    
    const oscillatorType = waveformMap[type] || type;
    
    const synth = new Tone.Synth({
      oscillator: { type: oscillatorType },
      envelope: {
        attack: 0.1,
        decay: 0.2,
        sustain: 0.5,
        release: 0.8
      }
    }).chain(analyzerRef.current, waveformAnalyzerRef.current, Tone.Destination);
  
    drawSpectrum();
    drawWaveform();
    synth.triggerAttackRelease('A4', '1');
  };
  
  

  const handlePlayRandomWaveform = async () => {
    try {
      // Ensure audio context is started
      if (!Tone.context || Tone.context.state !== "running") {
        await initializeAudio();
      }
      
      if (score.total >= TotalScore) {
        setResult("Start Next Round!");
        return;
      }
      
      const waveforms = ['Sine Wave', 'Square Wave', 'Sawtooth Wave'];
      const randomWaveform = waveforms[Math.floor(Math.random() * waveforms.length)];
      setIsPlayed(true);
      setCurrentWaveform(randomWaveform);
      playWaveform(randomWaveform);
      setResult('');
    } catch (error) {
      console.error('Failed to play waveform:', error);
      setResult('Failed to start audio. Please try again.');
    }
  };

  // Function to handle user's guess
  const handleGuess = (guess) => {
    if (!currentWaveform || !isPlayed) {
      setIsGuessed(false);
      setShowFeedback(true);
      setResult('Please click "Play" first!');
      return;
    }

    if (guess === currentWaveform) {
      setResult('Correct! You identified the waveform.');
      setIsGuessed(true);
      setScore(prev => ({
        correct: prev.correct + 1,
        total: prev.total + 1
      }));
    } else {
      setResult(`Incorrect! The correct answer was ${currentWaveform}.`);
      setIsGuessed(false);
      setScore(prev => ({
        ...prev,
        total: prev.total + 1
      }));
    }
    setShowFeedback(true);
    setIsPlayed(false);
  };

return (
  <Frame>
    <Container size="lg" mt="xl">
      <Paper shadow="md" p="xl" radius="md" align="center">
        <h1>Sound Exercise</h1>
        
        {showFeedback && (
                  <Alert 
                  color={
                    function() {

                      if (isGuessed) {
                        return 'green';
                      }
                      return 'red';
                    }()
                  }
                >
                  {result}
                </Alert>
        )}
        <br></br>

        {score.total >= TotalScore && (
                <Alert
                  color="green"
                  title={"Finished!"}
                >
                  All {TotalScore} Questions are finished.
                  Your score is {score.correct}/{score.total}!!!
                </Alert>
              )}
        <br></br>
        {/* Main content area with flex layout */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          width: '100%',
          marginBottom: '2rem' 
        }}>
          {/* Left side with buttons */}
          <div style={{ 
              width: '50%', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '2rem' 
          }}>
            {/* Play button */}
            <Button 
              onClick={handlePlayRandomWaveform} 
              disabled={score.total >= 10 && isPlayed} 
              rightSection={ <IconPlayerPlayFilled size={20} />}
              variant="gradient" 
              gradient={{ from: 'indigo', to: 'cyan' }}
              size="xl"
              sx={{ width: '300px', alignSelf: 'center' }}
            >
              Play
            </Button>

            <Grid>
                {waves.map((wave) => (
                  <Grid.Col key={waves.name} span={6}>
                    <Button
                      onClick={() => handleGuess(wave.name)}
                      disabled={score.total >= 10 && !isPlayed} 
                      variant="outline"
                      radius="lg"
                      color="blue"
                      fullWidth
                      h={100}
                      styles={{
                        inner: {
                          flexDirection: 'column',
                          height: '100%',
                          justifyContent: 'center',
                        },
                      }}
                    >
                      <Text size="lg" weight={500} fw={700}>{wave.name}</Text>
                      {/* <Text size="xs" mt={4} c="dimmed">
                        {effect.description}
                      </Text> */}
                    </Button>
                  </Grid.Col>
                ))}
              </Grid>

            {/* Visualization controls */}
            <Group position="center" spacing="md" sx={{ width: '100%' }}>
              <Button 
                onClick={() => setShowSpectrum(!showSpectrum)} 
                color="teal"
                size="lg"
                sx={{ width: '200px' }}
              >
                {showSpectrum ? 'Hide Spectrum' : 'Show Spectrum'}
              </Button>
              <Button 
                onClick={() => setShowWaveform(!showWaveform)} 
                color="teal"
                size="lg"
                sx={{ width: '200px' }}
              >
                {showWaveform ? 'Hide Waveform' : 'Show Waveform'}
              </Button>
            </Group>
          </div>

          {/* Right side with RingProgress */}
          <div style={{ width: '30%', display: 'flex', justifyContent: 'center' }}>
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

        {/* Visualizations */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          {showSpectrum && (
            <div>
              <Text weight={500} mb="sm">Spectrum</Text>
              <canvas 
                ref={canvasRef} 
                width="400" 
                height="200" 
                style={{ backgroundColor: '#1a1a1a', borderRadius: '8px' }} 
              />
            </div>
          )}
          {showWaveform && (
            <div>
              <Text weight={500} mb="sm">Waveform</Text>
              <canvas 
                ref={waveformCanvasRef} 
                width="400" 
                height="200" 
                style={{ backgroundColor: '#1a1a1a', borderRadius: '8px' }} 
              />
            </div>
          )}
        </div>
      </Paper>
    </Container>
  </Frame>
);
}

export default SoundExercise;