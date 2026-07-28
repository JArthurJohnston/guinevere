// Fingering logic for 6-hole diatonic whistles/flutes and 5-hole pentatonic
// whistles. Holes are numbered from the top (nearest the mouthpiece) down.
// Each hole state is one of: 'closed', 'open', 'half'.
//
// Fingerings are keyed by semitone step above the instrument's tonic (the
// note sounded with every hole closed), not by absolute pitch - that's what
// lets one table serve every key of whistle/flute.

const CHROMATIC_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

// `uncommon` fingerings are cross-fingerings that vary between players/instruments
// and are included as a reasonable approximation rather than a settled standard.
const SIX_HOLE_STEPS = {
  0: { holes: ['closed', 'closed', 'closed', 'closed', 'closed', 'closed'] }, // root
  1: { holes: ['closed', 'closed', 'closed', 'closed', 'closed', 'half'], uncommon: true },
  2: { holes: ['closed', 'closed', 'closed', 'closed', 'closed', 'open'] },
  3: { holes: ['closed', 'closed', 'closed', 'half', 'open', 'open'] }, // natural 4th (cross-fingered)
  4: { holes: ['closed', 'closed', 'closed', 'closed', 'open', 'open'] },
  5: { holes: ['closed', 'closed', 'closed', 'open', 'open', 'open'] },
  6: { holes: ['closed', 'closed', 'half', 'open', 'open', 'open'], uncommon: true },
  7: { holes: ['closed', 'closed', 'open', 'open', 'open', 'open'] },
  8: { holes: ['closed', 'half', 'open', 'open', 'open', 'open'], uncommon: true },
  9: { holes: ['closed', 'open', 'open', 'open', 'open', 'open'] },
  10: { holes: ['open', 'closed', 'closed', 'closed', 'closed', 'closed'] }, // natural 7th (cross-fingered)
  11: { holes: ['open', 'open', 'open', 'open', 'open', 'open'] },
}

// A 5-hole pentatonic instrument only has straightforward fingerings for the
// major-pentatonic scale degrees (root, 2, 3, 5, 6); everything else is left
// undefined rather than guessing at a cross-fingering, since designs vary too
// much to have one standard answer the way 6-hole whistles do.
const FIVE_HOLE_STEPS = {
  0: { holes: ['closed', 'closed', 'closed', 'closed', 'closed'] },
  2: { holes: ['closed', 'closed', 'closed', 'closed', 'open'] },
  4: { holes: ['closed', 'closed', 'closed', 'open', 'open'] },
  7: { holes: ['closed', 'closed', 'open', 'open', 'open'] },
  9: { holes: ['closed', 'open', 'open', 'open', 'open'] },
}

const MAX_SEMITONES_ABOVE_TONIC = 31 // spans root through a hard third-register overblow

function stepsFor(instrument) {
  return instrument.holeCount === 5 ? FIVE_HOLE_STEPS : SIX_HOLE_STEPS
}

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
  const entry = stepsFor(instrument)[step]
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
    return { ...base, holes: Array(instrument.holeCount).fill('open'), unplayable: true, uncommon: false, breathHint: null }
  }

  return {
    ...base,
    holes: entry.holes,
    unplayable: false,
    uncommon: !!entry.uncommon,
    breathHint: register === 1 ? null : register === 2 ? 'overblow' : 'hard overblow',
  }
}
