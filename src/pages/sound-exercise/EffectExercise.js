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
} from '@mantine/core';
import { IconPlayerPlay, IconVolume, IconRefresh } from '@tabler/icons-react';
import Frame from '../Frame';
import {audio1, audio2} from '../../Music';

const audioFiles = [audio1, audio2];

// Set up sound effects
const effects = [
  { 
    name: 'Reverb', 
    description: 'Adds space and depth to the sound',
    setup: async (audioContext) => {
      const convolver = audioContext.createConvolver();
      // Create impulse response
      const length = audioContext.sampleRate * 2; // 2 seconds
      const impulse = audioContext.createBuffer(2, length, audioContext.sampleRate);
      for (let channel = 0; channel < 2; channel++) {
        const channelData = impulse.getChannelData(channel);
        for (let i = 0; i < length; i++) {
          channelData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (length / 6));
        }
      }
      convolver.buffer = impulse;
      return convolver;
    }
  },
  { 
    name: 'Delay', 
    description: 'Creates echoing repeats of the sound',
    setup: (audioContext) => {
      const delay = audioContext.createDelay();
      const feedback = audioContext.createGain();
      delay.delayTime.value = 0.3;
      feedback.gain.value = 0.4;
      delay.connect(feedback);
      feedback.connect(delay);
      return delay;
    }
  },
  { 
    name: 'Compression', 
    description: 'Controls dynamic range',
    setup: (audioContext) => {
      const compressor = audioContext.createDynamicsCompressor();
      compressor.threshold.value = -24;
      compressor.knee.value = 30;
      compressor.ratio.value = 12;
      compressor.attack.value = 0.003;
      compressor.release.value = 0.25;
      return compressor;
    }
  },
  { 
    name: 'Distortion', 
    description: 'Adds harmonic saturation and grit',
    setup: (audioContext) => {
      const distortion = audioContext.createWaveShaper();
      function makeDistortionCurve(amount = 50) {
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        for (let i = 0; i < n_samples; ++i) {
          const x = (i * 2) / n_samples - 1;
          curve[i] = (Math.PI + amount) * x / (Math.PI + amount * Math.abs(x));
        }
        return curve;
      }
      distortion.curve = makeDistortionCurve();
      return distortion;
    }
  }
];

function EffectExercise() {
  const [currentEffect, setCurrentEffect] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [selectedEffect, setSelectedEffect] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const audioContextRef = useRef(null);
  const audioBufferRef = useRef(null);

  useEffect(() => {
    generateNewEffect();
    // Initialize audio context and load sample
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
  }, []);

  const getRandomAudio = () => {
    const randomIndex = Math.floor(Math.random() * audioFiles.length);
    return audioFiles[randomIndex]; 
  };
  

  const generateNewEffect = () => {
    const randomEffect = effects[Math.floor(Math.random() * effects.length)];
    setCurrentEffect(randomEffect);
    setSelectedEffect(null);
    setShowFeedback(false);
  };

  const handlePlay = async () => {
    if (!audioContextRef.current || !audioBufferRef.current) return;
    
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    setIsPlaying(true);

    // Create audio source
    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBufferRef.current;

    // Create gain node for final output
    const gainNode = audioContextRef.current.createGain();
    gainNode.gain.value = 0.7; // Prevent clipping

    // Set up effect chain
    try {
      const effectNode = await currentEffect.setup(audioContextRef.current);
      
      // Connect the audio nodes
      source.connect(effectNode);
      effectNode.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      // Play the sound
      source.start(0);
      source.onended = () => {
        setIsPlaying(false);
      };
    } catch (error) {
      console.error('Error setting up audio effect:', error);
      setIsPlaying(false);
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

  return (
    <Frame>
      <Container size="md" px="md">
        <Stack spacing="lg">
          <Title order={1}>Effect Exercise</Title>

          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Stack spacing="md">
              <Group position="apart" align="center">
                <Button
                  onClick={handlePlay}
                  disabled={isPlaying}
                  leftIcon={isPlaying ? <IconVolume size={20} /> : <IconPlayerPlay size={20} />}
                  color="blue"
                >
                  {isPlaying ? 'Playing...' : 'Play Sound'}
                </Button>
                
                <Text size="sm" weight={500}>
                  Score: {score.correct}/{score.total}
                </Text>
              </Group>

              <Grid>
                {effects.map((effect) => (
                  <Grid.Col key={effect.name} span={6}>
                    <Button
                      onClick={() => handleEffectGuess(effect)}
                      disabled={showFeedback}
                      variant={selectedEffect?.name === effect.name ? "filled" : "light"}
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
                      <Text size="lg" weight={500}>{effect.name}</Text>
                      <Text size="xs" mt={4} color="dimmed">
                        {effect.description}
                      </Text>
                    </Button>
                  </Grid.Col>
                ))}
              </Grid>

              {showFeedback && (
                <Alert
                  color={selectedEffect?.name === currentEffect?.name ? "green" : "red"}
                  title={selectedEffect?.name === currentEffect?.name ? "Correct!" : "Not quite!"}
                >
                  The effect was {currentEffect?.name}.
                  {selectedEffect?.name !== currentEffect?.name && 
                    ` Listen for ${currentEffect?.description.toLowerCase()}`}
                </Alert>
              )}

              <Button
                onClick={generateNewEffect}
                disabled={!showFeedback}
                leftIcon={<IconRefresh size={20} />}
                variant="light"
                fullWidth
              >
                Next Sound
              </Button>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </Frame>
  );
}

export default EffectExercise;