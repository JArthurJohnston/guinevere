// Shared sizing/rendering for a single tone hole, used by every instrument
// diagram shape (tube, ocarina, ...) so they stay visually consistent.
export const HOLE_R = 7
export const HOLE_GAP = 17
export const TOP_PAD = 6

export function Hole({ state, cx, cy }) {
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
