import React from 'react';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/home/Home';
import Dashboard from './pages/dashboard/Dashboard';
import SoundExercise from './pages/sound-exercise/SoundExercise';
import SynthExercise from './pages/synth-exercise/SynthExercise';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/Dashboard',
      element: <Dashboard />
    },
    {
      path: '/SoundExercise',
      element: <SoundExercise />
    },
    {
      path: '/SynthExercise',
      element: <SynthExercise />
    }
  ]);

  return (
    <React.StrictMode>
      <MantineProvider>
        <RouterProvider router={router} />
      </MantineProvider>
    </React.StrictMode>
  );
}

export default App;
