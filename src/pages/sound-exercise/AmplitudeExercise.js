import React, { useEffect, useRef, useState } from 'react';
import { Button, Container, Paper, Slider } from '@mantine/core';
import Frame from '../Frame';
import audioFile from '../../Music/Mineral_cropped.wav'

function AmplitudeExercise() {
    const [value, setValue] = useState(0); // Initial value
    const audioRef = useRef(null); // Create a ref to the audio element
    const [audioContext, setAudioContext] = useState(null);
    const [gainNodeLeft, setGainNodeLeft] = useState(null);
    const [gainNodeRight, setGainNodeRight] = useState(null);

    useEffect(() => {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        setAudioContext(context);

        const leftGain = context.createGain();
        const rightGain = context.createGain();
        setGainNodeLeft(leftGain);
        setGainNodeRight(rightGain);

        // Connect the gain nodes to the audio context destination
        leftGain.connect(context.destination);
        rightGain.connect(context.destination);
        
        return () => {
        context.close(); // Clean up the audio context on unmount
        };
    }, []);

    const playSong = async () => {
        if (!audioContext) return;

        const response = await fetch({audioFile}); // Replace with your audio file
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;

        // Connect source to gain nodes
        source.connect();
        source.connect(gainNodeRight);

        // Set different amplitudes for left and right channels
        gainNodeLeft.gain.setValueAtTime(1, audioContext.currentTime); // Left channel amplitude
        gainNodeRight.gain.setValueAtTime(0.5, audioContext.currentTime); // Right channel amplitude

        source.start();
    };

    // const playSong = () => {
    //     if (audioRef.current) {
    //         audioRef.current.play(); // Play the audio
    //     }
    // };
  
    return (
      <Frame>   <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '50px' }}>
        <Paper shadow="md" p="xl" radius="md" style={{width: '600px'}}>
        <h2>Value: {value}</h2>
        <audio ref={audioRef} src={audioFile} preload="auto" />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Button onClick={playSong} variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }}>
            Play
            </Button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <span>Left</span>
            <Slider
                value={value}
                onChange={setValue}
                min={-100}
                max={100}
                step={1}
                style={{ flex: 1, margin: '0 10px' }} // Set a width for the slider
            />
            <span>Right</span>
        </div>
        </Paper></Container>
      </Frame>
    );
  }

export default AmplitudeExercise;