import { Hole } from './DiagramHole'
import {
  OCARINA_5_WIDTH,
  OCARINA_5_HEIGHT,
  OCARINA_5_BODY,
  OCARINA_5_NECK,
  OCARINA_5_POSITIONS,
  OCARINA_12_WIDTH,
  OCARINA_12_HEIGHT,
  OCARINA_12_BODY,
  OCARINA_12_NECK,
  OCARINA_12_POSITIONS,
} from '../whistle/ocarinaLayout'

export function Ocarina5SvgBody({ f, disabled }) {
  return (
    <>
      <ellipse cx={OCARINA_5_BODY.cx} cy={OCARINA_5_BODY.cy} rx={OCARINA_5_BODY.rx} ry={OCARINA_5_BODY.ry} className="ocarina-body" />
      <line x1={OCARINA_5_NECK.x} y1={OCARINA_5_NECK.y1} x2={OCARINA_5_NECK.x} y2={OCARINA_5_NECK.y2} className="ocarina-neck" />
      {f.holes.map((state, i) => (
        <Hole key={i} state={state} cx={OCARINA_5_POSITIONS[i].cx} cy={OCARINA_5_POSITIONS[i].cy} />
      ))}
      {disabled && (
        <line x1={5} y1={5} x2={OCARINA_5_WIDTH - 5} y2={OCARINA_5_HEIGHT - 5} className="disabled-strike" />
      )}
    </>
  )
}

export function Ocarina12SvgBody({ f, disabled }) {
  return (
    <>
      <ellipse cx={OCARINA_12_BODY.cx} cy={OCARINA_12_BODY.cy} rx={OCARINA_12_BODY.rx} ry={OCARINA_12_BODY.ry} className="ocarina-body" />
      <line x1={OCARINA_12_NECK.x} y1={OCARINA_12_NECK.y1} x2={OCARINA_12_NECK.x} y2={OCARINA_12_NECK.y2} className="ocarina-neck" />
      {f.holes.map((state, i) => (
        <Hole key={i} state={state} cx={OCARINA_12_POSITIONS[i].cx} cy={OCARINA_12_POSITIONS[i].cy} />
      ))}
      {disabled && (
        <line x1={5} y1={5} x2={OCARINA_12_WIDTH - 5} y2={OCARINA_12_HEIGHT - 5} className="disabled-strike" />
      )}
    </>
  )
}
