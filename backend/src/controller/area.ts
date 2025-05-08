import type { RouteHandler } from '@hono/zod-openapi'
import type { areaGetRoute, areaPostRoute } from 'src/routes/area'
import { prismaClient } from './utils'

export const areaGetController: RouteHandler<typeof areaGetRoute> = async (c) => {
  const prisma = prismaClient()
  const { x, y } = await c.req.valid('query')
  const area = await prisma.area.findUnique({ where: { x_y: { x, y } }, include: { topics: true } })
  if (!area) return c.json({ code: 404 as const, message: 'Area not found' }, 404)
  return c.json(area, 200)
}

export const areaPostController: RouteHandler<typeof areaPostRoute> = async (c) => {
  const prisma = prismaClient()
  const { x, y, name } = await c.req.valid('json')
  const area = await prisma.area.create({ data: { x, y, name } })
  return c.json(area, 200)
}
