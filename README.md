# Tin Whistle Tab

A web app that turns [ABC notation](https://abcnotation.com/) into a fingering
tab for tin whistle and simple-system flute.

Paste or drag in an `.abc` file and it renders:

- standard staff notation, with audio playback (play/pause, restart, loop)
- a fingering tab underneath: one hole diagram per note, grouped by measure

## Instruments

Every 6-hole whistle or simple-system flute fingers identically — only the
pitch you get with all holes closed changes between keys — so one fingering
chart drives every instrument in the picker:

- **Tin whistle**, 6-hole, in Bb / C / D / Eb / F / G / A
- **Simple-system flute**, 6-hole, same keys
- **5-hole pentatonic whistle**, same keys — only the five pentatonic scale
  degrees have a standard fingering, so notes outside that scale are flagged
  as not playable rather than guessed at

The tab marks which octave a note falls in (and when it needs overblowing),
cross-fingered accidentals that aren't fully standardized, and notes outside
an instrument's playable range.

Pitch resolution (key signatures, accidentals carried through a bar, etc.)
is delegated to [abcjs](https://abcjs.net) rather than reimplemented, since
that's exactly the logic it already needs for correct audio playback.

### Instrument JSON format

Each instrument *family* (tin whistle, simple-system flute, 5-hole
pentatonic) is one JSON file in `src/whistle/instruments/`. Instruments
within a family finger identically — only the tonic pitch changes between
keys — so a family file lists its fingering table once and a set of keys to
generate dropdown entries from. `src/whistle/instruments.js` imports every
file in the folder and expands each one's `keys` map into the full
instrument list.

```json
{
  "group": "Tin Whistle (6-hole)",
  "idPrefix": "whistle",
  "labelSuffix": "Whistle",
  "holeCount": 6,
  "keys": { "D": 62, "G": 67 },
  "fingering": {
    "0": { "holes": ["closed", "closed", "closed", "closed", "closed", "closed"] },
    "2": { "holes": ["closed", "closed", "closed", "closed", "closed", "open"], "uncommon": true, "note": "optional free-text context" }
  }
}
```

| Field | Meaning |
| --- | --- |
| `group` | Optgroup label shown in the instrument picker. |
| `idPrefix` | Combined with each key to form instrument ids, e.g. `whistle-D`. |
| `labelSuffix` | Combined with each key to form the dropdown label, e.g. `D Whistle`. |
| `holeCount` | Number of holes drawn in the tab diagram. |
| `keys` | Map of key name → tonic MIDI pitch (the note sounded with every hole closed). One instrument is generated per entry. |
| `fingering` | Map of semitone step above the tonic (`"0"`–`"11"`) → `{ holes, uncommon?, note? }`. `holes` is an array of `"closed"` / `"open"` / `"half"`, length `holeCount`, ordered from the hole nearest the mouthpiece down. Steps with no entry are treated as unplayable on that instrument. `uncommon: true` flags a cross-fingering that varies between players/instruments rather than a settled standard. `note` is optional free-text documentation and isn't read by the app. |
| `description` | Optional free-text note about the family as a whole (e.g. why some steps are omitted); not read by the app. |

To add a key to an existing family, add an entry to that family's `keys`
map. To add a new family, drop a new JSON file in the folder, then import it
and add it to the `FAMILIES` array in `src/whistle/instruments.js`.

## Getting started

```sh
npm install
npm run dev
```

Other scripts:

```sh
npm run build    # production build
npm run preview  # preview the production build
npm run lint     # eslint
```

## Project layout

```
src/
  abc/          ABC parsing helpers (note/measure extraction, example tunes)
  whistle/      fingering chart + instrument definitions
    instruments/  one JSON file per instrument family (see below)
  components/   UI (input, notation, tab, player, instrument picker)
```
