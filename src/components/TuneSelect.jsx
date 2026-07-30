import { EXAMPLES } from "../abc/examples";
import { BasicSelect } from "./primitives/BasicSelect";

export function TuneSelect({ value, onChange }) {
  return (
    <BasicSelect value={value} onChange={onChange} label="Select Tune">
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