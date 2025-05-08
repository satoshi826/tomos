import { createRoute, z } from '@hono/zod-openapi'
import { AreaSchema, AreaWithTopicsSchema } from 'shared/types'
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
