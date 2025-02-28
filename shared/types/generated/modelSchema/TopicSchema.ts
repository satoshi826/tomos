import { z } from 'zod';
import { UserWithRelationsSchema, UserPartialWithRelationsSchema, UserOptionalDefaultsWithRelationsSchema } from './UserSchema'
import type { UserWithRelations, UserPartialWithRelations, UserOptionalDefaultsWithRelations } from './UserSchema'
import { AreaWithRelationsSchema, AreaPartialWithRelationsSchema, AreaOptionalDefaultsWithRelationsSchema } from './AreaSchema'
import type { AreaWithRelations, AreaPartialWithRelations, AreaOptionalDefaultsWithRelations } from './AreaSchema'
import { MessageWithRelationsSchema, MessagePartialWithRelationsSchema, MessageOptionalDefaultsWithRelationsSchema } from './MessageSchema'
import type { MessageWithRelations, MessagePartialWithRelations, MessageOptionalDefaultsWithRelations } from './MessageSchema'
import { TagWithRelationsSchema, TagPartialWithRelationsSchema, TagOptionalDefaultsWithRelationsSchema } from './TagSchema'
import type { TagWithRelations, TagPartialWithRelations, TagOptionalDefaultsWithRelations } from './TagSchema'

/////////////////////////////////////////
// TOPIC SCHEMA
/////////////////////////////////////////

export const TopicSchema = z.object({
  id: z.number().int(),
  userId: z.string(),
  areaId: z.number().int(),
  /**
   * z.string.min(1).max(128)
   */
  title: z.string(),
  x: z.number().int().nonnegative().multipleOf(10),
  y: z.number().int().nonnegative().multipleOf(10),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Topic = z.infer<typeof TopicSchema>

/////////////////////////////////////////
// TOPIC PARTIAL SCHEMA
/////////////////////////////////////////

export const TopicPartialSchema = TopicSchema.partial()

export type TopicPartial = z.infer<typeof TopicPartialSchema>

/////////////////////////////////////////
// TOPIC OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const TopicOptionalDefaultsSchema = TopicSchema.merge(z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type TopicOptionalDefaults = z.infer<typeof TopicOptionalDefaultsSchema>

/////////////////////////////////////////
// TOPIC RELATION SCHEMA
/////////////////////////////////////////

export type TopicRelations = {
  user: UserWithRelations;
  area: AreaWithRelations;
  messages: MessageWithRelations[];
  tags: TagWithRelations[];
};

export type TopicWithRelations = z.infer<typeof TopicSchema> & TopicRelations

export const TopicWithRelationsSchema: z.ZodType<TopicWithRelations> = TopicSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema),
  area: z.lazy(() => AreaWithRelationsSchema),
  messages: z.lazy(() => MessageWithRelationsSchema).array(),
  tags: z.lazy(() => TagWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// TOPIC OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type TopicOptionalDefaultsRelations = {
  user: UserOptionalDefaultsWithRelations;
  area: AreaOptionalDefaultsWithRelations;
  messages: MessageOptionalDefaultsWithRelations[];
  tags: TagOptionalDefaultsWithRelations[];
};

export type TopicOptionalDefaultsWithRelations = z.infer<typeof TopicOptionalDefaultsSchema> & TopicOptionalDefaultsRelations

export const TopicOptionalDefaultsWithRelationsSchema: z.ZodType<TopicOptionalDefaultsWithRelations> = TopicOptionalDefaultsSchema.merge(z.object({
  user: z.lazy(() => UserOptionalDefaultsWithRelationsSchema),
  area: z.lazy(() => AreaOptionalDefaultsWithRelationsSchema),
  messages: z.lazy(() => MessageOptionalDefaultsWithRelationsSchema).array(),
  tags: z.lazy(() => TagOptionalDefaultsWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// TOPIC PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type TopicPartialRelations = {
  user?: UserPartialWithRelations;
  area?: AreaPartialWithRelations;
  messages?: MessagePartialWithRelations[];
  tags?: TagPartialWithRelations[];
};

export type TopicPartialWithRelations = z.infer<typeof TopicPartialSchema> & TopicPartialRelations

export const TopicPartialWithRelationsSchema: z.ZodType<TopicPartialWithRelations> = TopicPartialSchema.merge(z.object({
  user: z.lazy(() => UserPartialWithRelationsSchema),
  area: z.lazy(() => AreaPartialWithRelationsSchema),
  messages: z.lazy(() => MessagePartialWithRelationsSchema).array(),
  tags: z.lazy(() => TagPartialWithRelationsSchema).array(),
})).partial()

export type TopicOptionalDefaultsWithPartialRelations = z.infer<typeof TopicOptionalDefaultsSchema> & TopicPartialRelations

export const TopicOptionalDefaultsWithPartialRelationsSchema: z.ZodType<TopicOptionalDefaultsWithPartialRelations> = TopicOptionalDefaultsSchema.merge(z.object({
  user: z.lazy(() => UserPartialWithRelationsSchema),
  area: z.lazy(() => AreaPartialWithRelationsSchema),
  messages: z.lazy(() => MessagePartialWithRelationsSchema).array(),
  tags: z.lazy(() => TagPartialWithRelationsSchema).array(),
}).partial())

export type TopicWithPartialRelations = z.infer<typeof TopicSchema> & TopicPartialRelations

export const TopicWithPartialRelationsSchema: z.ZodType<TopicWithPartialRelations> = TopicSchema.merge(z.object({
  user: z.lazy(() => UserPartialWithRelationsSchema),
  area: z.lazy(() => AreaPartialWithRelationsSchema),
  messages: z.lazy(() => MessagePartialWithRelationsSchema).array(),
  tags: z.lazy(() => TagPartialWithRelationsSchema).array(),
}).partial())

export default TopicSchema;
