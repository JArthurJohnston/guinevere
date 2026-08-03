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
- **5-hole pentatonic whistle**, same keys — only the five major-pentatonic
  scale degrees have a standard fingering, so notes outside that scale are
  flagged as not playable rather than guessed at
- **Native American flute**, 6-hole, same keys — tuned to the commonly
  published "Mode I" hexatonic scale (root, b3, 4, 5, 6, b7), so notes
  outside that scale are flagged as not playable rather than guessed at

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
    "2": {
      "holes": ["closed", "closed", "closed", "closed", "closed", "open"],
      "uncommon": true,
      "note": "optional free-text context, not read by the app",
      "alternates": [
        {
          "holes": ["closed", "closed", "closed", "closed", "half", "open"],
          "note": "shown in the tooltip when this note has more than one valid fingering"
        }
      ]
    }
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
| `overblow` | Optional, defaults to `true`. Set to `false` if the instrument doesn't overblow cleanly (common on Native American flutes). This caps both the fingering tab and the reference fingering chart at the first register, unless the table also defines explicit fingerings above step 11 (see below) — those specific notes are shown regardless. |
| `definedFingeringsOnly` | Optional, defaults to `false`. Set to `true` to have the reference fingering chart show only notes with a fingering table entry at that *exact* semitone step — gaps (including ones that would otherwise fall back to a reused base-octave fingering) are skipped instead of shown flagged unplayable. Useful for an instrument you're still mapping out by ear, where a reused fingering for an unconfirmed note would be a guess rather than a verified one. Doesn't affect the tab for a loaded tune — notes there are always shown in place (flagged if unplayable) so the tune's timing stays intact. |
| `fingering` | Map of semitone step above the tonic → `{ holes, uncommon?, note?, alternates? }`. `holes` is an array of `"closed"` / `"open"` / `"half"`, length `holeCount`, ordered from the hole nearest the mouthpiece down. `"0"`–`"11"` covers the base octave and is reused for higher octaves via overblowing; a step ≥ `"12"` is an *explicit* fingering for that exact higher note — used instead of reusing the base-octave one, and never treated as requiring overblow. Steps with no entry (and no applicable base-octave fallback) are treated as unplayable. `uncommon: true` flags a cross-fingering that varies between players/instruments rather than a settled standard. The top-level `note` is free-text documentation and isn't read by the app. |
| `fingering[step].alternates` | Optional array of `{ holes, note? }` for other valid fingerings of that note. The diagram still draws the top-level `holes` as the primary fingering and shows a small "alt" marker; hovering it (or the diagram itself) lists each alternate's `note` in the tooltip — so write `note` as the text you want a player to see (e.g. `"3rd finger half-hole, easier coming from A"`), not just internal commentary. |
| `description` | Optional free-text note about the family as a whole (e.g. why some steps are omitted); not read by the app. |

To add a key to an existing family, add an entry to that family's `keys`
map. To add a new family (including one of your own with custom
fingerings), drop a new JSON file in the folder in this same shape, then
import it and add it to the `FAMILIES` array in `src/whistle/instruments.js`.

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

## Notes

### 12 Hole Ocarinas
Real 12-hole ocarinas use a "English system" fingering chart with specific hole combinations and an extended upper range that I (Claude) don't have reliable enough confidence to reproduce from memory without risking a wrong answer. So instead I extended this app's existing sequential-hole-opening convention (same approach used for the 5-hole ocarina) to 12 holes — thumbs open first, then front holes alternating hands from pinky to index. That happens to work out cleanly: 12 holes opening one at a time gives a fully-defined, honest chromatic octave (all 13 semitones, root through the octave), but it does not capture the extra upper range or authentic cross-fingerings a real instrument has. If you've got a manufacturer chart or a specific instrument to confirm against, I can swap the fingering table for the real one.
