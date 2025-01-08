export const TOPIC_SIDE = 10
export const AREA_SIDE = TOPIC_SIDE * 10
export const DEFAULT_POSITION: CameraPosition = { x: 0, y: 0, z: 10 }
export const MAX_X = 2000
export const MAX_Y = 2000
export const MIN_X = 0
export const MIN_Y = 0

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

export type DateString = string

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
export type Message = {
  id: MessageId
  userId: UserId
  text: string
  createdAt: DateString
} & Position

export type Multiple10 = number
export type TopicId = string
export type Topic = {
  id: TopicId
  title: string
  message: MessageId[]
  x: Multiple10
  y: Multiple10
}

export type AreaId = string
export type Area = {
  id: AreaId
  topic: Record<TopicId, Topic>
}

//----------------------------------------------------------------

export type AddMessage = {
  type: 'add'
  message: Message
}

export type MessageCommand = AddMessage

//----------------------------------------------------------------

export type Infra = {
  getMessage: () => Message[]
}
