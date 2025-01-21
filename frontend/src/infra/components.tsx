import { useCurrentTopicPosition, useIsTopicsView } from '@/domain/hooks'
import { fetcher as _fetcher } from '@/lib/fetch'
import { client } from './api'
import { useFetchCache } from './hooks'

const topicFetcher = async (key: string | undefined) => {
  if (!key) return
  const [_, x, y] = key.split('_')
  const result = await client.topics.$get({ query: { x, y } })
  return result.json()
}

export const Fetcher = function Fetcher() {
  const isTopicsView = useIsTopicsView()
  if (isTopicsView) return <TopicFetcher />
  return null
}

function TopicFetcher() {
  const pos = useCurrentTopicPosition()
  const key = `topic_${pos.x}_${pos.y}`
  useFetchCache(key, topicFetcher)
  return null
}
