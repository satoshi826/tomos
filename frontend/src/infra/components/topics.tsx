import { areaKeyToPosition, positionToAreaKey, positionToTopicKey, useCurrentAreaPosition } from '@/domain/hooks'
import { fetcher as _fetcher } from '@/lib/fetch'
import { useCFRSFetch } from '@/lib/useCFRS'
import type { JSONCompatible } from '@/util/type'
import { aToO } from 'jittoku'
import type { AreaWithTopics } from 'shared/types/util'
import { getArea } from '../api'

const fetcher = async (key: string) => getArea(...areaKeyToPosition(key))

const keyValue = ({ topics }: JSONCompatible<AreaWithTopics>) => aToO(topics, (t) => [positionToTopicKey(t), { value: t }])

export function TopicsFetcher() {
  useCFRSFetch({ promiseKey: positionToAreaKey(useCurrentAreaPosition()), fetcher, keyValue })
  return null
}
