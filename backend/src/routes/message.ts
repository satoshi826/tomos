import { createRoute, z } from '@hono/zod-openapi'
import { MessageSchema } from 'shared/types'
import { _200, _400, _404, _jsonContent } from './utils'

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
