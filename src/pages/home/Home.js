import React from 'react';
import Frame from '../Frame';
import { useNavigate } from 'react-router-dom';
import { BackgroundImage, Text, Container } from '@mantine/core';
import styles from './Home.module.css';
import homebg from './homebg3Blurred.png';
import homebg2 from './homebg5.jpeg';

function Home() {
  const navigate = useNavigate();

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
      path: '/MixingEq',
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
      <Frame>
        <BackgroundImage
          src={homebg2}
          h={200}
        >
          <Container size="lg" h="100%" style={{ position: 'relative', zIndex: 1 }} px={2} justify="flex-end">
            <Text size="xl" fw={700} c="#FFFFFF" pt={60}>
              Audio Learning Platform
            </Text>
            <Text size="xl"  c="#FFFFFF" mt="sm">
              Master the fundamentals of audio processing and mixing
            </Text>
          </Container>
        </BackgroundImage>

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

        
      </Frame>
    </BackgroundImage>
  );
}

export default Home;