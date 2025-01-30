import type { Area as _Area } from 'shared/types/generated/modelSchema/AreaSchema'
import type { Message as _Message } from 'shared/types/generated/modelSchema/MessageSchema'
import type { Topic as _Topic } from 'shared/types/generated/modelSchema/TopicSchema'

export const MESSAGE_SIDE = 1
export const TOPIC_SIDE = 10
export const AREA_SIDE = TOPIC_SIDE * 10
export const DEFAULT_POSITION: CameraPosition = { x: 0, y: 0, z: 10 }
export const MAX_X = 2000
export const MAX_Y = 2000
export const MIN_X = 0
export const MIN_Y = 0

export const VIEW_MODES = ['message', 'messages', 'topics', 'areas'] as const
export const MESSAGE_VIEW_MAX_Z = 1.5
export const MESSAGES_VIEW_MAX_Z = 10
export const TOPICS_VIEW_MAX_Z = 85

export type ViewMode = (typeof VIEW_MODES)[number]

export type ScreenPosition = {
  x: number
  y: number
}

export type CanvasSize = {
  width: number
  height: number
}

export type Position = {
  x: number
  y: number
}

export type Zoom = {
  z: number
}

//----------------------------------------------------------------

export type CameraPosition = Zoom & Position

export type UserId = string
export type User = {
  id: UserId
  name: string
}

export type UserPosition = Position

export const MAX_MESSAGE_LENGTH = 100
export type MessageId = string
export type Message = _Message
export type Topic = _Topic
export type Area = _Area

//----------------------------------------------------------------

export type Infra = {
  getMessage: () => Message[]
}
