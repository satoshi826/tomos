import { env } from 'cloudflare:workers'

export const ENV = env as unknown as {
  FRONT_END_URL: string
  GOOGLE_OAUTH_CLIENT_ID: string
  GOOGLE_OAUTH_CLIENT_SECRET: string
  GOOGLE_OAUTH_CALLBACK_URL: string
  TOMOS_PUBLIC_KEY: string
}
