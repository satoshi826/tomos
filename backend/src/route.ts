import { createRoute } from '@hono/zod-openapi'
import { AreaSchema } from '../prisma/generated/zod/modelSchema/AreaSchema'
import { AreaParmSchema, ErrorSchema } from './schema'

export const areaRoute = createRoute({
  method: 'get',
  path: '/area',
  request: {
    params: AreaParmSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: AreaSchema,
        },
      },
      description: 'Returns a single area by x y',
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
      description: 'Bad Request',
    },
    404: {
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
      description: 'Not Found',
    },
  },
})
