import { PrismaD1 } from '@prisma/adapter-d1'
import { PrismaClient } from '@prisma/client'
import type { Context } from 'hono'
import { ENV } from 'src/env'

export const prismaClient = () => {
  const D1 = ENV.DB
  const adapter = new PrismaD1(D1)
  return new PrismaClient({ adapter, log: ['query'] })
}

//-----------------------------------------------------------------

export const frontEndUrl = ENV.FRONT_END_URL
const client_id = ENV.GOOGLE_OAUTH_CLIENT_ID
const client_secret = ENV.GOOGLE_OAUTH_CLIENT_SECRET
const redirect_uri = ENV.GOOGLE_OAUTH_CALLBACK_URL
const BASE_URL = 'https://oauth2.googleapis.com'
const TOKEN_ENDPOINT = `${BASE_URL}/token`
const TOKEN_INFO_ENDPOINT = `${BASE_URL}/tokeninfo`
const expires_in = 60 * 60 // access token expires in 1 hour
export const refresh_token_expires_in = 60 * 60 * 24 * 7 // 1 week

export const getTokenInfo = async (access_token: string) => {
  const response = await fetch(`${TOKEN_INFO_ENDPOINT}?access_token=${access_token}`)
  const json = (await response.json()) as { exp: number; azp: string; sub: string }
  return json
}

export type IdToken = {
  iss: string
  sub: string
  azp: string
  aud: string
  iat: number
  name: string
}
export const getToken = async (code: string, code_verifier: string) => {
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
    id_token: decodeJwt(json.id_token) as unknown as IdToken, // Todo: replace with hono/jwt
    expires_in: json.expires_in,
  }
}

const base64UrlDecode = (base64Url: string): string => {
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
  return decodeURIComponent(
    atob(paddedBase64)
      .split('')
      .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
      .join(''),
  )
}

const decodeJwt = (token: string): Record<string, string> => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      throw new Error('Invalid token: JWT must have three parts.')
    }
    const payload = base64UrlDecode(parts[1])
    return JSON.parse(payload)
  } catch (error) {
    console.error('Error decoding token:', error)
    throw new Error('Invalid token')
  }
}

export const accessTokenFromHeader = (c: Context) => {
  const access_token = c.req.header('Authorization')?.split(' ')[1]
  return access_token
}

export const remoteAddress = (c: Context) => {
  return c.req.header('CF-Connecting-IP') || c.req.header('X-Real-IP') || c.req.header('X-Forwarded-For') || 'localhost'
}

//-----------------------------------------------------------------

type IsIdTaken = (publicId: string) => Promise<boolean>
export async function generateUniqueId(isIdTaken: IsIdTaken, maxAttempts = 10): Promise<string> {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const idLength = 8

  const generateRandomId = (): string => {
    return Array.from({ length: idLength }, () => {
      const index = Math.floor(Math.random() * charset.length)
      return charset[index]
    }).join('')
  }

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const candidate = generateRandomId()
    if (!(await isIdTaken(candidate))) {
      return candidate
    }
  }

  throw new Error('Failed to generate a unique public ID after multiple attempts.')
}
