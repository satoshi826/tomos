import { z } from '@hono/zod-openapi'

export const ErrorSchema = z.object({
  code: z.number().openapi({
    example: 400,
  }),
  message: z.string().openapi({
    example: 'Bad Request',
  }),
})

export const AreaParmSchema = z.object({
  x: z.number(),
  y: z.number(),
})
