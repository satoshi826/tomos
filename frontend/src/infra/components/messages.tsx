import { positionToMessageKey, positionToTopicKey, topicKeyToPosition, useCurrentTopicPosition } from '@/domain/hooks'
import { fetcher as _fetcher } from '@/lib/fetch'
import { useCFRSFetch } from '@/lib/useCFRS'
import type { JSONCompatible } from '@/util/type'
import { aToO } from 'jittoku'
import type { TopicWithMessages } from 'shared/types/util'
import { getTopic } from '../api'

const fetcher = async (key: string) => getTopic(...topicKeyToPosition(key))

const keyValue = ({ messages }: JSONCompatible<TopicWithMessages>) => aToO(messages, (m) => [positionToMessageKey(m), { value: m }])

export function MessagesFetcher() {
  useCFRSFetch({ promiseKey: positionToTopicKey(useCurrentTopicPosition()), fetcher, keyValue })
  return null
}
