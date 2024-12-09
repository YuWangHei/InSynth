import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SetupPage from '../../../components/SetupPage';

// Setup Page Component
export default function PanningExerciseSetup() {
    const [difficulty, setDifficulty] = useState('Easy');
    const [maxQuestions, setMaxQuestions] = useState('3');
    const navigate = useNavigate();

    const handleStartExercise = () => {
        navigate('/PanningExercise/play', {
            state: {
                difficulty,
                maxQuestions
            }
        });
    };

    const options = [
        {
            label: 'Difficulty',
            description: 'Choose how precise your panning guess needs to be',
            state: difficulty,
            setState: setDifficulty,
            data: [
                { value: 'Easy', label: 'Easy (Wider Range)' },
                { value: 'Hard', label: 'Hard (Narrow Range)' }
            ]
        },
        {
            label: 'Number of Questions',
            description: 'Select how many panning challenges you want to complete',
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
        'Listen to the original and panned audio',
        'Click on the panning panel to guess the pan position',
        'Get points for guesses within the selected difficulty range',
    ]

    return (
        <SetupPage
            name="Panning Exercise"
            options={options}
            instr={instr}
            handleStartExercise={handleStartExercise}
        />
    )

    /*
    return (
        <Container size="sm" px="md">
            <Stack spacing="lg" align='center'>
                <Title order={1} align='center'>Panning Exercise Setup</Title>

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
                            description="Choose how precise your panning guess needs to be"
                            value={difficulty}
                            onChange={setDifficulty}
                            allowDeselect={false}
                            data={[
                                { value: 'Easy', label: 'Easy (Wider Range)' },
                                { value: 'Hard', label: 'Hard (Narrow Range)' }
                            ]}
                        />

                        <Select
                            label="Number of Questions"
                            description="Select how many panning challenges you want to complete"
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
                            Start Panning Exercise
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
                        • Click on the panning panel to guess the pan position<br />
                        • Get points for guesses within the selected difficulty range
                    </Text>
                </Card>
            </Stack>
        </Container>
    );
    */
}
