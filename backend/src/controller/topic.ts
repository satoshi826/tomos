import type { RouteHandler } from '@hono/zod-openapi'
import { truncateAreaPosition } from 'shared/functions'
import type { topicGetRoute, topicPostRoute } from '../routes/topic'
import { getUserId, prismaClient } from './utils'

export const topicGetController: RouteHandler<typeof topicGetRoute> = async (c) => {
  const prisma = prismaClient()
  const { x, y } = await c.req.valid('query')
  const topic = await prisma.topic.findUnique({ where: { x_y: { x, y } }, include: { messages: true } })
  if (!topic) return c.json({ code: 404 as const, message: 'Topic not found' }, 404)
  return c.json(topic, 200)
}

export const topicPostController: RouteHandler<typeof topicPostRoute> = async (c) => {
  const prisma = prismaClient()
  const { x, y, title } = await c.req.valid('json')
  const userId = await getUserId(c)
  const areaPosition = truncateAreaPosition({ x, y })
  const areaId = await prisma.area.findUnique({ where: { x_y: areaPosition }, select: { id: true } }).then((a) => a?.id)
  if (!areaId) return c.json({ code: 400 as const, message: 'Area not found' }, 400)
  const topic = await prisma.topic.create({ data: { x, y, title, userId, areaId } })
  return c.json(topic, 200)
}
