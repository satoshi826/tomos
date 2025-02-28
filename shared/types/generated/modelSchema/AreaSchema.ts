import { z } from 'zod';
import { TopicWithRelationsSchema, TopicPartialWithRelationsSchema, TopicOptionalDefaultsWithRelationsSchema } from './TopicSchema'
import type { TopicWithRelations, TopicPartialWithRelations, TopicOptionalDefaultsWithRelations } from './TopicSchema'

/////////////////////////////////////////
// AREA SCHEMA
/////////////////////////////////////////

export const AreaSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1).max(64).nullable(),
  x: z.number().int().nonnegative().multipleOf(100),
  y: z.number().int().nonnegative().multipleOf(100),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Area = z.infer<typeof AreaSchema>

/////////////////////////////////////////
// AREA PARTIAL SCHEMA
/////////////////////////////////////////

export const AreaPartialSchema = AreaSchema.partial()

export type AreaPartial = z.infer<typeof AreaPartialSchema>

/////////////////////////////////////////
// AREA OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const AreaOptionalDefaultsSchema = AreaSchema.merge(z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type AreaOptionalDefaults = z.infer<typeof AreaOptionalDefaultsSchema>

/////////////////////////////////////////
// AREA RELATION SCHEMA
/////////////////////////////////////////

export type AreaRelations = {
  topics: TopicWithRelations[];
};

export type AreaWithRelations = z.infer<typeof AreaSchema> & AreaRelations

export const AreaWithRelationsSchema: z.ZodType<AreaWithRelations> = AreaSchema.merge(z.object({
  topics: z.lazy(() => TopicWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// AREA OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type AreaOptionalDefaultsRelations = {
  topics: TopicOptionalDefaultsWithRelations[];
};

export type AreaOptionalDefaultsWithRelations = z.infer<typeof AreaOptionalDefaultsSchema> & AreaOptionalDefaultsRelations

export const AreaOptionalDefaultsWithRelationsSchema: z.ZodType<AreaOptionalDefaultsWithRelations> = AreaOptionalDefaultsSchema.merge(z.object({
  topics: z.lazy(() => TopicOptionalDefaultsWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// AREA PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type AreaPartialRelations = {
  topics?: TopicPartialWithRelations[];
};

export type AreaPartialWithRelations = z.infer<typeof AreaPartialSchema> & AreaPartialRelations

export const AreaPartialWithRelationsSchema: z.ZodType<AreaPartialWithRelations> = AreaPartialSchema.merge(z.object({
  topics: z.lazy(() => TopicPartialWithRelationsSchema).array(),
})).partial()

export type AreaOptionalDefaultsWithPartialRelations = z.infer<typeof AreaOptionalDefaultsSchema> & AreaPartialRelations

export const AreaOptionalDefaultsWithPartialRelationsSchema: z.ZodType<AreaOptionalDefaultsWithPartialRelations> = AreaOptionalDefaultsSchema.merge(z.object({
  topics: z.lazy(() => TopicPartialWithRelationsSchema).array(),
}).partial())

export type AreaWithPartialRelations = z.infer<typeof AreaSchema> & AreaPartialRelations

export const AreaWithPartialRelationsSchema: z.ZodType<AreaWithPartialRelations> = AreaSchema.merge(z.object({
  topics: z.lazy(() => TopicPartialWithRelationsSchema).array(),
}).partial())

export default AreaSchema;
