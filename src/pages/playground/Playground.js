import React, { useRef, useState, useEffect } from 'react';
import { Button, Group, Text, FileButton, Container, Switch, Title, Slider, Stack, Flex, Paper, Progress } from '@mantine/core';
import Frame from '../Frame';

function Playground() {
  const [file, setFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  
  // Audio processing state
  const [gainValue, setGainValue] = useState(0);
  const [panValue, setPanValue] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Web Audio API references
  const audioContextRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const gainNodeRef = useRef(null);
  const pannerNodeRef = useRef(null);
  const bufferRef = useRef(null);
  const animationFrameRef = useRef(null);
  const createAudioGraph = (audioBuffer) => {
    // Close existing context if it exists
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    // Create new audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioContextRef.current = audioContext;

    // Create nodes
    const sourceNode = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();
    const pannerNode = audioContext.createStereoPanner();

    // Connect nodes
    sourceNode.buffer = audioBuffer;
    sourceNode.connect(gainNode);
    gainNode.connect(pannerNode);
    pannerNode.connect(audioContext.destination);

    // Store references
    sourceNodeRef.current = sourceNode;
    gainNodeRef.current = gainNode;
    pannerNodeRef.current = pannerNode;
    bufferRef.current = audioBuffer;

    // Set duration
    setDuration(audioBuffer.duration);

    return sourceNode;
  };

  const handleFileSelect = (selectedFile) => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContext.decodeAudioData(e.target.result, (audioBuffer) => {
          createAudioGraph(audioBuffer);
          setFile(selectedFile);
        });
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const playAudio = () => {
    if (sourceNodeRef.current) {
      // Stop any existing source
      if (isPlaying) {
        sourceNodeRef.current.stop();
      }

      // Create a new source node
      const sourceNode = audioContextRef.current.createBufferSource();
      sourceNode.buffer = bufferRef.current;
      
      // Reconnect nodes
      sourceNode.connect(gainNodeRef.current);
      gainNodeRef.current.connect(pannerNodeRef.current);
      pannerNodeRef.current.connect(audioContextRef.current.destination);

      // Set loop if enabled
      sourceNode.loop = isLooping;

      // Apply gain and pan
      gainNodeRef.current.gain.setValueAtTime(Math.pow(10, gainValue / 20), audioContextRef.current.currentTime);
      pannerNodeRef.current.pan.setValueAtTime(panValue, audioContextRef.current.currentTime);

      // Track current time
      // Track current time
      const startTime = audioContextRef.current.currentTime;
      const updateCurrentTime = () => {
        if (isPlaying) {
          const elapsedTime = audioContextRef.current.currentTime - startTime;
          const normalizedTime = elapsedTime % duration;
          setCurrentTime(normalizedTime);
          
          // Continue updating if still playing
          animationFrameRef.current = requestAnimationFrame(updateCurrentTime);
        }
      };

      // Start playback
      sourceNode.start(0);
      sourceNodeRef.current = sourceNode;
      setIsPlaying(true);
      updateCurrentTime();
    }
  };

  

  const pauseAudio = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      setIsPlaying(false);
      
      // Cancel animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };


  const handlePlayPause = () => {
    isPlaying ? pauseAudio() : playAudio();
  };

  const handleGainChange = (value) => {
    setGainValue(value);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setValueAtTime(Math.pow(10, value / 20), audioContextRef.current.currentTime);
    }
  };

  const handlePanChange = (value) => {
    setPanValue(value);
    if (pannerNodeRef.current) {
      pannerNodeRef.current.pan.setValueAtTime(value, audioContextRef.current.currentTime);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <Frame>
      <Container size="lg" px="md">
        <Title order={1} align='center'>
          Audio Playground
          <Text size="md" fs={700}>
            Upload and manipulate your audio files
          </Text>
        </Title>
        <Container size="lg">
          <Stack position="center" direction="column" spacing="lg">
            <FileButton
              onChange={handleFileSelect}
              accept="audio/*"
              color="green"
              fullWidth={false}
            >
              {(props) => (
                <Button {...props} size="lg">
                  {file ? 'Change audio file' : 'Upload audio file'}
                </Button>
              )}
            </FileButton>
            
            {file && (
              <Paper>
                <Flex direction="column" gap="md">
                  <Text size="md">
                    Selected file: {file.name}
                  </Text>

                  <Group position="center" spacing="md">
                    <Button onClick={handlePlayPause}>
                      {isPlaying ? 'Pause' : 'Play'}
                    </Button>
                    <Switch
                      label="Loop"
                      checked={isLooping}
                      onChange={() => setIsLooping(!isLooping)}
                    />
                  </Group>

                  {/* Time display */}
                  <Flex justify="space-between">
                    <Text>Time</Text>
                    <Progress value={currentTime / duration} />
                    <Text>{Math.round(currentTime)}s</Text>
                    <Text>{Math.round(duration)}s</Text>
                  </Flex>

                  <Slider
                    label="Gain"
                    min={-20}
                    max={20}
                    step={1}
                    value={gainValue}
                    onChange={handleGainChange}
                    marks={[
                      { value: -20, label: '-20dB' },
                      { value: 0, label: '0dB' },
                      { value: 20, label: '+20dB' },
                    ]}
                  />

                  <Slider
                    label="Pan"
                    min={-1}
                    max={1}
                    step={0.1}
                    value={panValue}
                    onChange={handlePanChange}
                    marks={[
                      { value: -1, label: 'Left' },
                      { value: 0, label: 'Center' },
                      { value: 1, label: 'Right' },
                    ]}
                  />
                </Flex>
              </Paper>
            )}
          </Stack>
        </Container>
      </Container>
    </Frame>
  );
}

export default Playground;