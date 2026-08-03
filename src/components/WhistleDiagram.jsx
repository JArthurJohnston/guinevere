import { getFingering } from '../whistle/fingeringChart'
import { isOcarina5Hole, ocarina5Dimensions, isOcarina12Hole, ocarina12Dimensions } from '../whistle/ocarinaLayout'
import { Hole, HOLE_R, HOLE_GAP, TOP_PAD } from './DiagramHole'
import { Ocarina5SvgBody, Ocarina12SvgBody } from './OcarinaDiagram'

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

function tubeDimensions(holeCount) {
  return { width: WIDTH, height: TOP_PAD * 2 + HOLE_GAP * (holeCount - 1) + HOLE_R * 2 }
}

function TubeSvgBody({ f, width, height, disabled }) {
  const cx = width / 2
  return (
    <>
      {f.holes.map((state, i) => (
        <Hole key={i} state={state} cx={cx} cy={TOP_PAD + HOLE_R + i * HOLE_GAP} />
      ))}
      {disabled && <line x1={5} y1={5} x2={width - 5} y2={height - 5} className="disabled-strike" />}
    </>
  )
}

// Each non-tube body shape owns its own dimensions and SVG body renderer;
// adding another one (e.g. a 6-hole ocarina) means adding an entry here
// rather than touching the tube-specific layout above.
const SHAPES = [
  { test: isOcarina5Hole, dimensions: ocarina5Dimensions, Body: Ocarina5SvgBody },
  { test: isOcarina12Hole, dimensions: ocarina12Dimensions, Body: Ocarina12SvgBody },
]

function shapeFor(instrument) {
  return SHAPES.find((shape) => shape.test(instrument))
}

function dimensionsFor(instrument) {
  const shape = shapeFor(instrument)
  return shape ? shape.dimensions() : tubeDimensions(instrument.holeCount)
}

export function WhistleDiagram({ midi, instrument, duration }) {
  const f = getFingering(midi, instrument)
  const shape = shapeFor(instrument)
  const { width, height } = dimensionsFor(instrument)
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
        {shape ? <shape.Body f={f} disabled={disabled} /> : <TubeSvgBody f={f} width={width} height={height} disabled={disabled} />}
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
  const { width, height } = dimensionsFor(instrument)
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
