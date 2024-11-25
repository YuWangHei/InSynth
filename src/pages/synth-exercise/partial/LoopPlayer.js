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