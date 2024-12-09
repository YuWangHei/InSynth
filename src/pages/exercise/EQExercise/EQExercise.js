import { useEffect, useState } from "react";
import EQGraphic from "./EQGraphic";
import EQMenu from "./partial/EQMenu";
import EQParametric from "./partial/EQParametric";
import { getRandomAudio } from "../../../Music/AudioPicker";
import { Container } from "@mantine/core";

function EQExercise() {
  const [inMenu, setInMenu] = useState(true);
  const [inQMode, setInQMode] = useState(true); // true for Mode 1, false for Mode 2, for the ease of arrangement of components

  // On Mode 1 or Mode 2 being selected
  const onSelect = (mode) => {
    // Set page to be displayed
    setInMenu(false);
    setInQMode(mode);
  }

  return (
    <Container>
      {inMenu ?
        <EQMenu onSelect={onSelect} /> :
        inQMode ?
          <EQGraphic /> :
          <EQParametric />
      }
    </Container>
  )
}

export default EQExercise;