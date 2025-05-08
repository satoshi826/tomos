import { createRoute, z } from '@hono/zod-openapi'
import { TopicSchema, TopicWithMessagesSchema } from 'shared/types'
import { _200, _400, _404, _jsonContent } from './utils'

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
    ..._404(),
  },
})
