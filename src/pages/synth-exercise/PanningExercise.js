import React, { useState, useEffect, useRef } from 'react';
import Frame from '../Frame';
import {
    Title,
    Button,
    Group,
    Text,
    Container,
    Stack
  } from '@mantine/core';
import './PanningExercise.css';
import { audio1, audio2 } from '../../Music';

export default function PanningExercise() {
    const [score, setScore] = useState(0);
    const [currentPan, setCurrentPan] = useState(0);
    const [userGuess, setUserGuess] = useState(null);
    const [stage, setStage] = useState(1);
    const [hoverPosition, setHoverPosition] = useState(null); // Add this line
    const audioContext = useRef(null);
    const audioSource = useRef(null);
    const panNode = useRef(null);
  

  useEffect(() => {
    // Initialize Web Audio API
    audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    panNode.current = audioContext.current.createStereoPanner();
    panNode.current.connect(audioContext.current.destination);
  }, []);

  const generateNewPanning = () => {
    // Generate random pan value between -1 (left) and 1 (right)
    const newPan = Math.round((Math.random() * 2 - 1) * 100) / 100;
    setCurrentPan(newPan);
    if (panNode.current) {
      panNode.current.pan.value = newPan;
    }
  };

  const handlePanningGuess = (event) => {
    const container = event.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;
    
    // Convert click position to pan value (-1 to 1)
    const panValue = (x / width) * 2 - 1;
    setUserGuess(panValue);
    
    // Calculate score based on accuracy
    const accuracy = Math.abs(panValue - currentPan);
    const pointsEarned = Math.max(0, Math.floor((1 - accuracy) * 100));
    setScore(prevScore => prevScore + pointsEarned);
    
    // Move to next stage
    setStage(prevStage => (prevStage % 3) + 1);
    generateNewPanning();
  };

  const handleMouseMove = (event) => {
    const container = event.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;
    const panValue = (x / width) * 2 - 1;
    setHoverPosition(panValue);
  };

  const handleMouseLeave = () => {
    setHoverPosition(null);
  };

  return (
    <Frame>
      <Container size="md" px="md">
        <Stack spacing="lg">
          <Title order={1} align='center'>Panning Exercise</Title>
          <div className="panning-exercise">
            <div className="header">
              <div className="score">SCORE: {score}</div>
              <div className="stage">STAGE: {stage} / 3</div>
            </div>

            <div 
              className="panning-container" 
              onClick={handlePanningGuess}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {[...Array(19)].map((_, index) => (
                <div key={index} className="grid-line">
                  <div className="grid-value">{((index / 18) * 2 - 1).toFixed(1)}</div>
                </div>
              ))}

              {hoverPosition !== null && (
                <div 
                  className="hover-marker"
                  style={{ left: `${((hoverPosition + 1) / 2) * 100}%` }}
                >
                  {hoverPosition.toFixed(3)}
                </div>
              )}

              {userGuess !== null && (
                <div 
                  className="guess-marker"
                  style={{ left: `${((userGuess + 1) / 2) * 100}%` }}
                >
                  {userGuess.toFixed(3)}
                </div>
              )}
            </div>

            <div className="panning-labels">
              <span>LEFT</span>
              <span>RIGHT</span>
            </div>
          </div>
        </Stack>
      </Container>
    </Frame>
  );
}
