import { getFingering } from '../whistle/fingeringChart'

const HOLE_R = 7
const HOLE_GAP = 17
const TOP_PAD = 6
const WIDTH = 40

// abcjs expresses `duration` as a fraction of a whole note (e.g. 0.25 for a
// quarter note). Scaling the gap after each note by duration turns the flat
// row of diagrams into something that reads left-to-right like a rhythm.
const DURATION_GAP_SCALE = 130
const MIN_GAP = 6

function gapStyle(duration) {
  if (!duration) return undefined
  return { marginRight: `${Math.max(MIN_GAP, duration * DURATION_GAP_SCALE)}px` }
}

function diagramHeight(holeCount) {
  return TOP_PAD * 2 + HOLE_GAP * (holeCount - 1) + HOLE_R * 2
}

// Ocarinas are a rounded vessel rather than a tube, and their holes are
// fingered in a 2D cluster rather than a straight line. The 4 front holes
// (array indices 1-4, played by fingers) are drawn as a 2x2 grid inside the
// body outline; index 0 (the thumb hole, played from the back of the
// instrument) is drawn as a separate circle below and outside the body,
// the way printed ocarina fingering charts do it. A short "neck" line off
// the bottom of the body marks the windway/mouthpiece for orientation.
const OCARINA_5_WIDTH = 56
const OCARINA_5_DX = 13 // horizontal offset of each front-hole pair from center
const OCARINA_5_BODY_PAD = 4 // gap between the front holes and the body outline
const OCARINA_5_NECK_LEN = 6 // length of the blowhole/neck mark below the body
const OCARINA_5_BACK_GAP = 4 // gap between the neck mark and the back hole

const OCARINA_5_ROW1_Y = TOP_PAD + HOLE_R
const OCARINA_5_ROW2_Y = OCARINA_5_ROW1_Y + HOLE_GAP
const OCARINA_5_BODY_CX = OCARINA_5_WIDTH / 2
const OCARINA_5_BODY_CY = (OCARINA_5_ROW1_Y + OCARINA_5_ROW2_Y) / 2
const OCARINA_5_BODY_RX = OCARINA_5_DX + HOLE_R + OCARINA_5_BODY_PAD
const OCARINA_5_BODY_RY = (OCARINA_5_ROW2_Y - OCARINA_5_ROW1_Y) / 2 + HOLE_R + OCARINA_5_BODY_PAD
const OCARINA_5_BODY_BOTTOM = OCARINA_5_BODY_CY + OCARINA_5_BODY_RY
const OCARINA_5_NECK_Y2 = OCARINA_5_BODY_BOTTOM + OCARINA_5_NECK_LEN
const OCARINA_5_BACK_HOLE_CY = OCARINA_5_NECK_Y2 + OCARINA_5_BACK_GAP + HOLE_R
const OCARINA_5_HEIGHT = OCARINA_5_BACK_HOLE_CY + HOLE_R + TOP_PAD

const OCARINA_5_POSITIONS = [
  { cx: OCARINA_5_BODY_CX, cy: OCARINA_5_BACK_HOLE_CY },
  { cx: OCARINA_5_BODY_CX - OCARINA_5_DX, cy: OCARINA_5_ROW1_Y },
  { cx: OCARINA_5_BODY_CX + OCARINA_5_DX, cy: OCARINA_5_ROW1_Y },
  { cx: OCARINA_5_BODY_CX - OCARINA_5_DX, cy: OCARINA_5_ROW2_Y },
  { cx: OCARINA_5_BODY_CX + OCARINA_5_DX, cy: OCARINA_5_ROW2_Y },
]

function ocarinaLayout(instrument) {
  if (instrument.layout === 'ocarina-5' && instrument.holeCount === 5) {
    return {
      width: OCARINA_5_WIDTH,
      height: OCARINA_5_HEIGHT,
      positions: OCARINA_5_POSITIONS,
      body: { cx: OCARINA_5_BODY_CX, cy: OCARINA_5_BODY_CY, rx: OCARINA_5_BODY_RX, ry: OCARINA_5_BODY_RY },
      neck: { x: OCARINA_5_BODY_CX, y1: OCARINA_5_BODY_BOTTOM, y2: OCARINA_5_NECK_Y2 },
    }
  }
  return null
}

function Hole({ state, cx, cy }) {
  if (state === 'open') {
    return <circle cx={cx} cy={cy} r={HOLE_R} className="hole hole-open" />
  }
  if (state === 'half') {
    return (
      <g>
        <circle cx={cx} cy={cy} r={HOLE_R} className="hole hole-open" />
        <path
          d={`M ${cx - HOLE_R} ${cy} A ${HOLE_R} ${HOLE_R} 0 0 1 ${cx + HOLE_R} ${cy} Z`}
          className="hole-half-fill"
        />
      </g>
    )
  }
  return <circle cx={cx} cy={cy} r={HOLE_R} className="hole hole-closed" />
}

export function WhistleDiagram({ midi, instrument, duration }) {
  const f = getFingering(midi, instrument)
  const ocarina = ocarinaLayout(instrument)
  const width = ocarina ? ocarina.width : WIDTH
  const height = ocarina ? ocarina.height : diagramHeight(instrument.holeCount)
  const cx = width / 2
  const disabled = f.unplayable || f.outOfRange
  const flagged = disabled || f.uncommon
  const hasAlternates = f.alternates.length > 0

  return (
    <div
      className={`whistle-diagram${disabled ? ' disabled' : ''}`}
      title={diagramTitle(f)}
      style={gapStyle(duration)}
    >
      <div className="note-name">
        {f.relativeName}
        <sub>{octaveSuffix(f)}</sub>
      </div>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {ocarina && (
          <>
            <ellipse cx={ocarina.body.cx} cy={ocarina.body.cy} rx={ocarina.body.rx} ry={ocarina.body.ry} className="ocarina-body" />
            <line x1={ocarina.neck.x} y1={ocarina.neck.y1} x2={ocarina.neck.x} y2={ocarina.neck.y2} className="ocarina-neck" />
          </>
        )}
        {f.holes.map((state, i) =>
          ocarina ? (
            <Hole key={i} state={state} cx={ocarina.positions[i].cx} cy={ocarina.positions[i].cy} />
          ) : (
            <Hole key={i} state={state} cx={cx} cy={TOP_PAD + HOLE_R + i * HOLE_GAP} />
          ),
        )}
        {disabled && <line x1={5} y1={5} x2={width - 5} y2={height - 5} className="disabled-strike" />}
      </svg>
      {!disabled && f.breathHint && <div className="breath-hint">{f.breathHint === 'overblow' ? '↑' : '⇈'}</div>}
      {flagged && (
        <div className="note-flag" title={flagTitle(f)}>
          {disabled ? '!' : '~'}
        </div>
      )}
      {hasAlternates && <div className="note-alt">alt</div>}
    </div>
  )
}

export function RestMark({ instrument, duration }) {
  const ocarina = ocarinaLayout(instrument)
  const width = ocarina ? ocarina.width : WIDTH
  const height = ocarina ? ocarina.height : diagramHeight(instrument.holeCount)
  return (
    <div className="whistle-diagram rest" title="Rest" style={gapStyle(duration)}>
      <div className="note-name">&nbsp;</div>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <line x1={width / 2 - 8} y1={height / 2} x2={width / 2 + 8} y2={height / 2} className="rest-mark" />
      </svg>
    </div>
  )
}

function octaveSuffix(f) {
  if (f.register === 1) return ''
  if (f.register === 2) return '′' // prime mark for the overblown octave
  return '″'
}

function flagTitle(f) {
  if (f.outOfRange) return 'Outside this instrument’s practical range'
  if (f.unplayable) return 'Not in this instrument’s scale — no standard fingering'
  return 'Uncommon accidental — approximate cross-fingering'
}

function diagramTitle(f) {
  const parts = [f.noteName]
  if (f.breathHint) parts.push(f.breathHint)
  if (f.uncommon) parts.push('uncommon cross-fingering')
  if (f.unplayable) parts.push('not in this instrument’s scale')
  if (f.outOfRange) parts.push('outside playable range')
  let title = parts.join(' — ')
  if (f.alternates.length > 0) {
    const alts = f.alternates.map((alt, i) => alt.note || `alternate fingering ${i + 1}`)
    title += `\nAlso playable as: ${alts.join('; ')}`
  }
  return title
}
