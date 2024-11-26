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
import PanningExercise from './pages/synth-exercise/PanningExercise/PanningExercise';
import PanningExerciseSetup from './pages/synth-exercise/PanningExercise/PanningExerciseSetup';
import AmplitudeExerciseSetup from './pages/sound-exercise/AmplitudeExerciseSetup';
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
