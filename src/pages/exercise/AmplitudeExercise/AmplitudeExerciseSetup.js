import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Stack, Select, Card, Title, Text } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import Frame from '../../Frame';

function AmplitudeExerciseSetup() {
    const [difficulty, setDifficulty] = useState('Easy');
    const [maxQuestions, setMaxQuestions] = useState(3);
    const navigate = useNavigate();

    const handleStartExercise = () => {
        navigate('/AmplitudeExercise/play', {
            state: {
                difficulty,
                maxQuestions
            }
        });
    };

    return (
        <Frame>
            <Container size="sm" px="md">
                <Stack spacing="lg" align='center'>
                    <Title order={1} align='center'>Amplitude Exercise Setup</Title>

                    <Card
                        shadow="sm"
                        padding="lg"
                        radius="md"
                        withBorder
                        style={{ width: '100%' }}
                    >
                        <Stack>
                            <Select
                                label="Difficulty"
                                description="Choose how large the difference of the options"
                                value={difficulty}
                                onChange={setDifficulty}
                                data={[
                                    { value: 'Easy', label: 'Easy (Larger Difference)' },
                                    { value: 'Hard', label: 'Hard (Smaller Difference)' }
                                ]}
                            />

                            <Select
                                label="Number of Questions"
                                description="Select how many questions you want to complete"
                                value={maxQuestions.toString()}
                                onChange={(value) => setMaxQuestions(Number(value))}
                                data={[
                                    { value: '3', label: '3 Questions' },
                                    { value: '5', label: '5 Questions' },
                                    { value: '10', label: '10 Questions' }
                                ]}
                            />

                            <Button
                                onClick={handleStartExercise}
                                fullWidth
                                mt="md"
                                rightSection={<IconArrowRight size={20} />}
                                color="green"
                            >
                                Start Amplitude Exercise
                            </Button>
                        </Stack>
                    </Card>

                    <Card
                        shadow="sm"
                        padding="lg"
                        radius="md"
                        withBorder
                        style={{ width: '100%' }}
                    >
                        <Title order={4} mb="md">Exercise Instructions</Title>
                        <Text>
                            • Listen to the original and panned audio<br />
                            • Click on the panning container to guess the pan position<br />
                            • Get points for guesses within the selected difficulty range
                        </Text>
                    </Card>
                </Stack>
            </Container>
        </Frame>
    );
}

export default AmplitudeExerciseSetup;