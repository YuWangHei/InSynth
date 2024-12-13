import React, { useEffect } from 'react';
import { Container, Group, Progress, Stack, Text, Tooltip } from '@mantine/core';
// import { Tooltip } from 'recharts';

function Dashboard() {
  
  const createCookie = (name) => {
    const data = {totalEx: 0, totalQ: 0, correct: 0, wrong: 0};
    document.cookie = `${name}=${JSON.stringify(data)};`;
    return data;
  }

  const retrieveCookie = (name) => {
    console.log(name);
    console.log(document.cookie);
    const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
    
    console.log(cookieValue);
    const data = (cookieValue) ? JSON.parse(cookieValue) : createCookie(name);
    // const data = ;
    console.log(data);
    return data;
  }
  // const exercises = ["SoundSynth"];
  // const exercises = ["SoundSynth", "EffectEx"];
  const exercises = ["SoundSynth", "EffectEx", "EQEX", "AmplitudeEx", "PanningEx"];
  const data = exercises.map(retrieveCookie);
  const exName = ["Sound Synthesis", "Effect Exercise", "EQ Exercise", "Amplitude Exercise", "Panning Exercise"]
  const progresses = [];
  for (let i = 0; i < data.length; i++) {
    console.log('ha', i); 
    console.log(data[i].correct);
    const correctPercent = Math.round(data[i].correct/data[i].totalQ*100);
    console.log(correctPercent);
    progresses.push(
      <Text size="lg">{exName[i]}</Text>
    );
    if (data[i].totalEx)
    {
      progresses.push(data[i].totalEx &&
        <Container w={900}>
          <Group position="apart" style={{ marginBottom: '10px' }}>
            <Text>Total exercises done: {data[i].totalEx}</Text>
            <Text>Total questions done: {data[i].totalQ}</Text>
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
        <Text> You haven't done any exercise.</Text>
      );
    }
    progresses.push(
      <br></br>
    )
  }
  // useEffect(() => {
  //   // if (!retrieveCookie()) {
  //   //   createCookie();
  //   // }
  //   // retrieveCookie();
  //   createCookie();
  // }, []);

  return (
    <Container>
        <h1>Your Journey into InSynth</h1>
        <tbody>
          {progresses}
        </tbody>
        {/* <Progress.Root size="xl">
          <Progress.Section value={30} color="green">
            <Progress.Label>Correct</Progress.Label>
          </Progress.Section>
          <Progress.Section value={70} color="red">
            <Progress.Label>Wrong</Progress.Label>
          </Progress.Section>
        </Progress.Root> */}
    </Container>
  );
}

export default Dashboard;