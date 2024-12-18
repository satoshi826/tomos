import { z } from 'zod';
import { MessageWithRelationsSchema, MessagePartialWithRelationsSchema, MessageOptionalDefaultsWithRelationsSchema } from './MessageSchema'
import type { MessageWithRelations, MessagePartialWithRelations, MessageOptionalDefaultsWithRelations } from './MessageSchema'
import { TopicWithRelationsSchema, TopicPartialWithRelationsSchema, TopicOptionalDefaultsWithRelationsSchema } from './TopicSchema'
import type { TopicWithRelations, TopicPartialWithRelations, TopicOptionalDefaultsWithRelations } from './TopicSchema'

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().max(32),
  createdAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// USER PARTIAL SCHEMA
/////////////////////////////////////////

export const UserPartialSchema = UserSchema.partial()

export type UserPartial = z.infer<typeof UserPartialSchema>

/////////////////////////////////////////
// USER OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const UserOptionalDefaultsSchema = UserSchema.merge(z.object({
  id: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
}))

export type UserOptionalDefaults = z.infer<typeof UserOptionalDefaultsSchema>

/////////////////////////////////////////
// USER RELATION SCHEMA
/////////////////////////////////////////

export type UserRelations = {
  messages: MessageWithRelations[];
  topics: TopicWithRelations[];
};

export type UserWithRelations = z.infer<typeof UserSchema> & UserRelations

export const UserWithRelationsSchema: z.ZodType<UserWithRelations> = UserSchema.merge(z.object({
  messages: z.lazy(() => MessageWithRelationsSchema).array(),
  topics: z.lazy(() => TopicWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// USER OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type UserOptionalDefaultsRelations = {
  messages: MessageOptionalDefaultsWithRelations[];
  topics: TopicOptionalDefaultsWithRelations[];
};

export type UserOptionalDefaultsWithRelations = z.infer<typeof UserOptionalDefaultsSchema> & UserOptionalDefaultsRelations

export const UserOptionalDefaultsWithRelationsSchema: z.ZodType<UserOptionalDefaultsWithRelations> = UserOptionalDefaultsSchema.merge(z.object({
  messages: z.lazy(() => MessageOptionalDefaultsWithRelationsSchema).array(),
  topics: z.lazy(() => TopicOptionalDefaultsWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// USER PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type UserPartialRelations = {
  messages?: MessagePartialWithRelations[];
  topics?: TopicPartialWithRelations[];
};

export type UserPartialWithRelations = z.infer<typeof UserPartialSchema> & UserPartialRelations

export const UserPartialWithRelationsSchema: z.ZodType<UserPartialWithRelations> = UserPartialSchema.merge(z.object({
  messages: z.lazy(() => MessagePartialWithRelationsSchema).array(),
  topics: z.lazy(() => TopicPartialWithRelationsSchema).array(),
})).partial()

export type UserOptionalDefaultsWithPartialRelations = z.infer<typeof UserOptionalDefaultsSchema> & UserPartialRelations

export const UserOptionalDefaultsWithPartialRelationsSchema: z.ZodType<UserOptionalDefaultsWithPartialRelations> = UserOptionalDefaultsSchema.merge(z.object({
  messages: z.lazy(() => MessagePartialWithRelationsSchema).array(),
  topics: z.lazy(() => TopicPartialWithRelationsSchema).array(),
}).partial())

export type UserWithPartialRelations = z.infer<typeof UserSchema> & UserPartialRelations

export const UserWithPartialRelationsSchema: z.ZodType<UserWithPartialRelations> = UserSchema.merge(z.object({
  messages: z.lazy(() => MessagePartialWithRelationsSchema).array(),
  topics: z.lazy(() => TopicPartialWithRelationsSchema).array(),
}).partial())

export default UserSchema;
