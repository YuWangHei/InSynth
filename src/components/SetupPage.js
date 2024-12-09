import { Button, Card, Select, Stack, Text, Title } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import CustomContainer from "./CustomContainer";

// name: name of the exercise, e.g. Effect Exercise
// options: array of objects in form of {label: string, description: string, state: useState[0], setState: useState[1], data: [{ value: string, label: string }, ...] }
// instr: array of string to be filled in Exercise Instruction
// handleStartExercise: the callback function to be called on button press
function SetupPage({ name, options = [], instr = [], handleStartExercise }) {
  return (
    <CustomContainer size="sm" title={`${name} Setup`}>
      {/* Upper Box: Select Settings */}
      <Card shadow="sm" padding="lg" radius="md" style={{ width: '100%' }}>
        <Stack>
          {options.map((obj, idx) => {
            return (
              <Select
                key={`${name}_setup_select_${idx}`}
                label={obj.label}
                description={obj.description}
                value={obj.state}
                onChange={obj.setState}
                allowDeselect={false}
                data={
                  obj.data.map((obj_data) => {
                    return { value: obj_data.value, label: obj_data.label };
                  })
                }
              />
            )
          })}
          <Button
            onClick={handleStartExercise}
            fullWidth
            mt="md"
            rightSection={<IconArrowRight size={20} />}
            color="green"
          >
            Start {name}
          </Button>
        </Stack>
      </Card>
      {/* Lower Box: Instructions */}
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: '100%' }}>
        <Title order={4} mb="md">Exercise Instructions</Title>
        {instr.map((str, idx) => {
          return (
            <Text key={`${name}-instr-${idx}`}>• {str}</Text>
          )
        })}
      </Card>
    </CustomContainer>
  )
}

export default SetupPage;