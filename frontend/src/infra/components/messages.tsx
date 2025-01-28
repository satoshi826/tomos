import { positionToTopicKey, topicKeyToPosition, useCurrentTopicPosition } from '@/domain/hooks'
import { fetcher as _fetcher } from '@/lib/fetch'
import type { JSONCompatible } from '@/util/type'
import { aToO } from 'jittoku'
import type { AreaWithTopics } from 'shared/types/util'
import { client } from '../api'
import { FetchCacher } from '../util'

const fetcher = async (key: string) => {
  if (!key) return
  const [x, y] = topicKeyToPosition(key)
  const result = await client.areas.$get({ query: { x: x.toString(), y: y.toString() } })
  return result.json()
}

const keyValue = (result: JSONCompatible<AreaWithTopics>) => {
  const { topics } = result
  return aToO(topics, (topic) => {
    const key = positionToTopicKey(topic)
    return [key, { value: topic }]
  })
}

export function MessagesFetcher() {
  const topicPos = useCurrentTopicPosition()
  return <FetchCacher promiseKey={positionToTopicKey(topicPos)} fetcher={fetcher} keyValue={keyValue} />
}
