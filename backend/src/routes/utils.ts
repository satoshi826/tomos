import { z } from '@hono/zod-openapi'

export const _jsonContent = <T>(schema: T) => ({
  content: { 'application/json': { schema } },
})

export const _200 = <T>(schema: T, desc = '') => ({
  200: {
    ..._jsonContent(schema),
    description: desc,
  },
})

export const _400 = (desc = 'Bad Request') => ({
  400: {
    ..._jsonContent(
      z.object({
        code: z.literal(400).openapi({ example: 400 }),
        message: z.string().openapi({ example: desc }),
      }),
    ),
    description: desc,
  },
})

export const _404 = (desc = 'Not Found') => ({
  404: {
    ..._jsonContent(
      z.object({
        code: z.literal(404).openapi({ example: 404 }),
        message: z.string().openapi({ example: desc }),
      }),
    ),
    description: desc,
  },
})
