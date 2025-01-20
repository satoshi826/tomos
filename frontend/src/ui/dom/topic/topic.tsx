import { positionToTopicKey, topicKeyToPosition, useCameraZ, useCanvasAdapter, useCurrentTopicPosition, useIsTopicsView, useTopic } from '@/domain/hooks'
import { TOPIC_SIDE } from '@/domain/types'
import { step, truncate } from 'jittoku'
import { memo } from 'react'
import { getTranslate } from '../worldAdapter'

export function Topics() {
  const currentTopicPosition = useCurrentTopicPosition()
  const cameraZ = useCameraZ()
  const isTopicsView = useIsTopicsView()
  const { aspectRatioVec } = useCanvasAdapter()
  if (!isTopicsView) return null

  const centerX = currentTopicPosition.x
  const centerY = currentTopicPosition.y
  const width = cameraZ * 0.5
  const xWidth = truncate(width * aspectRatioVec[0], -1)
  const yWidth = truncate(width * aspectRatioVec[1], -1)
  const XArray = step(centerX - TOPIC_SIDE - xWidth, centerX + TOPIC_SIDE + xWidth, 10)
  const YArray = step(centerY - TOPIC_SIDE - yWidth, centerY + TOPIC_SIDE + yWidth, 10)
  const topicArray = XArray.flatMap((x) => YArray.map((y) => positionToTopicKey({ x, y })))
  return topicArray.map((k) => <Topic key={k} topic={k} />)
}

const Topic = memo(function Topic({ topic: t }: { topic: string }) {
  const [x, y] = topicKeyToPosition(t)
  const topic = useTopic({ x, y })
  console.log(topic)
  if (!topic) return null
  return (
    <div
      className="pointer-events-none absolute size-36 break-words bg-gray-600 text-lg text-neutral-200"
      style={{ transform: getTranslate(topic.x + 5, topic.y + 5, 10) }}
    >
      {topic.title}
    </div>
  )
})
