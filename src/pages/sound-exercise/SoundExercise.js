import React, { useState } from 'react';
import { Button, Group, Text, Container, Paper } from '@mantine/core';
import Frame from '../Frame';

function SoundExercise() {
  const [result, setResult] = useState('');
  const [currentWaveform, setCurrentWaveform] = useState(null);

  // Function to play a waveform
  const playWaveform = (type) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    
    // Set the type of waveform (sine, square, sawtooth)
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // Set frequency to 440Hz (A4)
    
    // Connect oscillator to output (speakers)
    oscillator.connect(audioContext.destination);
    
    // Start and stop the oscillator after 1 second
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1);
  };

  // Function to randomly select and play a waveform
  const handlePlayRandomWaveform = () => {
    const waveforms = ['sine', 'square', 'sawtooth'];
    const randomWaveform = waveforms[Math.floor(Math.random() * waveforms.length)];
    
    setCurrentWaveform(randomWaveform); // Store the random waveform
    playWaveform(randomWaveform);       // Play the random waveform
    setResult('');                      // Clear previous result
  };

  // Function to handle user's guess
  const handleGuess = (guess) => {
    if (!currentWaveform) {
      setResult('Please click "Play" first!');
      return;
    }

    if (guess === currentWaveform) {
      setResult('Correct! You identified the waveform.');
    } else {
      setResult(`Incorrect! The correct answer was ${currentWaveform}.`);
    }
  };

  return (
    <Frame>    <Container size="xs" mt="xl">
    <Paper shadow="md" p="xl" radius="md">
      <h1>Sound Exercise</h1>

      {/* Display result */}
      <Text size="lg" weight={500} align="center" mb="md">
        {result}
      </Text>

      {/* Play button */}
      <Group position="center" mb="md">
        <Button onClick={handlePlayRandomWaveform} variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }}>
          Play
        </Button>
      </Group>

      {/* Waveform guessing buttons */}
      <Group position="center">
        <Button onClick={() => handleGuess('square')} color="blue">
          Square Wave
        </Button>
        <Button onClick={() => handleGuess('sawtooth')} color="orange">
          Sawtooth Wave
        </Button>
        <Button onClick={() => handleGuess('sine')} color="green">
          Sine Wave
        </Button>
      </Group>
    </Paper>
  </Container></Frame>

  );
}

export default SoundExercise;