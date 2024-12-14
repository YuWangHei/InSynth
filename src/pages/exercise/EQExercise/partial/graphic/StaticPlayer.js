import { CustomEQFilter } from "./utilsGraphic";
import GeneralPlayer from "../shared/GeneralPlayer";

// audioIdentity: what audio is currently playing, in StaticPlayer, it is just a direct pass to notify the subsequent program)
// filters: expect fixed number of filters, i.e. no adding or removing filters after initialization
function StaticPlayer({ audioFile, filters, onChange, trigger }) {
  // Set the parameters of the given filterNode
  // Note: gain is percentage change in amplitude (from -1 to 1), which can be +ve or -ve
  const applyFilter = (filterNode, audioContextRef, obj = new CustomEQFilter('peaking', 62, 1, 0)) => {
    filterNode.type = obj.type;
    filterNode.frequency.setValueAtTime(obj.freq, audioContextRef.current.currentTime);
    // gain received is the percentage change, translate percentage to dB
    // If percentage change is -100%, set to valid value to prevent infinity
    let newQ = obj.q;
    let newGain = obj.gain;
    if (obj.gain === -1) {
      newGain = -0.99;
    }
    // If percentage change is negative, set q to compensate bandwidth
    if (obj.gain < 0) {
      newQ = Math.pow(-newGain * 2, -newGain);
    }
    // dB = 20 * log(A), where A is the percentage change
    const dBGain = 20 * Math.log10(1 + newGain);
    filterNode.gain.setValueAtTime(dBGain, audioContextRef.current.currentTime);
    filterNode.Q.setValueAtTime(newQ, audioContextRef.current.currentTime);
  };

  const props = { audioFile: audioFile, filters: filters, onChange: onChange, trigger: trigger };

  return (
    <GeneralPlayer applyFilter={applyFilter} props={props} />
  )
}

export default StaticPlayer;