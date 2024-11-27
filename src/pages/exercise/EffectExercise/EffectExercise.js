import React, { useState, useEffect, useRef } from 'react';
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
  RingProgress,
  ActionIcon
} from '@mantine/core';
import { IconVolume, IconRefresh, IconArrowRight, IconPlayerPlayFilled, IconPlayerPauseFilled, IconPlayerPause, IconSettings } from '@tabler/icons-react';
import Frame from '../../Frame';
import { getRandomAudio } from '../../../Music/AudioPicker';
import { useNavigate, useLocation } from 'react-router-dom';

const TotalScore = 10;
// Set up sound effects for different difficulty
const DIFFICULTY_CONFIG = {
  'Easy': {
    effectStrength: 1,
    parameterMultipliers: {
      'Reverb': { length: 1.5, decay: 1.5 },
      'Delay': { delayTime: 1.5, feedback: 1.5 },
      'Compression': { threshold: 1.5, ratio: 1.5 },
      'Distortion': { amount: 1.5 }
    }
  },
  'Hard': {
    effectStrength: 0.5,
    parameterMultipliers: {
      'Reverb': { length: 0.5, decay: 0.5 },
      'Delay': { delayTime: 0.5, feedback: 0.5 },
      'Compression': { threshold: 0.5, ratio: 0.5 },
      'Distortion': { amount: 0.5 }
    }
  }
};

const effects = [
  {
    name: 'Reverb',
    description: 'Adds space and depth to the sound',
    setup: async (audioContext, difficulty) => {
      const config = DIFFICULTY_CONFIG[difficulty];
      const convolver = audioContext.createConvolver();
      const length = audioContext.sampleRate * (2 * config.parameterMultipliers['Reverb'].length);
      const impulse = audioContext.createBuffer(2, length, audioContext.sampleRate);
      
      for (let channel = 0; channel < 2; channel++) {
        const channelData = impulse.getChannelData(channel);
        for (let i = 0; i < length; i++) {
          channelData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (length / (6 * config.parameterMultipliers['Reverb'].decay)));
        }
      }
      convolver.buffer = impulse;
      return convolver;
    }
  },
  {
    name: 'Delay',
    description: 'Creates echoing repeats of the sound',
    setup: (audioContext, difficulty) => {
      const config = DIFFICULTY_CONFIG[difficulty];
      const delay = audioContext.createDelay();
      const feedback = audioContext.createGain();
      delay.delayTime.value = 0.3 * config.parameterMultipliers['Delay'].delayTime;
      feedback.gain.value = 0.4 * config.parameterMultipliers['Delay'].feedback;
      delay.connect(feedback);
      feedback.connect(delay);
      return delay;
    }
  },
  {
    name: 'Compression',
    description: 'Controls dynamic range',
    setup: (audioContext, difficulty) => {
      const config = DIFFICULTY_CONFIG[difficulty];
      const compressor = audioContext.createDynamicsCompressor();
      compressor.threshold.value = -24 * config.parameterMultipliers['Compression'].threshold;
      compressor.knee.value = 30;
      compressor.ratio.value = 12 * config.parameterMultipliers['Compression'].ratio;
      compressor.attack.value = 0.003 ;
      compressor.release.value = 0.25;
      return compressor;
    }
  },
  {
    name: 'Distortion',
    description: 'Adds harmonic saturation and grit',
    setup: (audioContext, difficulty ) => {
      const config = DIFFICULTY_CONFIG[difficulty];
      const distortion = audioContext.createWaveShaper();
      const amount = 50 * config.parameterMultipliers['Distortion'].amount;
      function makeDistortionCurve(amount) {
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        for (let i = 0; i < n_samples; ++i) {
          const x = (i * 2) / n_samples - 1;
          curve[i] = (Math.PI + amount) * x / (Math.PI + amount * Math.abs(x));
        }
        return curve;
      }
      distortion.curve = makeDistortionCurve(amount);
      return distortion;
    }
  }
];

function EffectExercise() {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    difficulty = 'Easy', 
    maxQuestions = 10 
  } = location.state || {};

  const [currentEffect, setCurrentEffect] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [selectedEffect, setSelectedEffect] = useState(null);
  const [isPlayingOriginal, setIsPlayingOriginal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const audioContextRef = useRef(null);
  const audioBufferRef = useRef(null);
  const currentSourceRef = useRef(null);

  useEffect(() => {
    if (!location.state) {
      navigate('/EffectExercise/setup');
      return;
    }

    generateNewEffect();
    
    const initAudio = async () => {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

      const audioFile = getRandomAudio();
      const response = await fetch(audioFile);
      const arrayBuffer = await response.arrayBuffer();
      audioBufferRef.current = await audioContextRef.current.decodeAudioData(arrayBuffer);
    };
    initAudio();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [location.state, navigate]);

  const generateNewEffect = () => {
    stopCurrentSound();

    if (score.total <= TotalScore) {
      const randomEffect = effects[Math.floor(Math.random() * effects.length)];
      setCurrentEffect(randomEffect);
      setSelectedEffect(null);
      setShowFeedback(false);
    } else {
      setCurrentEffect(null);
      setShowFeedback(false);
    }
  };

  const startOver = () => {
    setScore({ correct: 0, total: 0 });
    generateNewEffect();
  };

  const stopCurrentSound = () => {
    if (currentSourceRef.current) {
      try {
        currentSourceRef.current.stop();
      } catch (e) {
        console.log('Error stopping source:', e);
      }
      currentSourceRef.current.disconnect();
      currentSourceRef.current = null;
    }
    setIsPlaying(false);
    setIsPlayingOriginal(false);
  };


  const playOriginalSound = async () => {
    if (!audioContextRef.current || !audioBufferRef.current) return;

    // If already playing original sound, stop it
    if (isPlayingOriginal) {
      stopCurrentSound();
      return;
    }

    // Stop any currently playing sound
    stopCurrentSound();

    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    setIsPlayingOriginal(true);
    setIsPlaying(false);

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBufferRef.current;
    currentSourceRef.current = source;

    const gainNode = audioContextRef.current.createGain();
    gainNode.gain.value = 0.7;

    source.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    source.start(0);
    // source.onended = () => {
    //   setIsPlayingOriginal(false);
    //   currentSourceRef.current = null;
    // };
  };

  const handlePlay = async () => {
    if (!audioContextRef.current || !audioBufferRef.current) return;

    // If already playing effected sound, stop it
    if (isPlaying) {
      stopCurrentSound();
      return;
    }

    stopCurrentSound();

    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    setIsPlaying(true);
    setIsPlayingOriginal(false);


    // Create audio source
    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBufferRef.current;
    currentSourceRef.current = source;


    // Create gain node for final output
    const gainNode = audioContextRef.current.createGain();
    gainNode.gain.value = 0.7; // Prevent clipping

    // Set up effect chain
    try {
      const effectNode = await currentEffect.setup(audioContextRef.current, difficulty);

      // Connect the audio nodes
      source.connect(effectNode);
      effectNode.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      // Play the sound
      source.start(0);

      // Stop the sound when it ends
      //   source.onended = () => {
      //     setIsPlaying(false);
      //     currentSourceRef.current = null;

      //   };
    } catch (error) {
      console.error('Error setting up audio effect:', error);
      setIsPlaying(false);
      currentSourceRef.current = null;
    }
  };

  const handleEffectGuess = (effect) => {
    setSelectedEffect(effect);
    setShowFeedback(true);

    if (effect.name === currentEffect.name) {
      setScore(prev => ({
        correct: prev.correct + 1,
        total: prev.total + 1
      }));
    } else {
      setScore(prev => ({
        ...prev,
        total: prev.total + 1
      }));
    }
  };

  const handleBackToSetup = () => {
    navigate('/EffectExercise/setup');
  };

  return (
    <Frame>
      <Container size="md" px="md">
        <Stack spacing="lg">
          <Title order={1} align='center'>
              Effect Exercise
              <Text size="md" fs={700} c="dimmed">
                {difficulty} Mode | {maxQuestions} Questions
              </Text>
            </Title>

          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Stack spacing="md">
              <Group position="apart" justify="space-between" align="center">
                <Group>
                  <Button
                    onClick={playOriginalSound}
                    disabled={isPlayingOriginal}
                    rightSection={isPlayingOriginal ? <IconVolume size={20} /> : <IconPlayerPlayFilled size={20} />}
                    variant="filled"
                    color="green"
                    size='lg'
                  >
                    {isPlayingOriginal ? 'Playing Original...' : 'Play Original'}
                  </Button>
                  <Button
                    onClick={handlePlay}
                    disabled={isPlaying}
                    rightSection={isPlaying ? <IconVolume size={20} /> : <IconPlayerPlayFilled size={20} />}
                    color="indigo"
                    size='lg'
                  >
                    {isPlaying ? 'Playing Effect...' : 'Play with Effect'}
                  </Button>
                  <Button
                    onClick={stopCurrentSound}
                    variant="filled"
                    color="rgba(255, 18, 18, 1)"
                    size='lg'
                    rightSection={!isPlaying && !isPlayingOriginal ? <IconPlayerPauseFilled size={20} /> : <IconPlayerPause size={20} />}
                  >
                    {"Stop"}
                  </Button>
                  <ActionIcon
                    onClick={handleBackToSetup}
                    color="Grey"
                    variant="filled"
                    size='xl'
                  >
                    <IconSettings size={30} />
                  </ActionIcon>
                  {/* Text for Debugging */}
                  {/* <Text size="sm" c="dimmed">
                      (isPlaying: {isPlaying.toString()}, isPlayingOriginal: {isPlayingOriginal.toString()})
                </Text> */}
                </Group>
                <RingProgress
                  size={100}
                  label={
                    <Text size="lg" ta="center">
                      {score.total}/{TotalScore}
                    </Text>
                  }
                  sections={[
                    { value: ((score.total - score.correct) / TotalScore) * 100, color: 'red' },
                    { value: (score.correct / TotalScore) * 100, color: 'green' }
                  ]}
                />
                </Group>

              <Grid>
                {effects.map((effect) => (
                  <Grid.Col key={effect.name} span={6}>
                    <Button
                      onClick={() => handleEffectGuess(effect)}
                      disabled={showFeedback}
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
                      <Text size="lg" weight={500} fw={700}>{effect.name}</Text>
                      {/* <Text size="xs" mt={4} c="dimmed">
                        {effect.description}
                      </Text> */}
                    </Button>
                  </Grid.Col>
                ))}
              </Grid>

              {showFeedback && (
                <Alert
                  color={selectedEffect?.name === currentEffect?.name ? "green" : "red"}
                  title={<Text fw={700} size="lg">{selectedEffect?.name === currentEffect?.name ? "Correct!" : "Not quite!"}</Text>}
                >
                  <Text fw={500} size="md" mt={4}>
                    The effect was {currentEffect?.name}.
                    {selectedEffect?.name !== currentEffect?.name &&
                      ` Listen for ${currentEffect?.description.toLowerCase()}`}
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
                onClick={score.total < maxQuestions ? generateNewEffect : startOver}
                disabled={!showFeedback}
                rightSection={score.total >= maxQuestions ? <IconRefresh size={20} /> : <IconArrowRight size={20} />}
                variant={score.total < maxQuestions ? "light" : "filled"}
                fullWidth
              >
                {score.total >= maxQuestions ? "Start Over" : "Next Sound"}
          </Button>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </Frame>
  );
}

export default EffectExercise;