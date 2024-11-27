import { useEffect, useState } from "react";
import Frame from "../../Frame";
import EQStatic from "./partial/EQStatic";
import EQMenu from "./partial/EQMenu";
import EQParametric from "./partial/EQParametric";
import { getRandomAudio } from "../../../Music/AudioPicker";

function EQExercise() {
  const [inMenu, setInMenu] = useState(true);
  const [inQMode, setInQMode] = useState(true); // true for Mode 1, false for Mode 2, for the ease of arrangement of components
  const [audio, setAudio] = useState(null);

  // On any page switch, clear audio
  useEffect(() => {
    setAudio(null);
  }, [inMenu, inQMode]);

  // On Mode 1 or Mode 2 being selected
  const onSelect = (mode) => {
    // Set page to be displayed
    setInMenu(false);
    setInQMode(mode);
    // Get random audio
    const random_audio = getRandomAudio();
    setAudio(random_audio);
  }

  return (
    <Frame>
      {inMenu ?
        <EQMenu onSelect={onSelect} /> :
        inQMode ?
          <EQStatic audioFile={audio} /> :
          <EQParametric audioFile={audio} />
      }
    </Frame>
  )
}

export default EQExercise;