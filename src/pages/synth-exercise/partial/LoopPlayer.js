import React, { useEffect, useState } from 'react';
import { Button, Text } from '@mantine/core';
import { audio2 } from '../../../Music';
import * as Tone from 'tone';

const LoopPlayer = () => {
  const [gainNode, setGainNode] = useState(null);
  const [musicPlayer, setMusicPlayer] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false); // State to track loading

  useEffect(() => {
    // Create a gain node
    const gain = new Tone.Gain(1).toDestination();
    setGainNode(gain);

    // Create the audio player
    const player = new Tone.Player(audio2, () => {
      player.loop = true; // Loop the audio
      setIsLoaded(true); // Mark as loaded
    }).connect(gain);

    setMusicPlayer(player);

    // Cleanup on unmount
    return () => {
      if (player) {
        player.stop(); // Stop playback
        player.dispose(); // Dispose the player
      }
      if (gain) {
        gain.dispose(); // Dispose the gain node
      }
    };
  }, []);

  const startPlayback = async () => {
    await Tone.start(); // Start the Tone.js context
    if (isLoaded && musicPlayer) {
      musicPlayer.start(); // Start playback if loaded
    }
  };

  const stopPlayback = () => {
    if (musicPlayer) {
      musicPlayer.stop(); // Stop playback
    }
  };

  const halveVolume = () => {
    if (gainNode) {
      gainNode.gain.value /= 2; // Halve the gain value
    }
  };

  return (
    <Text>
      <Button onClick={startPlayback}>Play Music</Button>
      <Button onClick={stopPlayback}>Stop Music</Button>
      <Button onClick={halveVolume}>Halve Volume</Button>
      {!isLoaded && <Text>Loading...</Text>} {/* Optional loading indicator */}
    </Text>
  );
};

export default LoopPlayer;