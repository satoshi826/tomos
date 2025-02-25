import { positionToTopicKey, topicKeyToPosition, useCurrentTopicPosition, useIsTopicsView, useTopic } from '@/domain/hooks'
import { TOPIC_SIDE } from '@/domain/types'
import { memo } from 'react'
import { useViewablePositions } from '../hooks'
import { getTranslate } from '../worldAdapter'

export function Topics() {
  const isTopicsView = useIsTopicsView()
  if (!isTopicsView) return null
  return <TopicsBody />
}

function TopicsBody() {
  const currentTopicPosition = useCurrentTopicPosition()
  const viewablePositions = useViewablePositions(currentTopicPosition, TOPIC_SIDE)
  return viewablePositions.map((p) => {
    const key = positionToTopicKey(p)
    return <Topic key={key} topic={key} />
  })
}

const Topic = memo(function _Topic({ topic: t }: { topic: string }) {
  const [x, y] = topicKeyToPosition(t)
  const topic = useTopic({ x, y })
  if (!topic) return null
  return (
    <div
      className="pointer-events-none absolute size-40 break-words bg-zinc-700/30 text-lg text-neutral-200 contain-strict"
      style={{ transform: getTranslate(topic.x + 5, topic.y + 5, 10) }}
    >
      {topic.title}
    </div>
  )
})
