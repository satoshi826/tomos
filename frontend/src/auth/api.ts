import { client } from '@/infra/api'
import type { PromiseType } from '@/util/type'
import { getStoredCodeVerifier } from './util'

export const getToken = async (code: string) => {
  const code_verifier = getStoredCodeVerifier()
  if (!code_verifier) throw new Error('code_verifier not found')
  const result = await client.auth.token.google.$post({ json: { code, code_verifier } })
  if (!result.ok) throw new Error('fetcher error')
  return result.json()
}

export const getProfile = async (access_token: string | null) => {
  const options = access_token ? { init: { headers: { Authorization: `Bearer ${access_token}` } } } : {}
  const result = await client.profile.$get({}, options)
  if (!result.ok) throw new Error('fetcher error')
  return result.json()
}

export type AuthToken = PromiseType<ReturnType<typeof getToken>>
