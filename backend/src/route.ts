import { createRoute, z } from '@hono/zod-openapi'
import { AreaSchema } from '../prisma/generated/zod/modelSchema/AreaSchema'
import MessageSchema from '../prisma/generated/zod/modelSchema/MessageSchema'
import TopicSchema from '../prisma/generated/zod/modelSchema/TopicSchema'
import { _200, _400, _404, _jsonContent } from './utils'

export const areaGetRoute = createRoute({
  method: 'get',
  path: '/area',
  request: {
    query: z
      .object({
        x: z.string().default('0').pipe(z.coerce.number().nonnegative().multipleOf(100)),
        y: z.string().default('0').pipe(z.coerce.number().nonnegative().multipleOf(100)),
      })
      .openapi('areaParam'),
  },
  responses: {
    ..._200(AreaSchema, 'Returns a single area by x y'),
    ..._400(),
    ..._404(),
  },
})

export const areaPostRoute = createRoute({
  method: 'post',
  path: '/area',
  request: {
    body: _jsonContent(AreaSchema.pick({ name: true, x: true, y: true })),
  },
  responses: {
    ..._200(AreaSchema, 'Successfully created area'),
  },
})

export const topicGetRoute = createRoute({
  method: 'get',
  path: '/topics',
  request: {
    query: z
      .object({
        areaId: z.string().default('0').pipe(z.coerce.number().nonnegative().multipleOf(10)),
      })
      .openapi('topicQueryParam'),
  },
  responses: {
    ..._200(z.array(TopicSchema), 'Returns all topics in a given area'),
    ..._400(),
  },
})

export const topicPostRoute = createRoute({
  method: 'post',
  path: '/topics',
  request: {
    body: _jsonContent(
      TopicSchema.pick({
        areaId: true,
        userId: true,
        title: true,
        x: true,
        y: true,
      }),
    ),
  },
  responses: {
    ..._200(TopicSchema, 'Successfully created topic'),
    ..._400(),
  },
})

export const messageGetRoute = createRoute({
  method: 'get',
  path: '/messages',
  request: {
    query: z
      .object({
        topicId: z.string().default('0').pipe(z.coerce.number().positive()),
      })
      .openapi('messageQueryParam'),
  },
  responses: {
    ..._200(z.array(MessageSchema), 'Returns all messages for a specific topic'),
    ..._400(),
  },
})

// POST: Create a new message
export const messagePostRoute = createRoute({
  method: 'post',
  path: '/messages',
  request: {
    body: _jsonContent(
      MessageSchema.pick({
        topicId: true,
        userId: true,
        content: true,
        x: true,
        y: true,
      }),
    ),
  },
  responses: {
    ..._200(MessageSchema, 'Successfully created message'),
    ..._400(),
  },
})
