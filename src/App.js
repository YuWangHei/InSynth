import React from 'react';
import '@mantine/core/styles.css'
import { Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import Dashboard from './pages/dashboard/Dashboard';
import SoundExercise from './pages/exercise/SoundExercise.js';
import EffectExercise from './pages/exercise/EffectExercise.js';
import SynthExercise from './pages/exercise/SynthExercise.js';
import AmplitudeExercise from './pages/exercise/AmplitudeExercise/AmplitudeExerciseSetup.js';
import AmplitudeExerciseSetup from './pages/exercise/AmplitudeExercise/AmplitudeExerciseSetup.js';
import EQExercise from './pages/exercise/EQExercise/EQExercise.js';
import PanningExercise from './pages/exercise/PanningExercise/PanningExercise.js';
import PanningExerciseSetup from './pages/exercise/PanningExercise/PanningExerciseSetup.js';
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
      path: '/SoundQ3',
      element: <SoundExercise />
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
      path: '/AmplitudeExercise/setup',
      element: <AmplitudeExerciseSetup />
    },
    {
      path: '/AmplitudeExercise/play',
      element: <AmplitudeExercise />
    },
    {
      path: "/PanningExercise/setup",
      element: <PanningExerciseSetup />
    },
    {
      path: "/PanningExercise/play",
      element: <PanningExercise />
    }
  ];

  return (
    <Routes>
      {router.map((item, idx) => {
        return (
          <Route path={item.path} element={item.element} key={idx} />
        )
      })}
    </Routes>
  );
}

export default App;
