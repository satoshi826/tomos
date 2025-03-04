import { swaggerUI } from '@hono/swagger-ui'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { truncateAreaPosition } from 'shared/functions'
import { areaGetRoute, areaPostRoute, topicGetRoute, topicPostRoute } from './route'
import { seed } from './seed'
import { handleError, hono, prismaClient } from './utils'

const app = hono()

app
  .use(logger())
  .use(cors())
  .onError(handleError)
  .get('/', (c) => c.text('Hello Tomos!'))
  .get('/seed', (c) => {
    seed(prismaClient(c.env.DB))
    return c.text('Seeding database...')
  })

app.doc31('/doc', { openapi: '3.1.0', info: { version: '0.0.0', title: 'Tomos API' } }).get('/ui', swaggerUI({ url: '/doc' }))

const route = app
  .openapi(areaGetRoute, async (c) => {
    const prisma = prismaClient(c.env.DB)
    const { x, y } = await c.req.valid('query')
    const area = await prisma.area.findUnique({ where: { x_y: { x, y } }, include: { topics: true } })
    if (!area) return c.json({ code: 404 as const, message: 'Area not found' }, 404)
    return c.json(area, 200)
  })
  .openapi(areaPostRoute, async (c) => {
    const prisma = prismaClient(c.env.DB)
    const { x, y, name } = await c.req.valid('json')
    const area = await prisma.area.create({ data: { x, y, name } })
    return c.json(area, 200)
  })
  .openapi(topicGetRoute, async (c) => {
    const prisma = prismaClient(c.env.DB)
    const { x, y } = await c.req.valid('query')
    const topic = await prisma.topic.findUnique({ where: { x_y: { x, y } }, include: { messages: true } })
    if (!topic) return c.json({ code: 404 as const, message: 'Topic not found' }, 404)
    return c.json(topic, 200)
  })
  .openapi(topicPostRoute, async (c) => {
    const prisma = prismaClient(c.env.DB)
    const { x, y, title, userId } = await c.req.valid('json')
    const areaPosition = truncateAreaPosition({ x, y })
    const areaId = await prisma.area.findUnique({ where: { x_y: areaPosition }, select: { id: true } }).then((area) => area?.id)
    if (!areaId) return c.json({ code: 400 as const, message: 'Area not found' }, 400)
    const topic = await prisma.topic.create({ data: { x, y, title, userId, areaId } })
    return c.json(topic, 200)
  })

export type HONO_API = typeof route

// // GET: Fetch all topics in a given area
// app.openapi(topicGetRoute, async (c) => {
//   const prisma = prismaClient(c.env.DB)
//   const { areaId } = await c.req.valid('query')
//   const topics = await prisma.topic.findMany({
//     where: { areaId: Number(areaId) },
//     include: { user: true, tags: true },
//   })
//   return c.json(topics, 200)
// })

// // POST: Create a new topic in a specific area
// app.openapi(topicPostRoute, async (c) => {
//   const prisma = prismaClient(c.env.DB)
//   const { areaId, userId, title, x, y } = await c.req.valid('json')
//   const topic = await prisma.topic.create({
//     data: {
//       areaId: Number(areaId),
//       userId,
//       title,
//       x,
//       y,
//     },
//   })
//   return c.json(topic, 200)
// })

// // GET: Fetch all messages for a specific topic
// app.openapi(messageGetRoute, async (c) => {
//   const prisma = prismaClient(c.env.DB)
//   const { topicId } = await c.req.valid('query')
//   const messages = await prisma.message.findMany({
//     where: { topicId: Number(topicId) },
//     include: { user: true },
//   })
//   return c.json(messages, 200)
// })

// // POST: Create a new message under a specific topic
// app.openapi(messagePostRoute, async (c) => {
//   const prisma = prismaClient(c.env.DB)
//   const { topicId, userId, content, x, y } = await c.req.valid('json')
//   const message = await prisma.message.create({
//     data: {
//       topicId: Number(topicId),
//       userId,
//       content,
//       x,
//       y,
//     },
//   })
//   return c.json(message, 200)
// })

export default app
