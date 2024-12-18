import { swaggerUI } from '@hono/swagger-ui'
import { hc } from 'hono/client'
import { logger } from 'hono/logger'
import { areaGetRoute, areaPostRoute } from './route'
import { handleError, hono, prismaClient } from './utils'

const app = hono()

app.use(logger())
app.onError(handleError)
app.doc31('/doc', { openapi: '3.1.0', info: { version: '0.0.0', title: 'Tomos API' } })
app.get('/ui', swaggerUI({ url: '/doc' }))
app.get('/', (c) => c.text('Hello Tomos!'))

app.openapi(areaGetRoute, async (c) => {
  const prisma = prismaClient(c.env.DB)
  const { x, y } = await c.req.valid('query')
  const area = await prisma.area.findUnique({ where: { x_y: { x, y } } })
  if (!area) return c.json({ code: 404 as const, message: 'Area not found' }, 404)
  return c.json(area, 200)
})

app.openapi(areaPostRoute, async (c) => {
  const prisma = prismaClient(c.env.DB)
  const { x, y, name } = await c.req.valid('json')
  const area = await prisma.area.create({ data: { x, y, name } })
  return c.json(area, 200)
})

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

// export default app
