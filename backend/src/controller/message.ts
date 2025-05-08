import type { RouteHandler } from '@hono/zod-openapi'
import { truncateTopicPosition } from 'shared/functions'
import type { messagePostRoute } from 'src/routes/message'
import { prismaClient } from './utils'

export const messagePostController: RouteHandler<typeof messagePostRoute> = async (c) => {
  const prisma = prismaClient()
  const { x, y, userId, content } = await c.req.valid('json')
  const topicPosition = truncateTopicPosition({ x, y })
  const topicId = await prisma.topic.findUnique({ where: { x_y: topicPosition }, select: { id: true } }).then((t) => t?.id)
  if (!topicId) return c.json({ code: 400 as const, message: 'Topic not found' }, 400)
  const topic = await prisma.message.create({ data: { x, y, content, userId, topicId } })
  return c.json(topic, 200)
}
