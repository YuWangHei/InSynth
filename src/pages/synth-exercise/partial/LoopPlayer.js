/*
import React, { useEffect, useState } from 'react';
import { Button, Text } from '@mantine/core';
import * as Tone from 'tone';

function LoopPlayer({ audio }) {
  const [gainNode, setGainNode] = useState(null);
  const [musicPlayer, setMusicPlayer] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false); // State to track loading

  useEffect(() => {
    // Create a gain node
    const gain = new Tone.Gain(1).toDestination();
    setGainNode(gain);

    // Create the audio player
    const player = new Tone.Player(audio, () => {
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
      {!isLoaded && <Text>Loading...</Text>}
    </Text>
  );
};

export default LoopPlayer;
*/

import { Button, Flex } from "@mantine/core";
import { useEffect, useState } from "react";

function LoopPlayer({ audioFile }) {
  const [audioCtx, setAudioCtx] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);

  // Initialize audio only if it hasn't, check every update on audioCtx
  useEffect(() => {
    if (!audioCtx) {
      const ctx = new window.AudioContext();
      setAudioCtx(ctx);
    }
  }, [audioCtx]);

  // Play the selected audio file
  const playAudio = () => {
    if (audioFile) {
      // Stop any currently playing audio
      if (currentAudio) {
        currentAudio.pause();
      }
      // Play the audio file and set it to loop
      const audio_element = new Audio(audioFile);
      audio_element.loop = true;
      audio_element.play();
      setCurrentAudio(audio_element);
    }
    else {
      alert('No audio file providied in <LoopPlayer/>.');
    }
  }

  // Stop currently playing audio
  const stopAudio = () => {
    // Action only if something is really playing
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
  }

  return (
    <Flex>
      <Button onClick={playAudio}>Play</Button>
      <Button onClick={stopAudio}>Stop</Button>
    </Flex>
  )
}

export default LoopPlayer;