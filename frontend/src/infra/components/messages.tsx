import { positionToMessageKey, positionToTopicKey, topicKeyToPosition, useCurrentTopicPosition } from '@/domain/hooks'
import { fetcher as _fetcher } from '@/lib/fetch'
import { useCFRSFetch } from '@/lib/useCFRS'
import type { JSONCompatible } from '@/util/type'
import { aToO } from 'jittoku'
import type { TopicWithMessages } from 'shared/types/util'
import { client } from '../api'
import { resultToJson } from '../util'

const fetcher = async (key: string) => {
  const [x, y] = topicKeyToPosition(key)
  const result = await client.topics.$get({ query: { x: x.toString(), y: y.toString() } })
  return resultToJson(result)
}

const keyValue = ({ messages }: JSONCompatible<TopicWithMessages>) => {
  return aToO(messages, (message) => [positionToMessageKey(message), { value: message }])
}

export function MessagesFetcher() {
  useCFRSFetch({ promiseKey: positionToTopicKey(useCurrentTopicPosition()), fetcher, keyValue })
  return null
}
