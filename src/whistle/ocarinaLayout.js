import { HOLE_R, HOLE_GAP, TOP_PAD } from '../components/DiagramHole'

// Ocarinas are a rounded vessel rather than a tube, and their holes are
// fingered in a 2D cluster rather than a straight line. The 4 front holes
// (array indices 1-4, played by fingers) are drawn as a 2x2 grid inside the
// body outline; index 0 (the thumb hole, played from the back of the
// instrument) is drawn as a separate circle below and outside the body,
// the way printed ocarina fingering charts do it. A short "neck" line off
// the bottom of the body marks the windway/mouthpiece for orientation.
const WIDTH = 56
const DX = 13 // horizontal offset of each front-hole pair from center
const BODY_PAD = 4 // gap between the front holes and the body outline
const NECK_LEN = 6 // length of the blowhole/neck mark below the body
const BACK_GAP = 4 // gap between the neck mark and the back hole

const ROW1_Y = TOP_PAD + HOLE_R
const ROW2_Y = ROW1_Y + HOLE_GAP
const BODY_CX = WIDTH / 2
const BODY_CY = (ROW1_Y + ROW2_Y) / 2
const BODY_RX = DX + HOLE_R + BODY_PAD
const BODY_RY = (ROW2_Y - ROW1_Y) / 2 + HOLE_R + BODY_PAD
const BODY_BOTTOM = BODY_CY + BODY_RY
const NECK_Y2 = BODY_BOTTOM + NECK_LEN
const BACK_HOLE_CY = NECK_Y2 + BACK_GAP + HOLE_R
const HEIGHT = BACK_HOLE_CY + HOLE_R + TOP_PAD

export const OCARINA_5_WIDTH = WIDTH
export const OCARINA_5_HEIGHT = HEIGHT
export const OCARINA_5_BODY = { cx: BODY_CX, cy: BODY_CY, rx: BODY_RX, ry: BODY_RY }
export const OCARINA_5_NECK = { x: BODY_CX, y1: BODY_BOTTOM, y2: NECK_Y2 }
export const OCARINA_5_POSITIONS = [
  { cx: BODY_CX, cy: BACK_HOLE_CY },
  { cx: BODY_CX - DX, cy: ROW1_Y },
  { cx: BODY_CX + DX, cy: ROW1_Y },
  { cx: BODY_CX - DX, cy: ROW2_Y },
  { cx: BODY_CX + DX, cy: ROW2_Y },
]

export function isOcarina5Hole(instrument) {
  return instrument.layout === 'ocarina-5' && instrument.holeCount === 5
}

export function ocarina5Dimensions() {
  return { width: OCARINA_5_WIDTH, height: OCARINA_5_HEIGHT }
}
