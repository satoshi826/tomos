import type { CameraPosition } from './types/util'

export const DEFAULT_COLOR = 230 // 0 - 360 deg
export const MESSAGE_SIDE = 1
export const TOPIC_SIDE = MESSAGE_SIDE * 10
export const AREA_SIDE = TOPIC_SIDE * 10
export const DEFAULT_POSITION: CameraPosition = { x: 0, y: 0, z: 10 }
export const MAX_X = 2000
export const MAX_Y = 2000
export const MIN_X = 0
export const MIN_Y = 0

export const MAX_MESSAGE_LENGTH = 100
export const MAX_TOPIC_TITLE_LENGTH = 48
