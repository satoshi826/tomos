import {useCameraPosition, useTopic} from '@/domain/hooks'
import {getTranslate} from '../worldAdapter'
import {memo} from 'react'

export const Topic = memo(function Topic() {
  const cameraPosition = useCameraPosition()
  const topic = useTopic()
  if (cameraPosition.z < 10 || cameraPosition.z > 80) return null
  return topic.map(m => (
    <div className='absolute size-32 text-neutral-200 text-3xl pointer-events-none break-words' style={{transform: getTranslate(m.x + 5, m.y + 5, 10)}}>
      {m.title}
    </div>
  )
  )
})