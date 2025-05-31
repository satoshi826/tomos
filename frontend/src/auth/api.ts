import { c } from '@/infra/api'
import type { PromiseType } from '@/util/type'
import { getStoredCodeVerifier } from './util'

const withCredentials = { init: { credentials: 'include' } }

export const getToken = async (code: string) => {
  const code_verifier = getStoredCodeVerifier()
  if (!code_verifier) throw new Error('code_verifier not found')
  const result = await c.auth.login.$post({ json: { code, code_verifier } }, withCredentials)
  if (!result.ok) throw new Error('fetcher error')
  return result.json()
}

export const logout = async () => {
  const result = await c.auth.logout.$post({}, withCredentials)
  if (!result.ok) throw new Error('fetcher error')
  return result.json()
}

export const tokenRefresh = async () => {
  const result = await c.auth.refresh.$post({}, withCredentials)
  if (!result.ok) return { access_token: null, expires_at: null }
  return result.json()
}

export type AuthToken = PromiseType<ReturnType<typeof getToken>>
