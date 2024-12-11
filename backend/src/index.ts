import { OpenAPIHono } from '@hono/zod-openapi'
import { logger } from 'hono/logger'
import { areaRoute } from './route'
import { prismaClient } from './utils'

const app = new OpenAPIHono<{ Bindings: { DB: D1Database } }>()
app.use(logger())
app.get('/', (c) => c.text('Hello 🔥'))

app.openapi(
  areaRoute,
  async (c) => {
    const prisma = prismaClient(c.env.DB)
    const { x, y } = await c.req.valid('param')
    const area = await prisma.area.findUnique({
      where: { x_y: { x, y } },
    })
    if (!area) {
      return c.json({ code: 404, message: 'Area not found' }, 404)
    }
    return c.json(area)
  },
  (result, c) => {
    if (!result.success) {
      return c.json(
        {
          code: 400,
          message: 'Validation Error',
        },
        400,
      )
    }
  },
)

// app.post('/topics', async (c) => {
//   const prisma = prismaClient(c.env.DB)
//   const { title, userId, x, y, areaId } = await c.req.json<Pick<Topic, 'title' | 'userId' | 'x' | 'y' | 'areaId'>>()
//   const topic = await prisma.topic.create({
//     data: {
//       title,
//       userId,
//       areaId,
//       x,
//       y,
//     },
//   })
//   return c.json(topic)
// })

// app.post('/messages', async (c) => {
//   const prisma = prismaClient(c.env.DB)
//   const { userId, content, x, y, topicId } = await c.req.json<Pick<Message, 'userId' | 'content' | 'x' | 'y' | 'topicId'>>()
//   const message = await prisma.message.create({
//     data: {
//       content,
//       userId,
//       topicId,
//       x,
//       y,
//     },
//   })
//   return c.json(message)
// })

export default app
