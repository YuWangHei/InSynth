import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Alert, Button, Container, Group, Paper, Stack, Switch, Text } from '@mantine/core';
import { IconRefresh, IconArrowRight } from '@tabler/icons-react';
import Frame from '../../Frame';
import audioFile from '../../Music/Mineral_cropped.wav'

function AmplitudeExercise() {
    const navigate = useNavigate();
    const location = useLocation();
    const { difficulty, maxQuestions } = location.state || {};
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [gainValue, setGainValue] = useState(0);
    const [isOriginal, setIsOriginal] = useState(false);

    const audioContextRef = useRef(new (window.AudioContext || window.webkitAudioContext)());
    const gainNodeRef = useRef(audioContextRef.current.createGain());
    const [result, setResult] = useState(0);

    const [score, setScore] = useState({ correct: 0, total: 0 });
    const MAX_SCORE = maxQuestions;
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
        let difference = 0;
        if (difficulty === 'Easy') {
            difference = Math.floor(Math.random() * 2) + 4;
        } else {
            difference = Math.floor(Math.random() * 5) + 1;
        }
        difference = (Math.random() < 0.5) ? difference : -difference;
        if (random < 0.5) {
            setAnswer1(answer);
            setAnswer2(answer + difference);
        } else {
            setAnswer2(answer);
            setAnswer1(answer + difference);
        }
    };

    const nextQuestion = () => {
        generateAnswer(generateRandomGain());
        setHasAnswered(false);
        if (isPlaying) {
            togglePlay();
        }
    };

    useEffect(() => {
        let source;
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const gain = context.createGain();

        // Only create and connect the source when audio starts playing
        const setupAudio = () => {
            if (!source) {
                source = context.createMediaElementSource(audioRef.current);
                source.connect(gain);
                gain.connect(context.destination);
                gainNodeRef.current = gain;
            }
        };

        // Add event listener for the first play
        audioRef.current.addEventListener('play', setupAudio, { once: true });

        nextQuestion();

        return () => {
            if (source) {
                source.disconnect();
                gain.disconnect();
            }
        };
    }, []);

    const handleGainChange = (event) => {
        const newGainValue = event.target.value;
        setGainValue(newGainValue);
        // Convert the slider value to an amplification factor
        const amplification = Math.pow(10, newGainValue / 20); // Convert to exponential scaling
        gainNodeRef.current.gain.setValueAtTime(amplification, audioContextRef.current.currentTime);
    };

    const togglePlay = async () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            await audioContextRef.current.resume();
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const [hasAnswered, setHasAnswered] = useState(false);
    const handleAnswer = (answer) => {
        if (!hasAnswered) {
            setHasAnswered(true);
            if (answer === gainValue) {
                setResult(1);
                setScore({ correct: score.correct + 1, total: score.total + 1 });
            } else {
                setResult(0);
                setScore({ ...score, total: score.total + 1 });
            }
            if (isPlaying) {
                togglePlay();
            }
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

    const startOver = () => {
        navigate('/AmplitudeExercise/setup');
    }

    return (
        <Frame>
            <Container size="lg" mt="xl">
                <Paper shadow="md" p="xl" radius="md" align="center">
                    <audio ref={audioRef} src={audioFile} loop />
                    <Stack style={{ width: '50%' }}>
                        <Button onClick={togglePlay}>
                            {isPlaying ? 'Pause' : 'Play'}
                        </Button>
                        <Group justify="center" grow wrap="nowrap">
                            <Button onClick={() => handleAnswer(answer1)}>{answer1}</Button>
                            <Button onClick={() => handleAnswer(answer2)}>{answer2}</Button>
                        </Group>
                        {/* </Stack>

                    <Stack> */}
                        {hasAnswered && (
                            <Alert
                                color={result ? "green" : "red"}
                                title={<Text fw={700} size="lg">{result ? "Correct!" : "Not quite!"}</Text>}
                            >
                                {/* <Text fw={500} size="md" mt={4}>
                                {!correct && 
                                    ` The sound was panned to ${currentPan}.`}
                            </Text> */}
                            </Alert>
                        )}

                        {score.total >= MAX_SCORE && (
                            <Alert
                                color="green"
                                title={<Text fw={700} size="lg">Finished!</Text>}
                            >
                                <Text fw={500} size="md" mt={4}>
                                    All {MAX_SCORE} Questions are finished.
                                    Your score is {score.correct}/{score.total}!!!
                                </Text>
                            </Alert>
                        )}

                        <Button
                            onClick={score.total >= MAX_SCORE ? startOver : nextQuestion}
                            disabled={!hasAnswered}
                            rightSection={score.total >= MAX_SCORE ? <IconRefresh size={20} /> : <IconArrowRight size={20} />}
                            variant={score.total < MAX_SCORE ? "light" : "filled"}
                            fullWidth
                        >
                            {score.total >= MAX_SCORE ? "Start Over" : "Next Stage"}
                        </Button>
                    </Stack>
                    {/* {hasAnswered && <Button onClick={nextQuestion}>Next Question</Button>} */}
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