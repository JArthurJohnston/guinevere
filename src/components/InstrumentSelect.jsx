import { useInstrument } from "../context/instrumentContext";
import { INSTRUMENT_GROUPS } from "../whistle/instruments";
import { BasicSelect } from "./primitives/BasicSelect";

export function InstrumentSelect() {
  const { instrumentId, updateInstrument } = useInstrument();

  return (
    <BasicSelect
      value={instrumentId}
      onChange={updateInstrument}
      label="Select Instrument"
    >
      {INSTRUMENT_GROUPS.map(({ group, instruments }) => (
        <optgroup key={group} label={group}>
          {instruments.map((inst) => (
            <option key={inst.id} value={inst.id}>
              {inst.label}
            </option>
          ))}
        </optgroup>
      ))}
    </BasicSelect>
  );
}
