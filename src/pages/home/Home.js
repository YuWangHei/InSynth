import React from 'react';
import Frame from '../Frame';
import { useNavigate } from 'react-router-dom';
import { BackgroundImage, Overlay, Text, Container } from '@mantine/core';
import styles from './Home.module.css';
import homebg from './homebg2.jpg';

function Home() {
  const navigate = useNavigate();

  const synthExercises = [
    {
      title: 'Sound Synthesis',
      description: 'Learn about waveforms and their tones',
      path: '/SoundSynth',
      icon: '🔊' // Optional: you can use an icon or image
    },
    {
      title: 'Effect Exercise',
      description: 'Learn about different effects and how they work',
      path: '/SoundEffect',
      icon: '🎵'
    }
  ];

  const mixingExercises = [
    {
      title: 'Equalizer Exercise',
      description: 'Learn about equalizer and how it works',
      path: '/MixingEq',
      icon: '🔊' // Optional: you can use an icon or image
    },
    {
      title: 'Amplitude Exercise',
      description: 'Learn about amplitude and how it works',
      path: '/AmplitudeExercise/setup',
      icon: '🎵'
    },
    {
      title: 'Panning Exercise',
      description: 'Learn about panning and how it works',
      path: '/AmplitudeExercise/setup',
      icon: '🎵'
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
          // src={homebg}
          h={200}
        >
          <Container size="lg" h="100%" style={{ position: 'relative', zIndex: 1 }} className={styles.hoverContainer}>
            <Text size="xl" fw={700} c="#CDFF33" pt={60}>
              Audio Learning Platform
            </Text>
            <Text size="xl" c="#CDFF33" mt="sm">
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