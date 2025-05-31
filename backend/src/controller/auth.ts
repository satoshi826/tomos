import type { RouteHandler } from '@hono/zod-openapi'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { decode, sign, verify } from 'hono/jwt'
import { DEFAULT_COLOR } from 'shared/constants'
import { ENV } from 'src/env'
import type { loginRoute, logoutRoute, tokenRefreshRoute } from 'src/routes/auth'
import { type IdToken, type Prisma, generateUniqueId, getOAuthToken, prismaClient } from './utils'

const access_token_expire_in = 60 * 60 // 1 hour
const refresh_token_expire_in = 60 * 60 * 24 * 7 // 1 week

export type AccessToken = {
  exp: number
  id: string
}

export type RefreshToken = {
  exp: number
  id: string
}

const createUser = async (prisma: Prisma, token: IdToken) => {
  const isIdTaken = async (userId: string) => {
    const existUser = await prisma.user.findUnique({ where: { userId } })
    return !!existUser
  }
  const userId = await generateUniqueId(isIdTaken)
  const user = await prisma.user.create({ data: { googleId: token.sub, name: token.name, color: DEFAULT_COLOR, userId } })
  console.log('User created:', userId)
  return user
}

const currentUNIX = () => Math.floor(Date.now() / 1000)

const tokenExpiresAt = (type: 'access' | 'refresh') => {
  return currentUNIX() + (type === 'access' ? access_token_expire_in : refresh_token_expire_in)
}

const createAccessToken = async (id: string) => {
  const access_token_payload: AccessToken = { exp: tokenExpiresAt('access'), id }
  return sign(access_token_payload, ENV.TOKEN_SECRET)
}

//-----------------------------------------------------------------------------

export const loginController: RouteHandler<typeof loginRoute> = async (c) => {
  const { code, code_verifier } = await c.req.valid('json')
  const oauth = await getOAuthToken(code, code_verifier)
  const prisma = prismaClient()

  let user = await prisma.user.findUnique({ where: { googleId: oauth.id_token.sub } })
  if (!user) user = await createUser(prisma, oauth.id_token)

  const access_token = createAccessToken(user.id)

  const refresh_token_exp = tokenExpiresAt('refresh')
  const refresh_token_payload: RefreshToken = {
    exp: refresh_token_exp,
    id: user.id,
  }
  const refresh_token = sign(refresh_token_payload, ENV.TOKEN_SECRET)

  setCookie(c, 'refresh_token', await refresh_token, {
    sameSite: 'None',
    secure: true,
    httpOnly: true,
    maxAge: refresh_token_expire_in,
    expires: new Date(refresh_token_exp * 1000),
  })

  return c.json(
    {
      access_token: await access_token,
      expires_at: tokenExpiresAt('access'),
      profile: user.userId,
    },
    200,
  )
}

export const logoutController: RouteHandler<typeof logoutRoute> = async (c) => {
  deleteCookie(c, 'refresh_token', {
    sameSite: 'None',
    secure: true,
    httpOnly: true,
  })
  return c.json({ code: 200 as const, message: 'Logged out successfully' }, 200)
}

export const tokenRefreshController: RouteHandler<typeof tokenRefreshRoute> = async (c) => {
  const refresh_token_raw = getCookie(c, 'refresh_token')
  if (!refresh_token_raw) return c.json({ code: 400 as const, message: 'refresh token not found' }, 400)
  const { exp } = await verify(refresh_token_raw, ENV.TOKEN_SECRET)
  if (!exp || exp < Math.floor(Date.now() / 1000)) return c.json({ code: 400 as const, message: 'refresh token expired' }, 400)
  const { payload: refresh_token } = decode(refresh_token_raw)
  const access_token = createAccessToken((refresh_token as RefreshToken).id)
  return c.json(
    {
      access_token: await access_token,
      expires_at: tokenExpiresAt('access'),
    },
    200,
  )
}
