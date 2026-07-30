// Each instrument family (tin whistle, simple-system flute, 5-hole pentatonic)
// lives in its own JSON file under ./instruments/ - hole layout, fingering
// table, and the set of keys it's offered in. Instruments within a family all
// finger identically; only the tonic pitch changes between keys, so a family
// file's `keys` map is enough to generate every dropdown entry for it.
//
// To add a key to an existing family, add an entry to that family's `keys`
// map. To add a new family (e.g. a different cross-fingering scheme), add a
// JSON file here and list it in FAMILIES below.
import tinWhistle from './instruments/tin-whistle.json'
import simpleSystemFlute from './instruments/simple-system-flute.json'
import pentatonic from './instruments/pentatonic.json'
import nativeAmericanFlute from './instruments/native-american-flute.json'
import nativeAmericanFluteCustom from './instruments/native-american-flute-custom.json'

const FAMILIES = [tinWhistle, simpleSystemFlute, pentatonic, nativeAmericanFlute, nativeAmericanFluteCustom]

function buildGroup(family) {
  return {
    group: family.group,
    instruments: Object.entries(family.keys).map(([key, tonicMidi]) => ({
      id: `${family.idPrefix}-${key}`,
      label: `${key} ${family.labelSuffix}`,
      holeCount: family.holeCount,
      tonicMidi,
      fingering: family.fingering,
      overblow: family.overblow !== false,
      definedFingeringsOnly: !!family.definedFingeringsOnly,
    })),
  }
}

export const INSTRUMENT_GROUPS = FAMILIES.map(buildGroup)

export const INSTRUMENTS = INSTRUMENT_GROUPS.flatMap((g) => g.instruments)

export const DEFAULT_INSTRUMENT_ID = 'whistle-D4'

export function getInstrument(id) {
  return INSTRUMENTS.find((i) => i.id === id) || INSTRUMENTS.find((i) => i.id === DEFAULT_INSTRUMENT_ID)
}
