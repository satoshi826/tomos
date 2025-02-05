import { areaKeyToPosition, positionToAreaKey, positionToTopicKey, useCurrentAreaPosition } from '@/domain/hooks'
import { fetcher as _fetcher } from '@/lib/fetch'
import { useCFRSFetch } from '@/lib/useCFRS'
import type { JSONCompatible } from '@/util/type'
import { aToO } from 'jittoku'
import type { AreaWithTopics } from 'shared/types/util'
import { client } from '../api'
import { resultToJson } from '../util'

const fetcher = async (key: string) => {
  const [x, y] = areaKeyToPosition(key)
  const result = await client.areas.$get({ query: { x: x.toString(), y: y.toString() } })
  return resultToJson(result)
}

const keyValue = ({ topics }: JSONCompatible<AreaWithTopics>) => {
  return aToO(topics, (topic) => [positionToTopicKey(topic), { value: topic }])
}

export function TopicsFetcher() {
  useCFRSFetch({ promiseKey: positionToAreaKey(useCurrentAreaPosition()), fetcher, keyValue })
  return null
}
