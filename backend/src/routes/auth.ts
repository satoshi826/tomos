import { createRoute, z } from '@hono/zod-openapi'
import { _200, _400, _jsonContent } from './utils'

export const loginRoute = createRoute({
  method: 'post',
  path: '/auth/login',
  request: {
    body: _jsonContent(
      z.object({
        code: z.string(),
        code_verifier: z.string(),
      }),
    ),
  },
  responses: {
    ..._200(z.object({ access_token: z.string(), expires_at: z.number(), profile: z.object({}) }), 'Returns an access token'),
  },
})

export const logoutRoute = createRoute({
  method: 'post',
  path: '/auth/logout',
  responses: {
    ..._200(z.object({ message: z.string() }), 'Logout successful'),
  },
})

export const tokenRefreshRoute = createRoute({
  method: 'post',
  path: '/auth/refresh',
  responses: {
    ..._200(z.object({ access_token: z.string(), expires_at: z.number() }), 'Refresh an access token'),
    ..._400(),
  },
})
