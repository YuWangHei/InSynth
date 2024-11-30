import React, { useRef, useState, useEffect } from 'react';
import { Button, Group, Text, FileButton, Container, Switch, Title, Slider, Stack, Flex, Paper, Card, Space } from '@mantine/core';
import { IconPlayerPlayFilled, IconPlayerPauseFilled } from '@tabler/icons-react';

function Playground() {
  const [file, setFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);

  // Audio processing state
  const [gainValue, setGainValue] = useState(0);
  const [panValue, setPanValue] = useState(0);
  const [isReverbOn, setIsReverbOn] = useState(false);
  const [isLPFOn, setIsLPFOn] = useState(false);
  const [reverbValue, setReverbValue] = useState(0.5);
  const [LPFFrequency, setLPFFrequency] = useState(6000);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isHPFOn, setIsHPFOn] = useState(false);
  const [HPFFrequency, setHPFFrequency] = useState(10000);

  // Web Audio API references
  const audioContextRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const gainNodeRef = useRef(null);
  const pannerNodeRef = useRef(null);
  const convolverNodeRef = useRef(null);
  const lowPassFilterRef = useRef(null);
  const highPassFilterRef = useRef(null);
  const bufferRef = useRef(null);

  const waveformCanvasRef = useRef(null);
  const analyzerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const startTime = useRef(0);

  const createReverbBuffer = (audioContext, seconds = 1, decay = 2) => {
    const rate = audioContext.sampleRate;
    const length = rate * seconds;
    const impulse = audioContext.createBuffer(2, length, rate);
    const impulseL = impulse.getChannelData(0);
    const impulseR = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const n = i / length;
      impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n, decay);
      impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n, decay);
    }

    return impulse;
  };

  const createAudioGraph = (audioBuffer) => {

    // Create new audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioContextRef.current = audioContext;
    analyzerRef.current = audioContextRef.current.createAnalyser();
    analyzerRef.current.fftSize = 2048;

    // Create nodes
    const sourceNode = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();
    const pannerNode = audioContext.createStereoPanner();
    const convolverNode = audioContext.createConvolver();
    const lowPassFilter = audioContext.createBiquadFilter();
    const highPassFilter = audioContext.createBiquadFilter();

    // Configure effect nodes
    lowPassFilter.type = 'lowpass';
    highPassFilter.type = 'highpass';

    // Create reverb buffer
    const reverbBuffer = createReverbBuffer(audioContext);
    convolverNode.buffer = reverbBuffer;

    // Connect nodes
    sourceNode.buffer = audioBuffer;
    sourceNode.connect(gainNode);
    gainNode.connect(pannerNode);
    pannerNode.connect(lowPassFilter);
    // lowPassFilter.connect(highPassFilter);
    lowPassFilter.connect(audioContext.destination);

    // Store references
    sourceNodeRef.current = sourceNode;
    gainNodeRef.current = gainNode;
    pannerNodeRef.current = pannerNode;
    convolverNodeRef.current = convolverNode;
    lowPassFilterRef.current = lowPassFilter;
    highPassFilterRef.current = highPassFilter;

    bufferRef.current = audioBuffer;

    // Set duration
    setDuration(audioBuffer.duration);

    return sourceNode;
  };

  const handleFileSelect = (selectedFile) => {
    if (selectedFile) {
      // Check file type
      const fileType = selectedFile.name.toLowerCase().split('.').pop();
      if (!['mp3', 'wav'].includes(fileType)) {
        alert('Please select an MP3 or WAV file only');
        return;
      }

      // Check file size (20MB = 20 * 1024 * 1024 bytes)
      const maxSize = 20 * 1024 * 1024; // 20MB in bytes
      if (selectedFile.size > maxSize) {
        alert('File size must be less than 20MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContext.decodeAudioData(e.target.result, (audioBuffer) => {
          createAudioGraph(audioBuffer);
          setFile(selectedFile);
        }).catch(error => {
          alert('Error loading audio file. Please try another file.');
          console.error('Error decoding audio data:', error);
        });
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };



  const playAudio = () => {
    if (sourceNodeRef.current) {
      // Stop any existing source
      if (isPlaying) {
        // clearInterval(updateTimer);
        sourceNodeRef.current.stop();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Create a new source node
      const sourceNode = audioContextRef.current.createBufferSource();
      sourceNode.buffer = bufferRef.current;

      // // Recreate gain and panner nodes
      // const gainNode = audioContextRef.current.createGain();
      // const pannerNode = audioContextRef.current.createStereoPanner();

      // Recreate convolver node if reverb is on
      // let destinationNode = pannerNodeRef.current;
      // if (isReverbOn) {
      //   const reverbBuffer = createReverbBuffer(
      //     audioContextRef.current, 
      //     1, 
      //     2 * (1 - reverbValue) + 0.5
      //   );
      //   convolverNodeRef.current.buffer = reverbBuffer;
      //   pannerNodeRef.current.connect(convolverNodeRef.current);
      //   destinationNode = convolverNodeRef.current;
      // }

      // Reconnect nodes
      sourceNode.connect(gainNodeRef.current);
      gainNodeRef.current.connect(pannerNodeRef.current);
      pannerNodeRef.current.connect(lowPassFilterRef.current);
      lowPassFilterRef.current.connect(highPassFilterRef.current);
      highPassFilterRef.current.connect(analyzerRef.current);
      analyzerRef.current.connect(audioContextRef.current.destination);

      // Set loop if enabled
      sourceNode.loop = isLooping;

      // Apply gain and pan
      gainNodeRef.current.gain.setValueAtTime(Math.pow(10, gainValue / 20), audioContextRef.current.currentTime);
      pannerNodeRef.current.pan.setValueAtTime(panValue, audioContextRef.current.currentTime);
      lowPassFilterRef.current.frequency.setValueAtTime(20000, audioContextRef.current.currentTime);
      highPassFilterRef.current.frequency.setValueAtTime(0, audioContextRef.current.currentTime);

      // Only reset startTime if we're starting from the beginning
      if (!isPlaying || currentTime >= duration) {
        startTime.current = audioContextRef.current.currentTime;
      } else {
        // Adjust startTime to maintain current position
        startTime.current = audioContextRef.current.currentTime - currentTime;
      }

      // const updateTimer = setInterval(() => {
      //   if (isPlaying && audioContextRef.current) {
      //     const elapsedTime = audioContextRef.current.currentTime-startTime.current;

      //     if (elapsedTime >= duration) {
      //       // If we've reached the end and not looping, stop playback
      //       if (!isLooping) {
      //         pauseAudio();
      //         setCurrentTime(0);
      //         clearInterval(updateTimer);
      //         return;
      //       }
      //       // If looping, adjust startTime to loop back to beginning
      //       startTime.current = audioContextRef.current.currentTime;
      //     } else {
      //       setCurrentTime(elapsedTime);
      //     }
      //   }
      // }, 100);

      // Start playback from current position
      sourceNode.start(0, currentTime);
      sourceNodeRef.current = sourceNode;
      setIsPlaying(true);
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

  const handleLPFToggle = () => {
    if (isLPFOn) {
      setIsLPFOn(false);
      lowPassFilterRef.current.frequency.setValueAtTime(20000, audioContextRef.current.currentTime);
    } else {
      setIsLPFOn(true);
      lowPassFilterRef.current.frequency.setValueAtTime(LPFFrequency, audioContextRef.current.currentTime);
    }
  };

  const handleLPFChange = (value) => {
    setLPFFrequency(value);
    if (isLPFOn) {
      if (lowPassFilterRef.current) {
        lowPassFilterRef.current.frequency.setValueAtTime(LPFFrequency, audioContextRef.current.currentTime);
      }
    }
  };

  const handleReverbToggle = () => {
    if (isReverbOn) {
      setIsReverbOn(false);
    } else {
      setIsReverbOn(true);
    }
    // If currently playing, restart with new audio graph
    if (isPlaying) {
      pauseAudio();
      playAudio();
    }
  };

  const handleReverbChange = (value) => {
    setReverbValue(value);
    // If currently playing, restart with new reverb intensity
    if (isPlaying) {
      pauseAudio();
      playAudio();
    }
  };

  const handleHPFToggle = () => {
    if (isHPFOn) {
      setIsHPFOn(false);
      highPassFilterRef.current.frequency.setValueAtTime(0, audioContextRef.current.currentTime);
    } else {
      setIsHPFOn(true);
      highPassFilterRef.current.frequency.setValueAtTime(HPFFrequency, audioContextRef.current.currentTime);
    }
  };

  const handleHPFChange = (value) => {
    setHPFFrequency(value);
    if (isHPFOn) {
      if (highPassFilterRef.current) {
        highPassFilterRef.current.frequency.setValueAtTime(HPFFrequency, audioContextRef.current.currentTime);
      }
    }
  };

  const drawWaveform = () => {
    const canvas = waveformCanvasRef.current;
    if (!canvas || !analyzerRef.current) return;

    const ctx = canvas.getContext('2d');
    const bufferLength = analyzerRef.current.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);

    analyzerRef.current.getFloatTimeDomainData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#00ff00';

    const sliceWidth = canvas.width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i];
      const y = (v + 1) / 2 * canvas.height;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    ctx.stroke();
    animationFrameRef.current = requestAnimationFrame(drawWaveform);
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
    <Container size="lg" px="md">
      <Title order={1} align='center'>
        Audio Playground
        <Text size="md" fs={700}>
          Upload and manipulate your audio files
        </Text>
        <Text size="sm" c="dimmed">
          Accepts MP3 and WAV files under 20MB
        </Text>
      </Title>
      <Container size="lg">
        <Stack position="center" direction="column" spacing="lg">
          <FileButton
            onChange={handleFileSelect}
            accept=".mp3,.wav"
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
            <Paper p="xs" withBorder>
              <canvas
                ref={waveformCanvasRef}
                width={800}
                height={200}
                style={{
                  width: '100%',
                  height: '200px',
                  backgroundColor: '#1A1B1E',
                  borderRadius: '4px'
                }}
              />
            </Paper>
          )}

          {file && (
            <Paper shadow="sm" p="md" radius="md" withBorder>
              <Flex direction="column" gap="md">
                <Text size="md">
                  Selected file: {file.name}
                </Text>

                <Group position="center" spacing="md">
                  <Button
                    onClick={handlePlayPause}
                    color={isPlaying ? 'red' : 'green'}
                    rightSection={isPlaying ? <IconPlayerPauseFilled /> : <IconPlayerPlayFilled />}
                  >
                    {isPlaying ? 'Pause' : 'Play'}
                  </Button>
                  <Switch
                    label="Loop"
                    checked={isLooping}
                    onChange={() => setIsLooping(!isLooping)}
                  />
                </Group>

                {/* Time display */}
                {/* <Flex justify="space-between">
                    <Text>Time</Text>
                    <Progress value={currentTime / duration} />
                    <Text>{Math.round(currentTime)}s</Text>
                    <Text>{Math.round(duration)}s</Text>
                  </Flex> */}

                <Card shadow="sm" p="md" radius="md" withBorder>
                  <Title order={3}>Gain</Title>
                  <Slider
                    label="Gain"
                    min={-20}
                    max={20}
                    step={1}
                    value={gainValue}
                    onChange={handleGainChange}
                    color="green"
                    marks={[
                      { value: -20, label: '-20dB' },
                      { value: 0, label: '0dB' },
                      { value: 20, label: '+20dB' },
                    ]}
                  />
                  <Space h="md" />
                </Card>
                <Card shadow="sm" p="md" radius="md" withBorder>
                  <Title order={3}>Pan</Title>
                  <Slider
                    label="Pan"
                    min={-1}
                    max={1}
                    step={0.1}
                    value={panValue}
                    onChange={handlePanChange}
                    color="cyan"
                    marks={[
                      { value: -1, label: 'Left' },
                      { value: 0, label: 'Center' },
                      { value: 1, label: 'Right' },
                    ]}
                  />
                  <Space h="md" />
                </Card>
                <Card shadow="sm" p="md" radius="md" withBorder>
                  <Flex direction="row" gap="md" align="center">
                    <Title order={3}>Low-pass Filter</Title>
                    <Switch
                      checked={isLPFOn}
                      onChange={handleLPFToggle}
                    />
                  </Flex>
                  <Text size="sm" c="dimmed">isLPFOn: {isLPFOn ? 'true' : 'false'} | Freq: {LPFFrequency}Hz</Text>
                  <Slider
                    label="LPF Frequency"
                    min={100}
                    max={12000}
                    step={100}
                    value={LPFFrequency}
                    onChange={handleLPFChange}
                    color="yellow"
                    marks={[
                      { value: 100, label: '100Hz' },
                      { value: 6000, label: '6000Hz' },
                      { value: 12000, label: '12000Hz' },
                    ]}
                  />
                  <Space h="md" />
                </Card>
                <Card shadow="sm" p="md" radius="md" withBorder>
                  <Flex direction="row" gap="md" align="center">
                    <Title order={3}>High-pass Filter</Title>
                    <Switch
                      checked={isHPFOn}
                      onChange={handleHPFToggle}
                    />
                  </Flex>
                  <Text size="sm" c="dimmed">isHPFOn: {isHPFOn ? 'true' : 'false'} | Freq: {HPFFrequency}Hz</Text>
                  <Slider
                    label="HPF Frequency"
                    min={4000}
                    max={16000}
                    step={100}
                    value={HPFFrequency}
                    onChange={handleHPFChange}
                    color="indigo"
                    marks={[
                      { value: 4000, label: '4000Hz' },
                      { value: 10000, label: '10000Hz' },
                      { value: 16000, label: '16000Hz' },
                    ]}
                  />
                  <Space h="md" />
                </Card>
                <Card shadow="sm" p="md" radius="md" withBorder>
                  <Flex direction="row" gap="md" align="center">
                    <Title order={3}>Reverb</Title>
                    <Switch
                      checked={isReverbOn}
                      onChange={handleReverbToggle}
                    />
                  </Flex>
                  <Text size="sm" c="dimmed">isReverbOn: {isReverbOn ? 'true' : 'false'}</Text>

                  <Slider
                    label="Reverb Intensity"
                    min={0}
                    max={1}
                    step={0.1}
                    value={reverbValue}
                    onChange={handleReverbChange}
                    color="orange"
                    marks={[
                      { value: 0, label: 'Minimal' },
                      { value: 0.5, label: 'Medium' },
                      { value: 1, label: 'Full' },
                    ]}
                  />
                  <Space h="md" />
                </Card>
              </Flex>
            </Paper>
          )}
        </Stack>
      </Container>
    </Container>
  );
}

export default Playground;