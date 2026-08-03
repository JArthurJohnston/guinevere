import { EXAMPLES } from "../abc/examples";
import { useABC } from "../context/abcContext";
import { BasicSelect } from "./primitives/BasicSelect";

export function TuneSelect() {
  const { abc, updateTune } = useABC();
  return (
    <BasicSelect value={abc} onChange={updateTune} label="Select Tune">
      <optgroup label="Examples">
        {EXAMPLES.map((ex) => (
          <option key={ex.name} value={ex.abc}>
            {ex.name}
          </option>
        ))}
      </optgroup>
    </BasicSelect>
  );
}
