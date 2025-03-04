import type { CameraPosition, Position as _Position } from 'shared/types/util'

export const DEFAULT_POSITION: CameraPosition = { x: 0, y: 0, z: 10 }
export const VIEW_MODES = ['message', 'messages', 'topics', 'areas'] as const
export const MESSAGE_VIEW_MAX_Z = 1.5
export const MESSAGES_VIEW_MAX_Z = 13
export const TOPICS_VIEW_MAX_Z = 85
export type ViewMode = (typeof VIEW_MODES)[number]
export const CREATE_MODES = ['message', 'topic'] as const
export type CreateMode = (typeof CREATE_MODES)[number]
export const MESSAGE_CREATE_VIEW_MAX_Z = 4
export const TOPIC_CREATE_VIEW_MAX_Z = 25

export type ScreenPosition = {
  x: number
  y: number
}

export type CanvasSize = {
  width: number
  height: number
}
