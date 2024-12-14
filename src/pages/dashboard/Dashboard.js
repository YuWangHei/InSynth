import React from 'react';
import { BackgroundImage, Container, Group, Progress, Stack, Text, Tooltip } from '@mantine/core';
import homebg from '../home/homebg3Blurred.png';

function Dashboard() {
  
  const createCookie = (name) => {
    const data = {totalEx: 0, totalQ: 0, correct: 0, wrong: 0};
    document.cookie = `${name}=${JSON.stringify(data)};`;
    return data;
  }

  const retrieveCookie = (name) => {
    const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
    
    const data = (cookieValue) ? JSON.parse(cookieValue) : createCookie(name);
    return data;
  }

  const exercises = ["SoundSynth", "EffectEx", "EQEx", "AmplitudeEx", "PanningEx"];
  const data = exercises.map(retrieveCookie);
  const exName = ["Sound Synthesis", "Effect Exercise", "EQ Exercise", "Amplitude Exercise", "Panning Exercise"]
  const progresses = [];
  for (let i = 0; i < data.length; i++) {
    const correctPercent = Math.round(data[i].correct/data[i].totalQ*100);
    progresses.push(
      <Text size="lg" c="#FFFFFF">{exName[i]}</Text>
    );
    if (data[i].totalEx)
    {
      progresses.push(data[i].totalEx &&
        <Container w={900}>
          <Group position="apart" style={{ marginBottom: '10px' }}>
            <Text c="#FFFFFF">Total exercises done: {data[i].totalEx}</Text>
            <Text c="#FFFFFF">Total questions done: {data[i].totalQ}</Text>
          </Group>
          <Progress.Root size="xl">
            <Tooltip label={`Correct - ${data[i].correct} (${correctPercent}%)`} position='left' offset={10}>
              <Progress.Section value={correctPercent} color="green">
                <Progress.Label>Correct</Progress.Label>
              </Progress.Section>
            </Tooltip>
            <Tooltip label={`Wrong - ${data[i].wrong} (${100-correctPercent}%)`} position='right' offset={10}>
              <Progress.Section value={100-correctPercent} color="red">
                <Progress.Label>Wrong</Progress.Label>
              </Progress.Section>
            </Tooltip>
          </Progress.Root>
        </Container>
      );
    }
    else
    {
      progresses.push(
        <Text c="#FFFFFF"> You haven't done any exercise.</Text>
      );
    }
    progresses.push(
      <br></br>
    )
  }

  return (
    <BackgroundImage src={homebg} style={{ minHeight: '100vh' }}>
      <Container c="#FFFFFF">
          <br></br>
          <h1>Your Journey into InSynth</h1>
          <br></br>
          <tbody>
            {progresses}
          </tbody>
      </Container>
    </BackgroundImage>
  );
}

export default Dashboard;