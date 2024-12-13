import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SetupPage from '../../../components/SetupPage';

export default function EffectExerciseSetup() {
    const [difficulty, setDifficulty] = useState('Easy');
    const [maxQuestions, setMaxQuestions] = useState('3');
    const navigate = useNavigate();

    const handleStartExercise = () => {
        navigate('/EffectExercise/play', {
            state: {
                difficulty,
                maxQuestions
            }
        });
    };

    const options = [
        {
            label: 'Difficulty',
            description: 'Choose how subtle the effect will be',
            state: difficulty,
            setState: setDifficulty,
            data: [
                { value: 'Easy', label: 'Easy (More Obvious Effects)' },
                { value: 'Hard', label: 'Hard (Subtle Effects)' },
            ]
        },
        {
            label: 'Number of Questions',
            description: 'Select how many effect challenges you want to complete',
            state: maxQuestions,
            setState: setMaxQuestions,
            data: [
                { value: '3', label: '3 Questions' },
                { value: '5', label: '5 Questions' },
                { value: '10', label: '10 Questions' }
            ]
        }
    ];

    const instr = [
        'Listen to the original and effected audio',
        'Guess which audio effect was applied',
        'Try to identify the effect by ear',
    ];

    return (
        <SetupPage
            name="Effect Exercise"
            options={options}
            instr={instr}
            handleStartExercise={handleStartExercise}
        />
    )

    /*
    return (
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
    );
    */
}