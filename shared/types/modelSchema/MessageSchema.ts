import { z } from 'zod'
import { TopicOptionalDefaultsWithRelationsSchema, TopicPartialWithRelationsSchema, TopicWithRelationsSchema } from './TopicSchema'
import type { TopicOptionalDefaultsWithRelations, TopicPartialWithRelations, TopicWithRelations } from './TopicSchema'
import { UserOptionalDefaultsWithRelationsSchema, UserPartialWithRelationsSchema, UserWithRelationsSchema } from './UserSchema'
import type { UserOptionalDefaultsWithRelations, UserPartialWithRelations, UserWithRelations } from './UserSchema'

/////////////////////////////////////////
// MESSAGE SCHEMA
/////////////////////////////////////////

export const MessageSchema = z.object({
  id: z.number().int(),
  userId: z.string(),
  topicId: z.number().int(),
  content: z.string().max(256),
  x: z.number().int().nonnegative(),
  y: z.number().int().nonnegative(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Message = z.infer<typeof MessageSchema>

/////////////////////////////////////////
// MESSAGE PARTIAL SCHEMA
/////////////////////////////////////////

export const MessagePartialSchema = MessageSchema.partial()

export type MessagePartial = z.infer<typeof MessagePartialSchema>

/////////////////////////////////////////
// MESSAGE OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const MessageOptionalDefaultsSchema = MessageSchema.merge(
  z.object({
    id: z.number().int().optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  }),
)

export type MessageOptionalDefaults = z.infer<typeof MessageOptionalDefaultsSchema>

/////////////////////////////////////////
// MESSAGE RELATION SCHEMA
/////////////////////////////////////////

export type MessageRelations = {
  user: UserWithRelations
  topic: TopicWithRelations
}

export type MessageWithRelations = z.infer<typeof MessageSchema> & MessageRelations

export const MessageWithRelationsSchema: z.ZodType<MessageWithRelations> = MessageSchema.merge(
  z.object({
    user: z.lazy(() => UserWithRelationsSchema),
    topic: z.lazy(() => TopicWithRelationsSchema),
  }),
)

/////////////////////////////////////////
// MESSAGE OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type MessageOptionalDefaultsRelations = {
  user: UserOptionalDefaultsWithRelations
  topic: TopicOptionalDefaultsWithRelations
}

export type MessageOptionalDefaultsWithRelations = z.infer<typeof MessageOptionalDefaultsSchema> & MessageOptionalDefaultsRelations

export const MessageOptionalDefaultsWithRelationsSchema: z.ZodType<MessageOptionalDefaultsWithRelations> = MessageOptionalDefaultsSchema.merge(
  z.object({
    user: z.lazy(() => UserOptionalDefaultsWithRelationsSchema),
    topic: z.lazy(() => TopicOptionalDefaultsWithRelationsSchema),
  }),
)

/////////////////////////////////////////
// MESSAGE PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type MessagePartialRelations = {
  user?: UserPartialWithRelations
  topic?: TopicPartialWithRelations
}

export type MessagePartialWithRelations = z.infer<typeof MessagePartialSchema> & MessagePartialRelations

export const MessagePartialWithRelationsSchema: z.ZodType<MessagePartialWithRelations> = MessagePartialSchema.merge(
  z.object({
    user: z.lazy(() => UserPartialWithRelationsSchema),
    topic: z.lazy(() => TopicPartialWithRelationsSchema),
  }),
).partial()

export type MessageOptionalDefaultsWithPartialRelations = z.infer<typeof MessageOptionalDefaultsSchema> & MessagePartialRelations

export const MessageOptionalDefaultsWithPartialRelationsSchema: z.ZodType<MessageOptionalDefaultsWithPartialRelations> = MessageOptionalDefaultsSchema.merge(
  z
    .object({
      user: z.lazy(() => UserPartialWithRelationsSchema),
      topic: z.lazy(() => TopicPartialWithRelationsSchema),
    })
    .partial(),
)

export type MessageWithPartialRelations = z.infer<typeof MessageSchema> & MessagePartialRelations

export const MessageWithPartialRelationsSchema: z.ZodType<MessageWithPartialRelations> = MessageSchema.merge(
  z
    .object({
      user: z.lazy(() => UserPartialWithRelationsSchema),
      topic: z.lazy(() => TopicPartialWithRelationsSchema),
    })
    .partial(),
)

export default MessageSchema
