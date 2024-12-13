import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  Title,
  Button,
  Group,
  Stack,
  Card,
  Text,
  Grid,
  Alert,
  Container,
  RingProgress
} from '@mantine/core';
import { IconRefresh, IconArrowRight, IconPlayerPlayFilled } from '@tabler/icons-react';
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

  const navigate = useNavigate();
  const location = useLocation();

  const canvasRef = useRef(null);
  const waveformCanvasRef = useRef(null);
  const analyzerRef = useRef(null);
  const waveformAnalyzerRef = useRef(null);
  const animationRef = useRef(null);
  const waveformAnimationRef = useRef(null);
  const TotalScore = 10;
  let currentSynth = null; // Store current synth instance

  useEffect(() => {

      // Return to setup if no parameters passed
    if (!location.state) {
      navigate('/SoundSynth/setup');
    }
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
    if (!canvas || !waveformAnalyzerRef.current) return; // Ensure analyzer is ready
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear before drawing
    const values = waveformAnalyzerRef.current.getValue();

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#00ff00';

    values.forEach((value, i) => {
      const x = (canvas.width * i) / values.length;
      const y = ((value + 1) / 2) * canvas.height;
      ctx.lineTo(x, y);
    });

    ctx.stroke();

    waveformAnimationRef.current = requestAnimationFrame(drawWaveform);
  };

  const drawSpectrum = () => {
    const canvas = canvasRef.current;
    if (!canvas || !analyzerRef.current) return; // Ensure analyzer is ready
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear before drawing
    const values = analyzerRef.current.getValue();

    const barCount = 32;
    const barWidth = (canvas.width / barCount) * 0.8;

    for (let i = 0; i < barCount; i++) {
      let sum = 0;
      for (let j = (i / barCount) * values.length; j < ((i + 1) / barCount) * values.length; j++) {
        sum += values[j];
      }

      const average = sum / (values.length / barCount);
      const barHeight = ((average + 140) * canvas.height / 140);

      ctx.fillStyle = '#00ff00';
      ctx.fillRect(i * (barWidth + (canvas.width / barCount) * 0.2), canvas.height - barHeight, barWidth, barHeight);
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
      'Sawtooth Wave': 'sawtooth',
      'Triangle Wave': 'triangle'
    };

    const oscillatorType = waveformMap[type] || type;

    // Stop the previous synth if it exists
    if (currentSynth) {
      currentSynth.triggerRelease(); // Release any currently playing notes
    }

    // Create a new synth instance
    currentSynth = new Tone.Synth({
      oscillator: { type: oscillatorType },
      envelope: {
        attack: 0.1,
        decay: 0.2,
        sustain: 0.5,
        release: 0.8
      }
    }).chain(analyzerRef.current, waveformAnalyzerRef.current, Tone.Destination);
    currentSynth.triggerAttackRelease('A4', '1');

    drawSpectrum();
    drawWaveform();

    // Trigger the note
  };



  const handlePlayRandomWaveform = async () => {
    setShowFeedback(false);
    try {
      // Ensure audio context is started
      if (!Tone.context || Tone.context.state !== "running") {
        await initializeAudio();
      }

      if (score.total >= TotalScore) {
        setResult("Start Next Round!");
        return;
      }

      const waveforms = ['Sine Wave', 'Square Wave', 'Sawtooth Wave', 'Triangle Wave'];
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

  const startOver = () => {
    setScore({ correct: 0, total: 0 });
    handlePlayRandomWaveform();
  };

  const handleHearAgain = () => {
    if (currentWaveform) {
      playWaveform(currentWaveform);
    }
  };

  // Function to handle user's guess
  const handleGuess = (guess) => {
    if (!currentWaveform || !isPlayed) {
      setIsGuessed(false);
      setShowFeedback(true);
      setResult('Pick a new sound first!');
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

  useEffect(() => {
    if (score.total == TotalScore) {
        const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith("SoundSynth="))
        ?.split("=")[1];
        let data = (cookieValue) ? JSON.parse(cookieValue) : {totalEx: 0, totalQ: 0, correct: 0, wrong: 0};
        data.totalEx++;
        data.totalQ += score.total;
        data.correct += score.correct;
        data.wrong += score.total - score.correct;
        document.cookie = `SoundSynth=${JSON.stringify(data)};`;
    }
}, [score])

  return (
    <Container size="md" px="md">
      <Stack spacing="lg">
        <Title order={1} align='center'>Sound Exercise</Title>

        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Stack spacing="md">
            <Group position="apart" justify="space-between" align="center">
              <Group>
                <Button
                  onClick={handlePlayRandomWaveform}
                  disabled={score.total >= 10 || isPlayed || showFeedback}
                  rightSection={<IconPlayerPlayFilled size={20} />}
                  variant="gradient"
                  gradient={{ from: 'indigo', to: 'cyan' }}
                  size="xl"
                  sx={{ width: '300px', alignSelf: 'center' }}
                >
                  New Sound
                </Button>
                <Button
                  onClick={handleHearAgain}
                  disabled={!currentWaveform || !isPlayed}
                  rightSection={<IconPlayerPlayFilled size={20} />}
                  variant="gradient"
                  gradient={{ from: 'indigo', to: 'cyan' }}
                  size="xl"
                  sx={{ width: '300px', alignSelf: 'center', marginLeft: '10px' }}>
                  Hear Again
                </Button>
                {/* Text for Debugging */}
                {/* <Text size="sm" c="dimmed">
                      (isPlaying: {isPlaying.toString()}, isPlayingOriginal: {isPlayingOriginal.toString()})
                </Text> */}
              </Group>
              <RingProgress
                size={110}
                label={
                  <Text size="lg" ta="center">
                    {score.total}/{TotalScore}
                  </Text>
                }
                sections={[
                  { value: ((score.total - score.correct) / TotalScore) * 100, color: 'red' },
                  { value: (score.correct / TotalScore) * 100, color: 'green' },
                ]}
              />

            </Group>

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

            {showFeedback && (
              <Alert
                color={isGuessed ? 'green' : 'red'}
                title={<Text fw={700} size="lg">{isGuessed ? "Correct!" : "Not quite!"}</Text>}
              >
                <Text fw={500} size="md" mt={4}>
                  {result}
                </Text>
              </Alert>
            )}


            {score.total >= TotalScore && (
              <Alert
                color="green"
                title={<Text fw={700} size="lg">Finished!</Text>}
              >
                <Text fw={500} size="md" mt={4}>
                  All {TotalScore} Questions are finished.
                  Your score is {score.correct}/{score.total}!!!
                </Text>
              </Alert>
            )}
            <Button
              onClick={score.total < TotalScore ? handlePlayRandomWaveform : startOver}
              disabled={!showFeedback}
              rightSection={score.total >= TotalScore ? <IconRefresh size={20} /> : <IconArrowRight size={20} />}
              variant={score.total < TotalScore ? "light" : "filled"}
              fullWidth
            >
              {score.total >= TotalScore ? "Start Over" : "Next Sound"}
            </Button>

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
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
export default SoundExercise;