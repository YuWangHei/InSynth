import React from 'react';
import '@mantine/core/styles.css'
import { Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import Dashboard from './pages/dashboard/Dashboard';
import SoundExercise from './pages/sound-exercise/SoundExercise';
import EffectExercise from './pages/sound-exercise/EffectExercise';
import SynthExercise from './pages/synth-exercise/SynthExercise';
import AmplitudeExercise from './pages/sound-exercise/AmplitudeExercise';
import EQExercise from './pages/synth-exercise/EQExercise';
import AmplitudeExercise from './pages/sound-exercise/AmplitudeExercise';

function App() {
  const router = [
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/Dashboard',
      element: <Dashboard />
    },
    {
      path: '/SoundSynth',
      element: <SoundExercise />
    },
    {
      path: '/SoundQ2',
      element: <AmplitudeExercise />
    },
    {
      path: '/SoundEffect',
      element: <EffectExercise />
    },
    {
      path: '/MixingEq',
      element: <EQExercise />
    },
    {
      path: '/SynthQ2',
      element: <SynthExercise />
    },
    {
      path: '/SoundAmplitude',
      element: <AmplitudeExercise />
    }
  ];

  return (
    <Routes>
      {router.map(item => {
        return (
          <Route path={item.path} element={item.element} />
        )
      })}
    </Routes>
  );
}

export default App;
