import React from 'react';
import '@mantine/core/styles.css'
import { Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import Dashboard from './pages/dashboard/Dashboard';
import SoundExercise from './pages/sound-exercise/SoundExercise';
import SynthExercise from './pages/synth-exercise/SynthExercise';
import AmplitudeExercise from './pages/sound-exercise/AmplitudeExercise';
import EQExercise from './pages/synth-exercise/EQExercise';

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
      path: '/SoundQ1',
      element: <SoundExercise />
    },
    {
      path: '/SoundQ2',
      element: <AmplitudeExercise />
    },
    {
      path: '/SoundQ3',
      element: <SoundExercise />
    },
    {
      path: '/SynthQ1',
      element: <EQExercise />
    },
    {
      path: '/SynthQ2',
      element: <SynthExercise />
    },
    {
      path: '/SynthQ3',
      element: <SynthExercise />
    },
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