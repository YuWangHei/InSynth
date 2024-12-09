import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Select, Stack, Text, Title } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import CustomContainer from "../../../components/CustomContainer";
import { getRandomAudio } from "../../../Music/AudioPicker";

function EQExerciseSetup() {
  const [mode, setMode] = useState('Graphic'); // Graphic or Parametric
  const [filterCount, setFilterCount] = useState('1')
  const [qCount, setQCount] = useState('3');
  const navigate = useNavigate();

  const handleStartExercise = () => {
    // Get random audio
    // Graphic EQ
    if (mode === 'Graphic') {
      navigate('/EQExercise/graphic', {
        state: {
          qCount
        }
      });
      return;
    }
    // Parametric EQ
    navigate('/EQExercise/parametric', {
      state: {
        filterCount,
        qCount
      }
    });
  }

  const instr = [
    'Listen to the original and equalized audio',
    'Reconstruct the filters applied by the equalized audio',
    'Try to identify the changes in different frequency ranges'
  ]

  return (
    <CustomContainer size="sm" title="EQ Exercise Setup">
      {/* Upper Box: Select Settings */}
      <Card shadow="sm" padding="lg" radius="md" style={{ width: '100%' }}>
        <Stack>
          <Select
            label="Mode"
            description="Choose to play Graphic or Parametric EQ Exercise"
            value={mode}
            onChange={setMode}
            allowDeselect={false}
            data={[
              { value: "Graphic", label: "Graphic EQ" },
              { value: "Parametric", label: "Parametric EQ" }
            ]}
          />
          {mode === 'Parametric' && <Select
            label="Number of Filters"
            description="Select how many filters you have to reconstruct"
            value={filterCount}
            onChange={setFilterCount}
            allowDeselect={false}
            data={[
              { value: "1", label: "1 Filter" },
              { value: "2", label: "2 Filters" },
              { value: "3", label: "3 Filters" },
              { value: "4", label: "4 Filters" },
              { value: "5", label: "5 Filters" },
            ]}
          />}
          <Select
            label="Number of Questions"
            description="Select how many EQ questions you want to complete"
            value={qCount}
            onChange={setQCount}
            allowDeselect={false}
            data={[
              { value: "3", label: "3 Questions" },
              { value: "5", label: "5 Questions" },
              { value: "10", label: "10 Questions" }
            ]}
          />
          <Button
            onClick={handleStartExercise}
            fullWidth
            mt="md"
            rightSection={<IconArrowRight size={20} />}
            color="green"
          >
            Start EQ Exercise
          </Button>
        </Stack>
      </Card>
      {/* Lower Box: Instructions */}
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: '100%' }}>
        <Title order={4} mb="md">Exercise Instructions</Title>
        {instr.map((str) => {
          return (
            <Text>• {str}</Text>
          )
        })}
      </Card>
    </CustomContainer>
  )
}

export default EQExerciseSetup;