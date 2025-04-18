import { hc } from 'hono/client'
import type { HONO_API } from 'shared/types'

const LOCAL_API = 'http://127.0.0.1:8787'

export const client = hc<HONO_API>(LOCAL_API)

export const postMessage = async (x: number, y: number, content: string, userId: string) => {
  const result = await client.messages.$post({ json: { x, y, content, userId } })
  if (!result.ok) throw new Error('fetcher error')
  return result.json()
}

export const getTopic = async (x: number, y: number) => {
  const result = await client.topics.$get({ query: { x: x.toString(), y: y.toString() } })
  if (!result.ok) throw new Error('fetcher error')
  return result.json()
}

export const postTopic = async (x: number, y: number, title: string, userId: string) => {
  const result = await client.topics.$post({ json: { x, y, title, userId } })
  if (!result.ok) throw new Error('fetcher error')
  return result.json()
}

export const getArea = async (x: number, y: number) => {
  const result = await client.areas.$get({ query: { x: x.toString(), y: y.toString() } })
  if (!result.ok) throw new Error('fetcher error')
  return result.json()
}
