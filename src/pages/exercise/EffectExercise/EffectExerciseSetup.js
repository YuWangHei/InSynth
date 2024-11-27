import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Frame from '../../Frame';
import {
    Title,
    Button,
    Text,
    Container,
    Stack,
    Select,
    Card
} from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';

export default function EffectExerciseSetup() {
    const [difficulty, setDifficulty] = useState('Easy');
    const [maxQuestions, setMaxQuestions] = useState(10);
    const navigate = useNavigate();

    const handleStartExercise = () => {
        navigate('/EffectExercise/play', { 
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
                    <Title order={1} align='center'>Effect Exercise Setup</Title>
                    
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
                                description="Choose how subtle the effect will be"
                                value={difficulty}
                                onChange={setDifficulty}
                                allowDeselect={false}
                                data={[
                                    { value: 'Easy', label: 'Easy (More Obvious Effects)' },
                                    { value: 'Hard', label: 'Hard (Subtle Effects)' }
                                ]}
                            />

                            <Select
                                label="Number of Questions"
                                description="Select how many effect challenges you want to complete"
                                value={maxQuestions.toString()}
                                onChange={(value) => setMaxQuestions(Number(value))}
                                allowDeselect={false}
                                data={[
                                    { value: '10', label: '10 Questions' },
                                    { value: '15', label: '15 Questions' },
                                    { value: '20', label: '20 Questions' }
                                ]}
                            />

                            <Button 
                                onClick={handleStartExercise}
                                fullWidth 
                                mt="md" 
                                rightSection={<IconArrowRight size={20} />}
                                color="green"
                            >
                                Start Effect Exercise
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
                            • Listen to the original and effected audio<br />
                            • Guess which audio effect was applied<br />
                            • Try to identify the effect by ear
                        </Text>
                    </Card>
                </Stack>
            </Container>
        </Frame>
    );
}