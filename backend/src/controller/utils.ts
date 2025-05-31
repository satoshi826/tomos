import { PrismaD1 } from '@prisma/adapter-d1'
import { PrismaClient } from '@prisma/client'
import type { Context } from 'hono'
import { decode, verify } from 'hono/jwt'
import { DEFAULT_COLOR } from 'shared/constants'
import { ENV } from 'src/env'
import type { AccessToken } from './auth'

export const BASE62_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

export const prismaClient = () => {
  const D1 = ENV.DB
  const adapter = new PrismaD1(D1)
  return new PrismaClient({ adapter, log: ['query'] })
}

export type Prisma = ReturnType<typeof prismaClient>

//-----------------------------------------------------------------

export const frontEndUrl = ENV.FRONT_END_URL
const client_id = ENV.GOOGLE_OAUTH_CLIENT_ID
const client_secret = ENV.GOOGLE_OAUTH_CLIENT_SECRET
const redirect_uri = ENV.GOOGLE_OAUTH_CALLBACK_URL
const BASE_URL = 'https://oauth2.googleapis.com'
const TOKEN_ENDPOINT = `${BASE_URL}/token`
const expires_in = 60 * 60 // access token expires in 1 hour
export const refresh_token_expires_in = 60 * 60 * 24 * 7 // 1 week

export type IdToken = {
  iss: string
  sub: string
  azp: string
  aud: string
  iat: number
  name: string
}
export const getOAuthToken = async (code: string, code_verifier: string) => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      code_verifier,
      client_id,
      client_secret,
      grant_type: 'authorization_code',
      redirect_uri,
      expires_in: expires_in.toString(),
      refresh_token_expires_in: refresh_token_expires_in.toString(),
    }).toString(),
  })
  const json = (await response.json()) as {
    access_token: string
    refresh_token: string
    id_token: string
    expires_in: number
  }
  return {
    access_token: json.access_token,
    refresh_token: json.refresh_token,
    id_token: decode(json.id_token).payload as unknown as IdToken, // Todo: replace with hono/jwt
    expires_in: json.expires_in,
  }
}

export const accessTokenFromHeader = async (c: Context) => {
  const access_token_raw = c.req.header('Authorization')?.split(' ')[1]
  if (!access_token_raw) return null
  const { exp } = await verify(access_token_raw, ENV.TOKEN_SECRET)
  if (!exp || exp < Math.floor(Date.now() / 1000)) return null
  const { payload: access_token } = decode(access_token_raw)
  return access_token as AccessToken
}
export const remoteAddress = (c: Context) => {
  return c.req.header('CF-Connecting-IP') || c.req.header('X-Real-IP') || c.req.header('X-Forwarded-For') || 'localhost'
}

export const getUserFromHeader = async (c: Context) => {
  const accessToken = await accessTokenFromHeader(c)
  const isAuthUser = !!accessToken?.id

  return isAuthUser
    ? ({
        id: accessToken.id,
        userId: null,
        guest: false,
      } as const)
    : ({
        id: null,
        userId: await generateGuestId(c),
        guest: true,
      } as const)
}

export const createGuestUser = async (prisma: Prisma, userId: string) => {
  const user = await prisma.user.create({ data: { userId, name: 'Guest', color: DEFAULT_COLOR } })
  return user
}

export const userIdToPrimaryKey = async (prisma: Prisma, userId: string) => {
  return (await prisma.user.findUnique({ where: { userId }, select: { id: true } }))?.id ?? null
}

export const getOrCreateUserId = async (c: Context, prisma: Prisma) => {
  const user = await getUserFromHeader(c)
  let id: string | null = null
  if (user.guest) {
    const userId = user.userId
    id = await userIdToPrimaryKey(prisma, userId)
    id ??= (await createGuestUser(prisma, userId)).id
  } else {
    id = user.id
  }
  return id
}

//-----------------------------------------------------------------

export async function generateGuestId(c: Context): Promise<string> {
  const ip = remoteAddress(c)
  const dateStr = formatDateToUTCYMD(new Date())
  const input = ip + dateStr + ENV.ID_SALT
  const fullHash = await hashToBase62(input)
  return `_${fullHash.slice(0, 10)}`
}

function formatDateToUTCYMD(date: Date): string {
  const year = date.getUTCFullYear()
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0')
  const day = date.getUTCDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}` // "2000-01-01"
}

async function hashToBase62(text: string): Promise<string> {
  const encoder: TextEncoder = new TextEncoder()
  const data: Uint8Array = encoder.encode(text)
  const hashBuffer: ArrayBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray: Uint8Array = new Uint8Array(hashBuffer)
  return toBase62(hashArray)
}

function toBase62(bytes: Uint8Array): string {
  const hex = Array.from(bytes)
    .map((b: number) => b.toString(16).padStart(2, '0'))
    .join('')
  let value = BigInt(`0x${hex}`)
  let result = ''
  while (value > 0n) {
    const remainder = value % 62n
    result = BASE62_ALPHABET[Number(remainder)] + result
    value /= 62n
  }
  return result || '0'
}

//------------------------------------------------------------------

type IsIdTaken = (publicId: string) => Promise<boolean>
export async function generateUniqueId(isIdTaken: IsIdTaken, maxAttempts = 10): Promise<string> {
  const idLength = 10

  const generateRandomId = (): string => {
    return Array.from({ length: idLength }, () => {
      const index = Math.floor(Math.random() * BASE62_ALPHABET.length)
      return BASE62_ALPHABET[index]
    }).join('')
  }

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const candidate = generateRandomId()
    console.log('Generated candidate:', candidate)
    if (!(await isIdTaken(candidate))) {
      return candidate
    }
  }

  throw new Error('Failed to generate a unique public ID after multiple attempts.')
}
