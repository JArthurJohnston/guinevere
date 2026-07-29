import { WhistleDiagram } from './WhistleDiagram'
import { Legend } from './Legend'
import { MAX_SEMITONES_ABOVE_TONIC } from '../whistle/fingeringChart'

const REGISTER_LABELS = {
  1: '1st octave',
  2: '2nd octave (overblow)',
  3: '3rd octave (hard overblow)',
}

export function FingeringChart({ instrument }) {
  const registers = new Map()
  for (let offset = 0; offset <= MAX_SEMITONES_ABOVE_TONIC; offset++) {
    const register = Math.floor(offset / 12) + 1
    if (!registers.has(register)) registers.set(register, [])
    registers.get(register).push(instrument.tonicMidi + offset)
  }

  return (
    <div className="fingering-chart">
      {[...registers.entries()].map(([register, midiList]) => (
        <div className="fingering-chart-row" key={register}>
          <h3>{REGISTER_LABELS[register] || `Octave ${register}`}</h3>
          <div className="fingering-chart-notes">
            {midiList.map((midi) => (
              <WhistleDiagram key={midi} midi={midi} instrument={instrument} />
            ))}
          </div>
        </div>
      ))}

      <Legend />
    </div>
  )
}
