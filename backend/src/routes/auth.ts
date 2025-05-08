import { createRoute, z } from '@hono/zod-openapi'
import { _200, _400, _jsonContent } from './utils'

export const getTokenRoute = createRoute({
  method: 'post',
  path: '/auth/token/google',
  request: {
    body: _jsonContent(
      z.object({
        code: z.string(),
        code_verifier: z.string(),
      }),
    ),
  },
  responses: {
    ..._200(z.object({ access_token: z.string(), expires_in: z.number(), profile: z.object({}) }), 'Returns an access token'),
  },
})

export const tokenRefreshRoute = createRoute({
  method: 'get',
  path: '/auth/token/google/refresh',
  responses: {
    ..._200(z.object({ access_token: z.string(), expires_in: z.number() }), 'Refresh an access token'),
  },
})
