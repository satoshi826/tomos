import type { RouteHandler } from '@hono/zod-openapi'
import { setCookie } from 'hono/cookie'
import { DEFAULT_COLOR } from 'shared/constants'
import type { getTokenRoute } from 'src/routes/auth'
import { generateUniqueId, getToken, prismaClient, refresh_token_expires_in } from './utils'

export const getTokenController: RouteHandler<typeof getTokenRoute> = async (c) => {
  const { code, code_verifier } = await c.req.valid('json')
  const token = await getToken(code, code_verifier)
  const prisma = prismaClient()
  const user = await prisma.user.findUnique({ where: { googleId: token.id_token.sub } })
  if (!user) {
    const isIdTaken = async (userId: string) => {
      const existUser = await prisma.user.findUnique({ where: { userId } })
      return !!existUser
    }
    const userId = await generateUniqueId(isIdTaken)
    await prisma.user.create({
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
}
