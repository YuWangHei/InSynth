import React from 'react';
import '@mantine/core/styles.css'
import { Route, Routes } from 'react-router-dom';
import Frame from './pages/Frame.js';
import Home from './pages/home/Home';
import Dashboard from './pages/dashboard/Dashboard';
import SoundExercise from './pages/exercise/SoundExercise/SoundExercise.js';
import EffectExercise from './pages/exercise/EffectExercise/EffectExercise.js';
import EffectExerciseSetup from './pages/exercise/EffectExercise/EffectExerciseSetup.js';
import SynthExercise from './pages/exercise/EQExercise/SynthExercise.js';
import AmplitudeExercise from './pages/exercise/AmplitudeExercise/AmplitudeExercise.js';
import AmplitudeExerciseSetup from './pages/exercise/AmplitudeExercise/AmplitudeExerciseSetup.js';
import EQExercise from './pages/exercise/EQExercise/EQExercise.js';
import PanningExercise from './pages/exercise/PanningExercise/PanningExercise.js';
import PanningExerciseSetup from './pages/exercise/PanningExercise/PanningExerciseSetup.js';
import Playground from './pages/playground/Playground.js';

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
      path: '/Playground',
      element: <Playground />
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
      path: '/EffectExercise/setup',
      element: <EffectExerciseSetup />
    },
    {
      path: '/EffectExercise/play',
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
    <Frame>
      <Routes>
        {router.map((item, idx) => {
          return (
            <Route path={item.path} element={item.element} key={idx} />
          )
        })}
      </Routes>
    </Frame>
  );
}

export default App;
