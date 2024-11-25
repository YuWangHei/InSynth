import React from 'react';
import { MantineProvider, Switch } from '@mantine/core';
import '@mantine/core/styles.css'
import { createBrowserRouter, createHashRouter, HashRouter, Route, RouterProvider, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import Dashboard from './pages/dashboard/Dashboard';
import SoundExercise from './pages/sound-exercise/SoundExercise';
import SynthExercise from './pages/synth-exercise/SynthExercise';
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
      element: <SynthExercise />
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
