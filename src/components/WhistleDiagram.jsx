import { getFingering } from '../whistle/fingeringChart'

const HOLE_R = 7
const HOLE_GAP = 17
const TOP_PAD = 6
const WIDTH = 40

function diagramHeight(holeCount) {
  return TOP_PAD * 2 + HOLE_GAP * (holeCount - 1) + HOLE_R * 2
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

export function WhistleDiagram({ midi, instrument }) {
  const f = getFingering(midi, instrument)
  const cx = WIDTH / 2
  const height = diagramHeight(instrument.holeCount)
  const disabled = f.unplayable || f.outOfRange
  const flagged = disabled || f.uncommon

  return (
    <div className={`whistle-diagram${disabled ? ' disabled' : ''}`} title={diagramTitle(f)}>
      <div className="note-name">
        {f.relativeName}
        <sub>{octaveSuffix(f)}</sub>
      </div>
      <svg width={WIDTH} height={height} viewBox={`0 0 ${WIDTH} ${height}`}>
        {f.holes.map((state, i) => (
          <Hole key={i} state={state} cx={cx} cy={TOP_PAD + HOLE_R + i * HOLE_GAP} />
        ))}
        {disabled && <line x1={5} y1={5} x2={WIDTH - 5} y2={height - 5} className="disabled-strike" />}
      </svg>
      {!disabled && f.breathHint && <div className="breath-hint">{f.breathHint === 'overblow' ? '↑' : '⇈'}</div>}
      {flagged && (
        <div className="note-flag" title={flagTitle(f)}>
          {disabled ? '!' : '~'}
        </div>
      )}
    </div>
  )
}

export function RestMark({ instrument }) {
  const height = diagramHeight(instrument.holeCount)
  return (
    <div className="whistle-diagram rest" title="Rest">
      <div className="note-name">&nbsp;</div>
      <svg width={WIDTH} height={height} viewBox={`0 0 ${WIDTH} ${height}`}>
        <line x1={WIDTH / 2 - 8} y1={height / 2} x2={WIDTH / 2 + 8} y2={height / 2} className="rest-mark" />
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
  return parts.join(' — ')
}
