import { INSTRUMENT_GROUPS } from '../whistle/instruments'

export function InstrumentSelect({ value, onChange }) {
  return (
    <label className="instrument-select">
      Instrument:
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {INSTRUMENT_GROUPS.map(({ group, instruments }) => (
          <optgroup key={group} label={group}>
            {instruments.map((inst) => (
              <option key={inst.id} value={inst.id}>
                {inst.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  )
}
