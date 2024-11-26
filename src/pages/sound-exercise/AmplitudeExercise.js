import React, { useEffect, useRef, useState } from 'react';
import { Button, Container, Group, Paper, Slider, Stack, Switch } from '@mantine/core';
import Frame from '../Frame';
import audioFile from '../../Music/Mineral_cropped.wav'

function AmplitudeExercise() {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [gainValue, setGainValue] = useState(0);
    const [isOriginal, setIsOriginal] = useState(false);

    const audioContextRef = useRef(new (window.AudioContext || window.webkitAudioContext)());
    const gainNodeRef = useRef(audioContextRef.current.createGain());
    const [result, setResult] = useState('');
    
    const generateRandomGain = () => {
        const randomGain = Math.floor(Math.random() * 41) - 20; // Random number between -20 and 20
        setGainValue(randomGain);
        console.log(randomGain);
        // Apply the new gain value
        const amplification = Math.pow(10, randomGain / 20);
        gainNodeRef.current.gain.setValueAtTime(amplification, audioContextRef.current.currentTime);
        
        return randomGain;
    };

    const [answer1, setAnswer1] = useState(0);
    const [answer2, setAnswer2] = useState(0);
    const generateAnswer = (answer) => {
        const random = Math.random();
        let difficulty = Math.floor(Math.random() * 5) + 1;
        difficulty = (Math.random() < 0.5) ? difficulty : -difficulty;
        if (random < 0.5) {
            setAnswer1(answer);
            setAnswer2(answer+difficulty);
        } else {
            setAnswer2(answer);
            setAnswer1(answer+difficulty);
        }
    };

    useEffect(() => {
        var context = new (window.AudioContext || window.webkitAudioContext),
            result = {
                context: context,
                source: context.createMediaElementSource(audioRef.current),
                gain: context.createGain(),
                media: audioRef.current,
            };
        
        result.source.connect(result.gain);
        result.source.connect(context.destination);
        result.gain.connect(context.destination);
        
        gainNodeRef.current = result.gain;
        return () => {
            result.source.disconnect();
            result.gain.disconnect();
        };
    }, []);

    const handleGainChange = (event) => {
        const newGainValue = event.target.value;
        setGainValue(newGainValue);
        // Convert the slider value to an amplification factor
        const amplification = Math.pow(10, newGainValue / 20); // Convert to exponential scaling
        gainNodeRef.current.gain.setValueAtTime(amplification, audioContextRef.current.currentTime);
    };

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            generateAnswer(generateRandomGain());     // Generate answers based on the new gain
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const correctAnswer = (answer) => {
        if (answer === gainValue) {
            setResult('Correct!');
        } else {
            setResult('Incorrect!');
        }
    };

    const toggleOriginal = (gain) => {
        setIsOriginal(!isOriginal);
        if (!isOriginal) {
            gainNodeRef.current.gain.setValueAtTime(1, audioContextRef.current.currentTime);
        } else {
            const amplification = Math.pow(10, gain / 20);
            gainNodeRef.current.gain.setValueAtTime(amplification, audioContextRef.current.currentTime);
        }
    };

    return (
        <Frame>
            <Container size="lg" mt="xl">
                <Paper shadow="md" p="xl" radius="md" align="center">
                    <audio ref={audioRef} src={audioFile} loop/>
                    <Stack style={{width: '50%'}}>
                    <Button onClick={togglePlay}>
                        {isPlaying ? 'Pause' : 'Play'}
                    </Button>
                    <Group justify="center" grow wrap="nowrap">
                        <Button onClick={() => correctAnswer(answer1)}>{answer1}</Button>
                        <Button onClick={() => correctAnswer(answer2)}>{answer2}</Button>
                    </Group>
                    
                    </Stack>
                    <p>{result}</p>
                    <Switch
                        checked={isOriginal}
                        onChange={() => toggleOriginal(gainValue)}
                        label={isOriginal ? "Original" : "Edited"}
                        color="blue"
                        size="md"
                        styles={{
                            label: {
                                color: 'var(--mantine-color-text)',
                                fontWeight: 500
                            }
                        }}
                    />
                </Paper>
            </Container>
        </Frame>
    );
  }

export default AmplitudeExercise;