import { useCameraPosition, useTopic } from '@/domain/hooks'
import { memo } from 'react'
import { getTranslate } from '../worldAdapter'

export const Topic = memo(function Topic() {
  const cameraPosition = useCameraPosition()
  const topic = useTopic()
  if (cameraPosition.z < 10 || cameraPosition.z > 80) return null
  return topic.map((m, i) => (
    <div
      key={m.id + i.toString()}
      className="pointer-events-none absolute size-32 break-words text-3xl text-neutral-200"
      style={{ transform: getTranslate(m.x + 5, m.y + 5, 10) }}
    >
      {m.title}
    </div>
  ))
})
