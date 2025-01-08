import { OpenAPIHono, z } from '@hono/zod-openapi'
import { PrismaD1 } from '@prisma/adapter-d1'
import { Prisma, PrismaClient } from '@prisma/client'
import type { Context } from 'hono'

export const prismaClient = (db: D1Database) => {
  const adapter = new PrismaD1(db)
  console.log(db)
  return new PrismaClient({ adapter, log: ['query'] })
}

type HonoEnv = { Bindings: { DB: D1Database } }

export const hono = () =>
  new OpenAPIHono<HonoEnv>({
    defaultHook: (result, c) => {
      if (!result.success) {
        console.error(result.error.issues)
        return c.json(
          {
            code: 400,
            message: 'Validation Error',
            issues: result.error.issues,
          },
          400,
        )
      }
    },
  })

export const handleError = (err: Error, c: Context<HonoEnv>): Response => {
  console.error(err)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') return c.json({ code: 400 as const, message: 'target already exists.' }, 400)
  }
  return c.json({ code: 500, message: 'Internal Server Error' }, 500)
}

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
