import {audio1, audio2} from '../Music';

const audioFiles = [audio1, audio2];

const getRandomAudio = () => {
    const randomIndex = Math.floor(Math.random() * audioFiles.length);
    return audioFiles[randomIndex]; 
  };

export { getRandomAudio };