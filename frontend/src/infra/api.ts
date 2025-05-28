import { hc } from 'hono/client'
import type { HONO_API } from 'shared/types'

export const c = hc<HONO_API>(import.meta.env.VITE_API_URL)

const withAccessToken = (token?: string | null) => (token ? { headers: { Authorization: `Bearer ${token}` } } : undefined)

export const getProfile = async (accessToken: string | null) => {
  const result = await c.profile.$get({}, withAccessToken(accessToken))
  if (!result.ok) throw new Error('fetcher error')
  return result.json()
}

export const postMessage = async (x: number, y: number, content: string, accessToken: string | null) => {
  const result = await c.messages.$post({ json: { x, y, content } }, withAccessToken(accessToken))
  if (!result.ok) throw new Error('fetcher error')
  return result.json()
}

export const getTopic = async (x: number, y: number) => {
  const result = await c.topics.$get({ query: { x: x.toString(), y: y.toString() } })
  if (!result.ok) throw new Error('fetcher error')
  return result.json()
}

export const postTopic = async (x: number, y: number, title: string, accessToken: string | null) => {
  const result = await c.topics.$post({ json: { x, y, title } }, withAccessToken(accessToken))
  if (!result.ok) throw new Error('fetcher error')
  return result.json()
}

export const getArea = async (x: number, y: number) => {
  const result = await c.areas.$get({ query: { x: x.toString(), y: y.toString() } })
  if (!result.ok) throw new Error('fetcher error')
  return result.json()
}
