// Every 6-hole whistle/flute in the "penny whistle" family fingers identically -
// the only thing that changes between keys is which pitch sounds when all holes
// are closed. So instruments are just (hole count, tonic pitch) pairs; the actual
// fingering shapes live in fingeringChart.js and are looked up relative to the
// tonic.
//
// Tonics are chosen to match real instrument ordering (a Bb whistle is physically
// bigger/lower than a C whistle, which is lower than D, etc.) rather than a naive
// "letter + octave 4" rule, which would put Bb in the wrong octave.
const TONIC_MIDI = {
  Bb: 58, // Bb3
  C: 60, // C4
  D: 62, // D4 - the standard session whistle
  Eb: 63, // Eb4
  F: 65, // F4
  G: 67, // G4
  A: 69, // A4
}

const KEY_ORDER = ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A']

export const INSTRUMENT_GROUPS = [
  {
    group: 'Tin Whistle (6-hole)',
    instruments: KEY_ORDER.map((key) => ({
      id: `whistle-${key}`,
      label: `${key} Whistle`,
      holeCount: 6,
      tonicMidi: TONIC_MIDI[key],
    })),
  },
  {
    group: 'Simple-System Flute (6-hole)',
    instruments: KEY_ORDER.map((key) => ({
      id: `flute-${key}`,
      label: `${key} Irish Flute`,
      holeCount: 6,
      tonicMidi: TONIC_MIDI[key],
    })),
  },
  {
    group: '5-hole Pentatonic',
    instruments: KEY_ORDER.map((key) => ({
      id: `penta-${key}`,
      label: `${key} Pentatonic (5-hole)`,
      holeCount: 5,
      tonicMidi: TONIC_MIDI[key],
    })),
  },
]

export const INSTRUMENTS = INSTRUMENT_GROUPS.flatMap((g) => g.instruments)

export const DEFAULT_INSTRUMENT_ID = 'whistle-D'

export function getInstrument(id) {
  return INSTRUMENTS.find((i) => i.id === id) || INSTRUMENTS.find((i) => i.id === DEFAULT_INSTRUMENT_ID)
}
