import { createRoute } from '@hono/zod-openapi'
import { UserSchema } from 'shared/types'
import { _200, _400, _404, _jsonContent } from './utils'

export const profileGetRoute = createRoute({
  method: 'get',
  path: '/profile',
  request: {},
  responses: {
    ..._200(UserSchema.pick({ id: true }).strict(), 'Returns user profile'),
    ..._400(),
  },
})
