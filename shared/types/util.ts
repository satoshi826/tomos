import { z } from 'zod'
import { AreaSchema } from './generated/modelSchema/AreaSchema'
import { MessageSchema } from './generated/modelSchema/MessageSchema'
import { TopicSchema } from './generated/modelSchema/TopicSchema'

export type Position = { x: number; y: number }

export type Zoom = {
  z: number
}

export type CameraPosition = Zoom & Position

export const AreaWithTopicsSchema = AreaSchema.merge(z.object({ topics: z.array(TopicSchema) }))

export type AreaWithTopics = z.infer<typeof AreaWithTopicsSchema>

export const TopicWithMessagesSchema = TopicSchema.merge(z.object({ messages: z.array(MessageSchema) }))

export type TopicWithMessages = z.infer<typeof TopicWithMessagesSchema>
