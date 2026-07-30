// Fingering logic for whistles/flutes. Holes are numbered from the top
// (nearest the mouthpiece) down. Each hole state is one of: 'closed', 'open',
// 'half'.
//
// The actual fingering tables live per-instrument-family in ./instruments/*.json
// (see instruments.js), keyed by semitone step above the instrument's tonic
// (the note sounded with every hole closed) rather than by absolute pitch -
// that's what lets one table serve every key within a family. A table is
// normally just steps 0-11 (the base octave), reused for higher octaves via
// overblowing. A key of 12 or above is an *explicit* override for that exact
// note - useful for an instrument (or a specific note on it) that reaches a
// higher octave with its own dedicated normal-breath fingering rather than by
// overblowing the base-octave one.

const CHROMATIC_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const MAX_SEMITONES_WITH_OVERBLOW = 31 // spans root through a hard third-register overblow
const MAX_SEMITONES_WITHOUT_OVERBLOW = 11 // just the first register, root through the note below the octave

// Some instruments (many Native American flutes, for example) don't overblow
// cleanly, so their `overblow: false` caps range at the first register -
// unless the table defines explicit fingerings further up (see above), in
// which case the range grows just enough to include those specific notes.
export function maxSemitonesAboveTonic(instrument) {
  if (instrument.overblow === false) {
    const explicitOffsets = Object.keys(instrument.fingering).map(Number)
    return Math.max(MAX_SEMITONES_WITHOUT_OVERBLOW, ...explicitOffsets)
  }
  return MAX_SEMITONES_WITH_OVERBLOW
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
  const offset = midi - tonic
  const outOfRange = offset < 0 || offset > maxSemitonesAboveTonic(instrument)
  const register = Math.floor(offset / 12) + 1 // 1 = normal breath, 2 = overblow, 3 = hard overblow

  const base = {
    midi,
    noteName: midiToNoteName(midi),
    relativeName: noteLetterName(midi),
    register,
    outOfRange,
  }

  // An explicit entry at this exact offset (only possible above the base
  // octave) is a dedicated fingering for this note, not a reused one - so it
  // doesn't need the register-based overblow hint below.
  const exactEntry = instrument.fingering[offset]
  if (exactEntry) {
    return {
      ...base,
      holes: exactEntry.holes,
      unplayable: false,
      uncommon: !!exactEntry.uncommon,
      breathHint: null,
      alternates: exactEntry.alternates || [],
    }
  }

  const step = ((offset % 12) + 12) % 12
  const entry = instrument.fingering[step]

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
