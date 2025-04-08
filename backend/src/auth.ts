import { createRoute, z } from '@hono/zod-openapi'
import { ENV } from './env'
import { _200, _400, _jsonContent } from './utils'

export const frontEndUrl = ENV.FRONT_END_URL
const client_id = ENV.GOOGLE_OAUTH_CLIENT_ID
const client_secret = ENV.GOOGLE_OAUTH_CLIENT_SECRET
const redirect_uri = ENV.GOOGLE_OAUTH_CALLBACK_URL
const BASE_URL = 'https://oauth2.googleapis.com'
const TOKEN_ENDPOINT = `${BASE_URL}/token`
const TOKEN_INFO_ENDPOINT = `${BASE_URL}/tokeninfo`
const expires_in = 60 * 60 // access token expires in 1 hour
export const refresh_token_expires_in = 60 * 60 * 24 * 7 // 1 week

export const authCallbackScript = /* html */ `
  <script>
    const urlParams = new URLSearchParams(window.location.search)
    window.opener.postMessage({ code: urlParams.get("code") }, '${frontEndUrl}')
  </script>
`

export const tokenRoute = createRoute({
  method: 'get',
  path: '/auth/token/google',
  responses: {
    ..._200(z.object({ access_token: z.string(), expires_in: z.number() }), 'Returns an access token'),
  },
})
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
  const json = (await response.json()) as { access_token: string; refresh_token: string; id_token: string; expires_in: number }
  console.log(decodeJwt(json.id_token))
  return json
}

export const getTokenInfo = async (access_token: string) => {
  const response = await fetch(`${TOKEN_INFO_ENDPOINT}?access_token=${access_token}`)
  const json = (await response.json()) as { exp: number; azp: string; sub: string }
  return json
}

export const tokenRefreshRoute = createRoute({
  method: 'get',
  path: '/auth/token/google/refresh',
  responses: {
    ..._200(z.object({ access_token: z.string(), expires_in: z.number() }), 'Refresh an access token'),
  },
})

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

const decodeJwt = (token: string): Record<string, string> | null => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      console.error('Invalid token: JWT must have three parts.')
      return null
    }
    const payload = base64UrlDecode(parts[1])
    return JSON.parse(payload)
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}
