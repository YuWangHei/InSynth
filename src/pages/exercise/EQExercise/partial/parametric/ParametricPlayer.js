import GeneralPlayer from "../shared/GeneralPlayer";
import { CustomEQFilter } from "./utilsParametric";


function ParametricPlayer({ audioFile, filters, onChange, trigger }) {
  // Set the parameters of the given filterNode
  const applyFilter = (filterNode, audioContextRef, obj = new CustomEQFilter('peaking', 62, 1, 0)) => {
    filterNode.type = obj.type;
    filterNode.frequency.setValueAtTime(obj.freq, audioContextRef.current.currentTime);
    filterNode.Q.setValueAtTime(obj.q, audioContextRef.current.currentTime);
    filterNode.gain.setValueAtTime(obj.gain, audioContextRef.current.currentTime);
    filterNode.Q.setValueAtTime(obj.q, audioContextRef.current.currentTime);
  }

  const props = { audioFile: audioFile, filters: filters, onChange: onChange, trigger: trigger };

  return (
    <GeneralPlayer props={props} />
  )
}

export default ParametricPlayer;