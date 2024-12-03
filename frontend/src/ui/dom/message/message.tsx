import {useCameraPosition, useMessage} from '@/domain/hooks'
import {getTranslate} from '../worldAdapter'
import {memo} from 'react'

export const Message = memo(function Message() {
  const cameraPosition = useCameraPosition()
  const message = useMessage()
  if (cameraPosition.z > 10) return null
  return message.map(m => (
    <div className='absolute size-36 text-neutral-200 text-xs pointer-events-none break-words' style={{transform: getTranslate(m.x + 0.5, m.y + 0.5)}}>
      {m.text}
    </div>
  )
  )
})