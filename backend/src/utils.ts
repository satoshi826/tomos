import { OpenAPIHono } from '@hono/zod-openapi'
import { Prisma } from '@prisma/client'
import type { Context } from 'hono'

export const hono = () =>
  new OpenAPIHono({
    defaultHook: (result, c) => {
      if (!result.success) {
        console.error(result.error.issues)
        return c.json(
          {
            code: 400,
            message: 'Error',
            issues: result.error.issues,
          },
          400,
        )
      }
    },
  })

export const handleError = (err: Error, c: Context): Response => {
  console.error(err)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') return c.json({ code: 400 as const, message: 'target already exists.' }, 400)
  }
  return c.json({ code: 500, message: 'Internal Server Error' }, 500)
}
