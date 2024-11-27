import {audio1, audio2, audio3, audio4} from '../Music';

const audioFiles = [audio1, audio2, audio3, audio4];

const getRandomAudio = () => {
    const randomIndex = Math.floor(Math.random() * audioFiles.length);
    return audioFiles[randomIndex]; 
  };

export { getRandomAudio };