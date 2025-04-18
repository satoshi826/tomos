import { createRoute, z } from '@hono/zod-openapi'
import { AreaSchema, AreaWithTopicsSchema, MessageSchema, TopicSchema, TopicWithMessagesSchema, UserSchema } from 'shared/types'
import { _200, _400, _404, _jsonContent } from './utils'

export const areaGetRoute = createRoute({
  method: 'get',
  path: '/areas',
  request: {
    query: z
      .object({
        x: z.string().default('0').pipe(z.coerce.number().nonnegative().multipleOf(100)),
        y: z.string().default('0').pipe(z.coerce.number().nonnegative().multipleOf(100)),
      })
      .openapi('areaParam'),
  },
  responses: {
    ..._200(AreaWithTopicsSchema, 'Returns a single area by x y'),
    ..._400(),
    ..._404(),
  },
})

export const areaPostRoute = createRoute({
  method: 'post',
  path: '/areas',
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
        x: z.string().default('0').pipe(z.coerce.number().nonnegative().multipleOf(10)),
        y: z.string().default('0').pipe(z.coerce.number().nonnegative().multipleOf(10)),
      })
      .openapi('areaParam'),
  },
  responses: {
    ..._200(TopicWithMessagesSchema, 'Returns all topics in a given area'),
    ..._400(),
    ..._404(),
  },
})

export const topicPostRoute = createRoute({
  method: 'post',
  path: '/topics',
  request: {
    body: _jsonContent(
      TopicSchema.pick({
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

export const messagePostRoute = createRoute({
  method: 'post',
  path: '/messages',
  request: {
    body: _jsonContent(
      MessageSchema.pick({
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

export const profileGetRoute = createRoute({
  method: 'get',
  path: '/profile',
  request: {},
  responses: {
    ..._200(UserSchema.pick({ id: true }), 'Returns user profile'),
    ..._400(),
  },
})
