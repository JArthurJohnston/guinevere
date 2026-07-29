// Fingering logic for whistles/flutes. Holes are numbered from the top
// (nearest the mouthpiece) down. Each hole state is one of: 'closed', 'open',
// 'half'.
//
// The actual fingering tables live per-instrument-family in ./instruments/*.json
// (see instruments.js), keyed by semitone step above the instrument's tonic
// (the note sounded with every hole closed) rather than by absolute pitch -
// that's what lets one table serve every key within a family.

const CHROMATIC_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export const MAX_SEMITONES_ABOVE_TONIC = 31 // spans root through a hard third-register overblow

export function midiToNoteName(midi) {
  const octave = Math.floor(midi / 12) - 1
  return `${CHROMATIC_NAMES[((midi % 12) + 12) % 12]}${octave}`
}

export function noteLetterName(midi) {
  return CHROMATIC_NAMES[((midi % 12) + 12) % 12]
}

export function getFingering(midi, instrument) {
  const tonic = instrument.tonicMidi
  const step = ((midi - tonic) % 12 + 12) % 12
  const entry = instrument.fingering[step]
  const outOfRange = midi < tonic || midi > tonic + MAX_SEMITONES_ABOVE_TONIC
  const register = Math.floor((midi - tonic) / 12) + 1 // 1 = normal breath, 2 = overblow, 3 = hard overblow

  const base = {
    midi,
    noteName: midiToNoteName(midi),
    relativeName: noteLetterName(midi),
    register,
    outOfRange,
  }

  if (!entry) {
    return {
      ...base,
      holes: Array(instrument.holeCount).fill('open'),
      unplayable: true,
      uncommon: false,
      breathHint: null,
      alternates: [],
    }
  }

  return {
    ...base,
    holes: entry.holes,
    unplayable: false,
    uncommon: !!entry.uncommon,
    breathHint: register === 1 ? null : register === 2 ? 'overblow' : 'hard overblow',
    alternates: entry.alternates || [],
  }
}
