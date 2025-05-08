import type { RouteHandler } from '@hono/zod-openapi'
import type { profileGetRoute } from 'src/routes/profile'
import { accessTokenFromHeader, getTokenInfo, prismaClient, remoteAddress } from './utils'

export const profileGetController: RouteHandler<typeof profileGetRoute> = async (c) => {
  const access_token = accessTokenFromHeader(c)
  const address = remoteAddress(c)
  console.log(address)
  if (!access_token) return c.json({ id: 'hoge' }, 200)
  const prisma = prismaClient()
  const profile = await getTokenInfo(access_token)
  const user = await prisma.user.findUnique({ where: { googleId: profile.sub } })
  if (!user) return c.json({ id: 'user_not_found' }, 200)
  return c.json({ id: user.userId, name: user.name, color: user.color }, 200)
}
