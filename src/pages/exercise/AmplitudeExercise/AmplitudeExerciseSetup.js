import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SetupPage from '../../../components/SetupPage';

function AmplitudeExerciseSetup() {
    const [difficulty, setDifficulty] = useState('Easy');
    const [maxQuestions, setMaxQuestions] = useState('3');
    const navigate = useNavigate();

    const handleStartExercise = () => {
        navigate('/AmplitudeExercise/play', {
            state: {
                difficulty,
                maxQuestions
            }
        });
    };

    const options = [
        {
            label: 'Difficulty',
            description: 'Choose how subtle the difference of options will be',
            state: difficulty,
            setState: setDifficulty,
            data: [
                { value: 'Easy', label: 'Easy (Larger Difference)' },
                { value: 'Hard', label: 'Hard (Smaller Difference)' }
            ]
        },
        {
            label: 'Number of Questions',
            description: 'Select how many questions you want to complete',
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
        'Listen to the original and amplified audio',
        'Guess how much decibels the audio is amplified by',
        'Get points for correct guesses',
    ]

    return (
        <SetupPage
            name="Amplitude Exercise"
            options={options}
            instr={instr}
            handleStartExercise={handleStartExercise}
        />
    )

    /*
    return (
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
                        • Listen to the original and amplified audio<br />
                        • Guess how much decibels the audio is amplified by<br />
                        • Get points for correct guesses
                    </Text>
                </Card>
            </Stack>
        </Container>
    );
    */
}

export default AmplitudeExerciseSetup;