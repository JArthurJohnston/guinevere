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
  components/   UI (input, notation, tab, player, instrument picker)
```
