import { swaggerUI } from '@hono/swagger-ui'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { areaGetController, areaPostController } from './controller/area'
import { getTokenController } from './controller/auth'
import { messagePostController } from './controller/message'
import { profileGetController } from './controller/profile'
import { topicGetController, topicPostController } from './controller/topic'
import { frontEndUrl, prismaClient } from './controller/utils'
import { areaGetRoute, areaPostRoute } from './routes/area'
import { getTokenRoute } from './routes/auth'
import { messagePostRoute } from './routes/message'
import { profileGetRoute } from './routes/profile'
import { topicGetRoute, topicPostRoute } from './routes/topic'
import { seed } from './seed'
import { handleError, hono } from './utils'

const authCallbackScript = /* html */ `
  <script>
    const urlParams = new URLSearchParams(window.location.search)
    window.opener.postMessage({ code: urlParams.get("code") }, '${frontEndUrl}')
  </script>
`

const app = hono()

app
  .use(logger())
  .use(cors({ origin: frontEndUrl, credentials: true }))
  .onError(handleError)
  .get('/', (c) => c.text('Hello Tomos!'))
  .get('/seed', (c) => {
    seed(prismaClient())
    return c.text('Seeding database...')
  })
  .get('/auth/callback', async (c) => c.html(authCallbackScript))
app.doc31('/doc', { openapi: '3.1.0', info: { version: '0.0.0', title: 'Tomos API' } }).get('/ui', swaggerUI({ url: '/doc' }))

const route = app
  .openapi(areaGetRoute, areaGetController)
  .openapi(areaPostRoute, areaPostController)
  .openapi(topicGetRoute, topicGetController)
  .openapi(topicPostRoute, topicPostController)
  .openapi(messagePostRoute, messagePostController)
  .openapi(profileGetRoute, profileGetController)
  .openapi(getTokenRoute, getTokenController)

export type HONO_API = typeof route

export default app
