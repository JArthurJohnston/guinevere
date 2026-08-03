import { WhistleDiagram } from './WhistleDiagram'
import { Legend } from './Legend'
import { maxSemitonesAboveTonic } from '../whistle/fingeringChart'
import { useInstrument } from '../context/instrumentContext'

const REGISTER_LABELS_WITH_OVERBLOW = {
  1: '1st octave',
  2: '2nd octave (overblow)',
  3: '3rd octave (hard overblow)',
}

// overblow: false instruments only ever reach a higher octave via an
// explicit, dedicated fingering (see fingeringChart.js), so there's no
// overblowing to call out in the label.
const REGISTER_LABELS_WITHOUT_OVERBLOW = {
  1: '1st octave',
  2: '2nd octave',
  3: '3rd octave',
}

export function FingeringChart() {
  const {instrument } = useInstrument()
  const registerLabels = instrument.overblow === false ? REGISTER_LABELS_WITHOUT_OVERBLOW : REGISTER_LABELS_WITH_OVERBLOW
  const registers = new Map()
  for (let offset = 0; offset <= maxSemitonesAboveTonic(instrument); offset++) {
    if (instrument.definedFingeringsOnly && !(offset in instrument.fingering)) continue
    const register = Math.floor(offset / 12) + 1
    if (!registers.has(register)) registers.set(register, [])
    registers.get(register).push(instrument.tonicMidi + offset)
  }

  return (
    <div className="fingering-chart">
      {[...registers.entries()].map(([register, midiList]) => (
        <div className="fingering-chart-row" key={register}>
          <h3>{registerLabels[register] || `Octave ${register}`}</h3>
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
