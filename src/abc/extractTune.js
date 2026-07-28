// Walks a rendered abcjs TuneObject and produces a flat, measure-grouped
// sequence of note/rest events suitable for driving the whistle tab display.
//
// abcjs's own `pitch` field on a parsed note is a diatonic step count, not a
// real pitch - it doesn't know about key-signature accidentals or accidentals
// carried through a bar. `tune.setUpAudio()` runs the same pitch-resolution
// logic abcjs uses for MIDI playback and (as a side effect) attaches a
// `midiPitches` array to each note element with the fully-resolved MIDI
// pitch, so we reuse that instead of re-deriving music theory ourselves.

export function extractNoteSequence(tune) {
  tune.setUpAudio({})

  const header = {
    title: tune.metaText?.title || null,
    key: safeCall(() => {
      const k = tune.getKeySignature()
      return k?.root ? `${k.root}${k.acc || ''} ${k.mode || ''}`.trim() : null
    }),
    meter: safeCall(() => {
      const m = tune.getMeter()
      if (!m) return null
      if (m.type === 'specified' && m.value?.length) {
        return m.value.map((v) => `${v.num}/${v.den}`).join(' ')
      }
      return m.type || null
    }),
    tempo: safeCall(() => tune.getBpm()) || null,
  }

  const measures = [[]]
  let voiceFound = false

  for (const line of tune.lines || []) {
    const staff = line.staff?.[0]
    const voice = staff?.voices?.[0]
    if (!voice) continue
    voiceFound = true

    for (const el of voice) {
      if (el.el_type === 'bar') {
        if (measures[measures.length - 1].length > 0) measures.push([])
        continue
      }
      if (el.el_type !== 'note') continue

      if (el.rest) {
        measures[measures.length - 1].push({ type: 'rest', duration: el.duration })
        continue
      }

      if (el.pitches && el.pitches.length) {
        const pitchList = el.midiPitches?.length ? el.midiPitches.map((p) => p.pitch) : []
        if (!pitchList.length) continue // e.g. an unresolvable pitch; skip rather than guess
        measures[measures.length - 1].push({
          type: 'note',
          midi: Math.max(...pitchList),
          duration: el.duration,
          hasChord: pitchList.length > 1,
        })
      }
    }
  }

  return { header, measures: measures.filter((m) => m.length > 0), voiceFound }
}

function safeCall(fn) {
  try {
    return fn()
  } catch {
    return null
  }
}
