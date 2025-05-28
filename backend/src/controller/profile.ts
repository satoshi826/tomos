import type { RouteHandler } from '@hono/zod-openapi'
import type { Context } from 'hono'
import type { profileGetRoute } from 'src/routes/profile'
import { accessTokenFromHeader, generateAnonymousId, prismaClient } from './utils'

const guestProfile = async (c: Context) => c.json({ id: await generateAnonymousId(c), guest: true }, 200)

export const profileGetController: RouteHandler<typeof profileGetRoute> = async (c) => {
  const access_token = await accessTokenFromHeader(c)
  if (!access_token) return await guestProfile(c)
  const prisma = prismaClient()
  const user = await prisma.user.findUnique({ where: { id: access_token.userId } })
  if (!user) return await guestProfile(c)
  return c.json({ id: user.userId, name: user.name, color: user.color, guest: false }, 200)
}
