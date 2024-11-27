import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Alert, Button, Card, Container, Group, Stack, Switch, Text, Title, RingProgress } from '@mantine/core';
import { IconRefresh, IconArrowRight, IconPlayerPlayFilled, IconPlayerPauseFilled } from '@tabler/icons-react';
import Frame from '../../Frame';
import { getRandomAudio } from '../../../Music/AudioPicker';

function AmplitudeExercise() {
    const navigate = useNavigate();
    const location = useLocation();
    const { difficulty, maxQuestions } = location.state || {};
    const [startPlaying, setStartPlaying] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [gainValue, setGainValue] = useState(0);
    const [isOriginal, setIsOriginal] = useState(false);

    const audioContextRef = useRef(null);
    const audioBufferRef = useRef(null);
    const gainNodeRef = useRef(null);
    const sourceRef = useRef(null);
    const [result, setResult] = useState(0);

    const [score, setScore] = useState({ correct: 0, total: 0 });
    const MAX_SCORE = maxQuestions;

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
        let source = null;
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        gainNodeRef.current = audioContextRef.current.createGain();

        // Only create and connect the source when audio starts playing
        const setupAudio = async () => {
            const audioFile = getRandomAudio();
            
            const response = await  fetch(audioFile);
            const arrayBuffer = await response.arrayBuffer();
            audioBufferRef.current = await audioContextRef.current.decodeAudioData(arrayBuffer);
            sourceRef.current = audioContextRef.current.createBufferSource();
            sourceRef.current.buffer = audioBufferRef.current;

            sourceRef.current.loop = true;
            sourceRef.current.loopStart = 0;
            sourceRef.current.loopEnd = audioBufferRef.current.duration;

            sourceRef.current.connect(gainNodeRef.current);
            gainNodeRef.current.connect(audioContextRef.current.destination);
            // source = context.createMediaElementSource(audioRef.current);
                // source.connect(gain);
                // gain.connect(context.destination);
                // gainNodeRef.current = gain;
        };
        setupAudio();

        // Add event listener for the first play
        // audioRef.current.addEventListener('play', setupAudio, { once: true });

        nextQuestion();

        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    const generateRandomGain = () => {
        const randomGain = Math.floor(Math.random() * 41) - 20; // Random number between -20 and 20
        setGainValue(randomGain);
        console.log(randomGain);
        // Apply the new gain value
        const amplification = Math.pow(10, randomGain / 20);
        // gainNodeRef.current.gain.setValueAtTime(amplification, audioContextRef.current.currentTime);
        gainNodeRef.current.gain.setValueAtTime(amplification, audioContextRef.current.currentTime);

        return randomGain;
    };

    const handleGainChange = (event) => {
        const newGainValue = event.target.value;
        setGainValue(newGainValue);
        // Convert the slider value to an amplification factor
        const amplification = Math.pow(10, newGainValue / 20); // Convert to exponential scaling
        gainNodeRef.current.gain.setValueAtTime(amplification, audioContextRef.current.currentTime);
    };

    const togglePlay = async () => {
        if (!startPlaying) {
            setStartPlaying(true);
            sourceRef.current.start(0);
        }
        if (isPlaying) {
            // audioRef.current.pause();
            gainNodeRef.current.gain.setValueAtTime(0, audioContextRef.current.currentTime);
        } else {
            // await audioContextRef.current.resume();
            // audioRef.current.play();
            if (!isOriginal) {
                const amplification = Math.pow(10, gainValue / 20);
                gainNodeRef.current.gain.setValueAtTime(amplification, audioContextRef.current.currentTime);
            } else {
                gainNodeRef.current.gain.setValueAtTime(1, audioContextRef.current.currentTime);
            }
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
            <Container size="md" mt="md">
                <Stack spacing="lg" >
                    <Title order={1} align='center'>Amplitude Exercise</Title>
                    <Card shadow="md" p="lg" radius="md" withBorder>
                        
                        <Stack spacing="md">
                            <Group position="apart" justify="space-between" align="center">
                                <Button 
                                    onClick={togglePlay}
                                    rightSection={isPlaying ? <IconPlayerPauseFilled size={20} /> : <IconPlayerPlayFilled size={20} />}
                                    size='lg'
                                    color={isPlaying ? 'red' : 'green'}
                                >
                                    {isPlaying ? 'Pause' : 'Play'}
                                </Button>
                                <RingProgress
                                    size={100}
                                    label={
                                        <Text size="lg" ta="center">
                                        {score.total}/{MAX_SCORE}
                                        </Text>
                                    }
                                    sections={[
                                        { value: ((score.total - score.correct) / MAX_SCORE) * 100, color: 'red' },
                                    { value: (score.correct / MAX_SCORE) * 100, color: 'green' }
                                ]}
                            />
                            </Group>
                            
                            <Group justify="center" grow wrap="nowrap">
                                <Button 
                                    onClick={() => handleAnswer(answer1)} 
                                    variant="outline" 
                                    color="blue" 
                                    radius="lg"
                                    h={100}
                                >
                                    <Text size="xl" weight={500} fw={700}>{answer1 + " dB"}</Text>
                                </Button>
                                <Button 
                                    onClick={() => handleAnswer(answer2)} 
                                    variant="outline" 
                                    color="blue" 
                                    radius="lg" 
                                    h={100}
                                >
                                    <Text size="xl" weight={500} fw={700}>{answer2 + " dB"}</Text>
                                </Button>
                            </Group>

                        {hasAnswered && (
                            <Alert
                                color={result ? "green" : "red"}
                                title={<Text fw={700} size="lg">{result ? "Correct!" : "Not quite!"}</Text>}
                            >
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
                    {/* Text for Debugging */}
                    <Text size="sm" c="dimmed">
                        (gainValue: {gainValue})
                        (IsPlaying: {isPlaying.toString()}.)
                        </Text>
                    </Stack>
                    </Card>
                </Stack>
            </Container>
        </Frame>
    );
}

export default AmplitudeExercise;