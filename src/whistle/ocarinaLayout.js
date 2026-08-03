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

// The 12-hole layout is the same idea scaled up: 10 front holes as two
// columns of 5 (array indices 0-9, alternating left/right, nearest-the-mouth
// hole first) inside the body, and 2 back thumb holes (indices 10-11) below
// and outside it, either side of the neck/blowhole mark.
const H12_WIDTH = 56
const H12_DX = 13 // horizontal offset of each front-hole column from center
const H12_BODY_PAD = 4
const H12_NECK_LEN = 6
const H12_BACK_GAP = 4
const H12_BACK_DX = 10 // horizontal offset of each back thumb hole from center

const H12_ROWS = [0, 1, 2, 3, 4].map((i) => TOP_PAD + HOLE_R + i * HOLE_GAP)
const H12_BODY_CX = H12_WIDTH / 2
const H12_BODY_CY = (H12_ROWS[0] + H12_ROWS[4]) / 2
const H12_BODY_RX = H12_DX + HOLE_R + H12_BODY_PAD
const H12_BODY_RY = (H12_ROWS[4] - H12_ROWS[0]) / 2 + HOLE_R + H12_BODY_PAD
const H12_BODY_BOTTOM = H12_BODY_CY + H12_BODY_RY
const H12_NECK_Y2 = H12_BODY_BOTTOM + H12_NECK_LEN
const H12_BACK_HOLE_CY = H12_NECK_Y2 + H12_BACK_GAP + HOLE_R
const H12_HEIGHT = H12_BACK_HOLE_CY + HOLE_R + TOP_PAD

export const OCARINA_12_WIDTH = H12_WIDTH
export const OCARINA_12_HEIGHT = H12_HEIGHT
export const OCARINA_12_BODY = { cx: H12_BODY_CX, cy: H12_BODY_CY, rx: H12_BODY_RX, ry: H12_BODY_RY }
export const OCARINA_12_NECK = { x: H12_BODY_CX, y1: H12_BODY_BOTTOM, y2: H12_NECK_Y2 }
export const OCARINA_12_POSITIONS = [
  ...H12_ROWS.flatMap((y) => [
    { cx: H12_BODY_CX - H12_DX, cy: y },
    { cx: H12_BODY_CX + H12_DX, cy: y },
  ]),
  { cx: H12_BODY_CX - H12_BACK_DX, cy: H12_BACK_HOLE_CY },
  { cx: H12_BODY_CX + H12_BACK_DX, cy: H12_BACK_HOLE_CY },
]

export function isOcarina12Hole(instrument) {
  return instrument.layout === 'ocarina-12' && instrument.holeCount === 12
}

export function ocarina12Dimensions() {
  return { width: OCARINA_12_WIDTH, height: OCARINA_12_HEIGHT }
}
