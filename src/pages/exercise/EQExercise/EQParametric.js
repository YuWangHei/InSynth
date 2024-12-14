import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Group, Text, Switch, Container, Stack, Title, Card, Button } from "@mantine/core";
import MathPlot from "./partial/shared/MathPlot";
import CustomContainer from "../../../components/CustomContainer";

function EQParametric({ audioFile }) {
  const location = useLocation();
  const {
    qCount = 3
  } = location.state || {};

  // Whether the user is listening to the target
  const [viewTarget, setViewTarget] = useState(false);

  const onSwitch = () => {

  }

  return (
    <Container size="md" px="md">
      <Stack spacing="lg">
        {/* Title and Subtitle */}
        <Title order={1} align="center">
          Parametric EQ Exercise
          <Text size="md" fs={700} c="dimmed">
            {qCount} Questions
          </Text>
        </Title>
        {/* Main Section */}
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Stack spacing="md" justify="flex-start">

            {/* Setting Header */}
            <Group position="apart" justify="space-between" align="center">
              <Stack>
                {/* Select to listen to synth audio or target audio */}
                <Group>
                  <Button
                    onClick={onSwitch}
                    color={viewTarget ? "green" : "rgba(255, 18, 18, 1)"}
                    size="lg"
                  >
                    {`Switch to ${viewTarget ? "Your Audio" : "Target Audio"}`}
                  </Button>
                  <Text size="lg">{`Now listening to ${viewTarget ? "Target Audio" : "Your Audio"}`}</Text>
                </Group>
                <Group>
                  <Button>

                  </Button>
                </Group>
              </Stack>
            </Group>
          </Stack>
        </Card>
      </Stack>
    </Container>
  )
}

export default EQParametric;