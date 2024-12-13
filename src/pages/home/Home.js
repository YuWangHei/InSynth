import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackgroundImage, Text, Container } from '@mantine/core';
import styles from './Home.module.css';
import homebg from './homebg3Blurred.png';
import homebg2 from './homebg5.jpeg';

function Home() {
  const navigate = useNavigate();

  // const exercises = ["SoundSynth", "EffectEx", "EQEX", "AmplitudeEx", "PanningEx"];
  // const createCookie = () => {
  //   const data = {totalEx: 0, totalQ: 0, correct: 0, wrong: 0};
  //   for (let i = 0; i < exercises.length; i++) {
  //     document.cookie = `${exercises[i]}=${JSON.stringify(data)};`; 
  //   } 
  // }

  // const checkCookie = () => {
  //   for (let i = 0; i < exercises.length; i++) {
  //     const cookie = document.cookie
  //     .split("; ")
  //     .find((row) => row.startsWith(`${exercises[i]}=`));
  //     if (!cookie) {
  //       return false;
  //     }
  //   }
  //   return true
  // }

  // useEffect(() => {
  //   if (!checkCookie()) {
  //     createCookie();
  //   }
  // }, [])

  const synthExercises = [
    {
      title: 'Sound Synthesis',
      description: 'Get familiar with waveforms and their tones',
      path: '/SoundSynth',
      icon: '🔊' // Optional: you can use an icon or image
    },
    {
      title: 'Effect Exercise',
      description: 'Take a look at popular effects of manipulating audio',
      path: '/EffectExercise/setup',
      icon: '🎵'
    }
  ];

  const mixingExercises = [
    {
      title: 'Equalizer Exercise',
      description: 'Learn about equalizer and how it works',
      path: '/EQExercise/setup',
      icon: '💿' // Optional: you can use an icon or image
    },
    {
      title: 'Amplitude Exercise',
      description: 'Have a feel of different amplitudes of audio',
      path: '/AmplitudeExercise/setup',
      icon: '🎶'
    },
    {
      title: 'Panning Exercise',
      description: 'Train your ears and spatial awareness',
      path: '/PanningExercise/setup',
      icon: '🎧'
    }
  ];

  return (
    <BackgroundImage
      src={homebg}
      // radius="lg"
      style={{ minHeight: '100vh' }}
    >
      {/* <Overlay
      gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
      opacity={1}
      zIndex={0}
    /> */}
      <BackgroundImage
        src={homebg2}
        h={200}
      >
      </BackgroundImage>
      <Container size="lg" h="100%" style={{ position: 'relative', zIndex: 1 }} px={2} justify="flex-end">
        <Text size="xl" fw={700} c="#FFFFFF" pt={60}>
          Audio Learning & Training Platform
        </Text>
        <Text size="xl" c="#FFFFFF" mt="sm">
          Master the fundamentals of audio processing and mixing
        </Text>
      </Container>
      <div className={styles.cardContainer}>
        <h1>Playground Portal</h1>
        <div className={styles.cardGrid}>
          <div
            key="playground"
            className={styles.card}
            onClick={() => navigate('/Playground')}
          >
            <div className={styles.cardIcon}>🎮</div>
            <h2>Playground</h2>
            <p>Explore and experiment with audio processing tools</p>
          </div>
        </div>
      </div>
      <div className={styles.cardContainer}>
        <h1>Synth Exercises</h1>
        <div className={styles.cardGrid}>
          {synthExercises.map((exercise) => (
            <div
              key={exercise.path}
              className={styles.card}
              onClick={() => navigate(exercise.path)}
            >
              <div className={styles.cardIcon}>{exercise.icon}</div>
              <h2>{exercise.title}</h2>
              <p>{exercise.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.cardContainer}>
        <h1>Mixing Exercises</h1>
        <div className={styles.cardGrid}>
          {mixingExercises.map((exercise) => (
            <div
              key={exercise.path}
              className={styles.card}
              onClick={() => navigate(exercise.path)}
            >
              <div className={styles.cardIcon}>{exercise.icon}</div>
              <h2>{exercise.title}</h2>
              <p>{exercise.description}</p>
            </div>
          ))}
        </div>
      </div>
    </BackgroundImage>
  );
}

export default Home;