import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Title,
    Button,
    Group,
    Text,
    Container,
    Stack,
    Alert,
    RingProgress,
    Space,
    ActionIcon,
    Paper,
    Switch
} from '@mantine/core';
import { IconVolume, IconPlayerPlayFilled, IconPlayerPauseFilled, IconPlayerPause, IconRefresh, IconArrowRight, IconSettings } from '@tabler/icons-react';
import './PanningExercise.css';
import { getRandomAudio } from '../../../Music/AudioPicker';

export default function PanningExercise() {
    const navigate = useNavigate();
    const location = useLocation();
    // Get parameters from navigation state, with fallback defaults
    const {
        difficulty = 'Easy',
        maxQuestions = 3
    } = location.state || {};

    const DIFFICULTY_CONFIG = {
        'Easy': 0.2,
        'Hard': 0.15
    };

    const [currentPan, setCurrentPan] = useState(0);
    const [isPlayingOriginal, setIsPlayingOriginal] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [userGuess, setUserGuess] = useState(null);
    const [score, setScore] = useState({ correct: 0, total: 0 });
    const [hoverPosition, setHoverPosition] = useState(null);
    const audioContextRef = useRef(null);
    const audioBufferRef = useRef(null);
    const currentSourceRef = useRef(null);
    const currentPannerRef = useRef(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [correct, setCorrect] = useState(null);

    const [showWaveform, setShowWaveform] = useState(false);
    const waveformCanvasRef = useRef(null);
    const analyzerRef = useRef(null);
    const animationFrameRef = useRef(null);


    const RANGE_WIDTH = DIFFICULTY_CONFIG[difficulty];
    const MAX_SCORE = maxQuestions;


    useEffect(() => {
        // Return to setup if no parameters passed
        if (!location.state) {
            navigate('/panning-exercise/setup');
        }

        generateNewPanning();
        // Initialize audio context and load sample
        const initAudio = async () => {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            analyzerRef.current = audioContextRef.current.createAnalyser();
            analyzerRef.current.fftSize = 2048;

            const audioFile = getRandomAudio();
            const response = await fetch(audioFile);
            const arrayBuffer = await response.arrayBuffer();
            audioBufferRef.current = await audioContextRef.current.decodeAudioData(arrayBuffer);
        };
        initAudio();

        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, [location.state, navigate]);

    useEffect(() => {
        if (showWaveform && isPlaying) {
            drawWaveform();
        } else if (!showWaveform && animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
    }, [showWaveform]);

    const generateNewPanning = () => {
        // Stop any existing audio source
        stopCurrentSound();

        // Generate random pan value between -1 (left) and 1 (right)
        if (score.total <= MAX_SCORE) {
            const newPan = Math.round((Math.random() * 2 - 1) * 100) / 100;
            setCurrentPan(newPan);
            setShowAnswer(false);
            setCorrect(null);
            setUserGuess(null);
        } else {

            setCurrentPan(null);
            setShowAnswer(false);
            setCorrect(null);
            setUserGuess(null);
        }
    };

    const startOver = () => {
        setScore({ correct: 0, total: 0 });
        generateNewPanning();
    };

    const stopCurrentSound = () => {
        if (currentSourceRef.current) {
            try {
                currentSourceRef.current.stop();
            } catch (e) {
                console.log('Error stopping source:', e);
            }
            currentSourceRef.current.disconnect();
            currentSourceRef.current = null;
        }
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        setIsPlaying(false);
        setIsPlayingOriginal(false);
    };

    const playOriginalSound = async () => {
        if (!audioContextRef.current || !audioBufferRef.current) return;

        // If already playing original sound, stop it
        if (isPlayingOriginal) {
            stopCurrentSound();
            return;
        }

        // Stop any currently playing sound
        stopCurrentSound();

        if (audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
        }

        setIsPlayingOriginal(true);
        setIsPlaying(false);

        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBufferRef.current;
        currentSourceRef.current = source;

        const gainNode = audioContextRef.current.createGain();
        gainNode.gain.value = 0.7;

        source.connect(gainNode);
        gainNode.connect(analyzerRef.current);
        analyzerRef.current.connect(audioContextRef.current.destination);

        source.start(0);
        if (showWaveform) {  // Start animation if waveform is visible
            drawWaveform();
        }
    };

    const handlePlay = async () => {
        if (!audioContextRef.current || !audioBufferRef.current) return;

        // If already playing effected sound, stop it
        if (isPlaying) {
            stopCurrentSound();
            return;
        }

        stopCurrentSound();

        if (audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
        }

        setIsPlaying(true);
        setIsPlayingOriginal(false);


        // Create audio source
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBufferRef.current;
        currentSourceRef.current = source;


        // Create gain node for final output
        const gainNode = audioContextRef.current.createGain();
        gainNode.gain.value = 0.7; // Prevent clipping

        // Create and play new audio source with panning
        try {
            // Create a stereo panner node
            const pannerNode = audioContextRef.current.createStereoPanner();

            // Set the pan value (-1 for full left, 0 for center, 1 for full right)
            pannerNode.pan.value = currentPan; // Assuming currentPan is your pan value state

            // Connect the audio nodes
            source.connect(pannerNode);
            pannerNode.connect(gainNode);
            gainNode.connect(analyzerRef.current);
            analyzerRef.current.connect(audioContextRef.current.destination);

            // Play the sound
            source.start(0);

            // Optional: Store the panner node reference if you need to modify it later
            currentPannerRef.current = pannerNode;
            if (showWaveform) {  // Start animation if waveform is visible
                drawWaveform();
            }
        } catch (error) {
            console.error('Error setting up audio panning:', error);
            setIsPlaying(false);
            currentSourceRef.current = null;
        }

    };


    const handlePanningGuess = (event) => {
        const container = event.currentTarget;
        const rect = container.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const width = rect.width;

        const panValue = (x / width) * 2 - 1;
        setUserGuess(panValue);
        setShowAnswer(true);

        // Score based on accuracy
        // points is earned if panValue is within RANGE_WIDTH of currentPan
        const isWithinRange =
            currentPan >= panValue - RANGE_WIDTH &&
            currentPan <= panValue + RANGE_WIDTH;

        if (isWithinRange) {
            setScore(prev => ({
                correct: prev.correct + 1,
                total: prev.total + 1
            }));
            setCorrect(true);
        } else {
            setScore(prev => ({
                ...prev,
                total: prev.total + 1
            }));
            setCorrect(false);
        }

    };

    useEffect(() => {
        if (score.total == MAX_SCORE) {
            const cookieValue = document.cookie
            .split("; ")
            .find((row) => row.startsWith("PanningEx="))
            ?.split("=")[1];
            let data = (cookieValue) ? JSON.parse(cookieValue) : {totalEx: 0, totalQ: 0, correct: 0, wrong: 0};
            data.totalEx++;
            data.totalQ += score.total;
            data.correct += score.correct;
            data.wrong += score.total - score.correct;
            document.cookie = `PanningEx=${JSON.stringify(data)};`;
        }
    }, [score])

    const handleMouseMove = (event) => {
        const container = event.currentTarget;
        const rect = container.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const width = rect.width;
        const panValue = (x / width) * 2 - 1;
        setHoverPosition(panValue);
    };

    const handleMouseLeave = () => {
        setHoverPosition(null);
    };

    const handleBackToSetup = () => {
        navigate('/PanningExercise/setup');
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

    return (
        <Container size="md" px="md" align='center'>
            <Stack spacing="lg" >
                <Title order={1} align='center'>
                    Panning Exercise
                    <Text size="md" fs={700} c="dimmed">
                        {difficulty} Mode | {MAX_SCORE} Questions
                    </Text>
                </Title>
                <Group position='apart' justify='space-between' align='center'>
                    <Group>
                        <Stack>
                            <Group>
                                <Button
                                    onClick={playOriginalSound}
                                    disabled={isPlayingOriginal}
                                    rightSection={isPlayingOriginal ? <IconVolume size={20} /> : <IconPlayerPlayFilled size={20} />}
                                    variant="filled"
                                    color="green"
                                    size='lg'
                                >
                                    {isPlayingOriginal ? 'Playing Original...' : 'Play Original'}
                                </Button>
                                <Button
                                    onClick={handlePlay}
                                    disabled={isPlaying}
                                    rightSection={isPlaying ? <IconVolume size={20} /> : <IconPlayerPlayFilled size={20} />}
                                    color="indigo"
                                    size='lg'
                                >
                                    {isPlaying ? 'Playing Effect...' : 'Play with Effect'}
                                </Button>
                                <Button
                                    onClick={stopCurrentSound}
                                    variant="filled"
                                    color="rgba(255, 18, 18, 1)"
                                    size='lg'
                                    rightSection={!isPlaying && !isPlayingOriginal ? <IconPlayerPauseFilled size={20} /> : <IconPlayerPause size={20} />}
                                >
                                    {"Pause"}
                                </Button>
                            </Group>
                            <Group position='apart' justify='flex-start' align='center'>
                                <ActionIcon
                                    onClick={handleBackToSetup}
                                    color="Grey"
                                    variant="filled"
                                    size='xl'
                                >
                                    <IconSettings size={30} />
                                </ActionIcon>
                                <Switch
                                    label="Show Waveform"
                                    checked={showWaveform}
                                    onChange={() => setShowWaveform(!showWaveform)}
                                    color="green"
                                    size="md"
                                >
                                </Switch>
                                <Text size="xs" mt={4} c="dimmed">
                                    {currentPan}
                                </Text>
                            </Group>
                        </Stack>
                    </Group>

                    <RingProgress
                        size={140}
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
                <div className="panning-exercise">
                    <div className="header">
                        <div ></div>
                        <div className="score"><Text fw={700} size="lg" mt={4}>SCORE: {score.total} / {MAX_SCORE}</Text>  </div>
                    </div>

                    <div
                        className="panning-container"
                        onClick={userGuess === null ? handlePanningGuess : undefined}
                        onMouseMove={userGuess === null ? handleMouseMove : undefined}
                        onMouseLeave={handleMouseLeave}
                    >
                        {[...Array(19)].map((_, index) => (
                            <div key={index} className="grid-line">
                                <div className="grid-value">{((index / 18) * 2 - 1).toFixed(1)}</div>
                            </div>
                        ))}

                        {userGuess !== null && (
                            <>
                                <div
                                    className="guess-range"
                                    style={{
                                        position: 'absolute',
                                        left: `${((userGuess - RANGE_WIDTH + 1) / 2) * 100}%`,
                                        width: `${RANGE_WIDTH * 100}%`,
                                        height: '100%',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        pointerEvents: 'none'
                                    }}
                                />
                                <div
                                    className="guess-marker"
                                    style={{ left: `${((userGuess + 1) / 2) * 100}%` }}
                                >
                                    {userGuess.toFixed(3)}
                                </div>
                            </>
                        )}

                        {showAnswer && (
                            <>
                                <div
                                    className="answer-marker"
                                    style={{
                                        left: `${((currentPan + 1) / 2) * 100}%`,
                                        backgroundColor: correct ? 'rgba(48, 254, 32, 1)' : "red"
                                    }}
                                >
                                    {currentPan.toFixed(3)}
                                </div>
                            </>
                        )}

                        {hoverPosition !== null && userGuess === null && score.total < MAX_SCORE && (
                            <>
                                <div
                                    className="guess-range"
                                    style={{
                                        position: 'absolute',
                                        left: `${((hoverPosition - RANGE_WIDTH + 1) / 2) * 100}%`,
                                        width: `${RANGE_WIDTH * 100}%`,
                                        height: '100%',
                                        backgroundColor: 'rgba(180, 180, 180, 0.2)',
                                        pointerEvents: 'none'
                                    }}
                                />
                                <div
                                    className="hover-marker"
                                    style={{
                                        left: `${((hoverPosition + 1) / 2) * 100}%`
                                    }}
                                    title={hoverPosition.toFixed(3)}
                                >
                                </div>
                            </>
                        )}
                    </div>

                    <div className="panning-labels">
                        <span>LEFT</span>
                        <span>RIGHT</span>
                    </div>
                </div>
            </Stack>
            <Space h="xl" />
            <Stack align='stretch'>

                {showWaveform && (
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

                {showAnswer && (
                    <Alert
                        color={correct ? "green" : "red"}
                        title={<Text fw={700} size="lg">{correct ? "Correct!" : "Not quite!"}</Text>}
                    >
                        <Text fw={500} size="md" mt={4}>
                            {!correct &&
                                ` The sound was panned to ${currentPan}.`}
                        </Text>
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
                    onClick={score.total < MAX_SCORE ? generateNewPanning : startOver}
                    disabled={!showAnswer}
                    rightSection={score.total >= MAX_SCORE ? <IconRefresh size={20} /> : <IconArrowRight size={20} />}
                    variant={score.total < MAX_SCORE ? "light" : "filled"}
                    fullWidth
                >
                    {score.total >= MAX_SCORE ? "Start Over" : "Next Stage"}
                </Button>

            </Stack>
        </Container>
    );
}