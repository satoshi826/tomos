import { swaggerUI } from '@hono/swagger-ui'
import { getCookie, setCookie } from 'hono/cookie'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { DEFAULT_COLOR } from 'shared/constants'
import { truncateAreaPosition, truncateTopicPosition } from 'shared/functions'
import { authCallbackScript, frontEndUrl, getToken, getTokenInfo, refresh_token_expires_in, tokenRoute } from './auth'
import { areaGetRoute, areaPostRoute, messagePostRoute, profileGetRoute, topicGetRoute, topicPostRoute } from './route'
import { seed } from './seed'
import { generateUniqueId, handleError, hono, prismaClient } from './utils'

const app = hono()

app
  .use(logger())
  .use(cors({ origin: frontEndUrl, credentials: true }))
  .onError(handleError)
  .get('/', (c) => c.text('Hello Tomos!'))
  .get('/seed', (c) => {
    seed(prismaClient(c.env.DB))
    return c.text('Seeding database...')
  })
  .get('/auth/callback', async (c) => c.html(authCallbackScript))

app.doc31('/doc', { openapi: '3.1.0', info: { version: '0.0.0', title: 'Tomos API' } }).get('/ui', swaggerUI({ url: '/doc' }))

const route = app
  .openapi(areaGetRoute, async (c) => {
    const prisma = prismaClient(c.env.DB)
    const { x, y } = await c.req.valid('query')
    const area = await prisma.area.findUnique({ where: { x_y: { x, y } }, include: { topics: true } })
    if (!area) return c.json({ code: 404 as const, message: 'Area not found' }, 404)
    return c.json(area, 200)
  })
  .openapi(areaPostRoute, async (c) => {
    const prisma = prismaClient(c.env.DB)
    const { x, y, name } = await c.req.valid('json')
    const area = await prisma.area.create({ data: { x, y, name } })
    return c.json(area, 200)
  })
  .openapi(topicGetRoute, async (c) => {
    const prisma = prismaClient(c.env.DB)
    const ck = getCookie(c, 'refresh_token')
    console.log(ck)
    const { x, y } = await c.req.valid('query')
    const topic = await prisma.topic.findUnique({ where: { x_y: { x, y } }, include: { messages: true } })
    if (!topic) return c.json({ code: 404 as const, message: 'Topic not found' }, 404)
    return c.json(topic, 200)
  })
  .openapi(topicPostRoute, async (c) => {
    const prisma = prismaClient(c.env.DB)
    const { x, y, title, userId } = await c.req.valid('json')
    const areaPosition = truncateAreaPosition({ x, y })
    const areaId = await prisma.area.findUnique({ where: { x_y: areaPosition }, select: { id: true } }).then((a) => a?.id)
    if (!areaId) return c.json({ code: 400 as const, message: 'Area not found' }, 400)
    const topic = await prisma.topic.create({ data: { x, y, title, userId, areaId } })
    return c.json(topic, 200)
  })
  .openapi(messagePostRoute, async (c) => {
    const prisma = prismaClient(c.env.DB)
    const { x, y, userId, content } = await c.req.valid('json')
    const topicPosition = truncateTopicPosition({ x, y })
    const topicId = await prisma.topic.findUnique({ where: { x_y: topicPosition }, select: { id: true } }).then((t) => t?.id)
    if (!topicId) return c.json({ code: 400 as const, message: 'Topic not found' }, 400)
    const topic = await prisma.message.create({ data: { x, y, content, userId, topicId } })
    return c.json(topic, 200)
  })
  .openapi(profileGetRoute, async (c) => {
    const access_token = c.req.header('Authorization')?.split(' ')[1]
    if (!access_token) return c.json({ id: 'hoge' }, 200)
    const prisma = prismaClient(c.env.DB)
    const profile = await getTokenInfo(access_token)
    const user = await prisma.user.findUnique({ where: { googleId: profile.sub } })
    if (!user) return c.json({ id: 'user_not_found' }, 200)
    return c.json({ id: user.userId, name: user.name, color: user.color }, 200)
  })
  .openapi(tokenRoute, async (c) => {
    const { code, code_verifier } = await c.req.valid('json')
    const token = await getToken(code, code_verifier)
    const prisma = prismaClient(c.env.DB)
    const user = await prisma.user.findUnique({ where: { googleId: token.id_token.sub } })
    if (!user) {
      const isIdTaken = async (userId: string) => {
        const existUser = await prisma.user.findUnique({ where: { userId } })
        return !!existUser
      }
      const userId = await generateUniqueId(isIdTaken)
      await prismaClient(c.env.DB).user.create({
        data: { googleId: token.id_token.sub, name: token.id_token.name, color: DEFAULT_COLOR, userId },
      })
      console.log('User created:', userId)
    }
    setCookie(c, 'refresh_token', token.refresh_token, {
      sameSite: 'None',
      secure: true,
      httpOnly: true,
      maxAge: refresh_token_expires_in - 60 * 60 * 24,
    })
    return c.json(
      {
        access_token: token.access_token,
        expires_in: token.expires_in,
        profile: token.id_token,
      },
      200,
    )
  })

export type HONO_API = typeof route

export default app
