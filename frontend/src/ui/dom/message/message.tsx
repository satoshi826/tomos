import { useCameraZ, useMessage } from '@/domain/hooks'
import { memo } from 'react'
import { getTranslate } from '../worldAdapter'

export const Message = memo(function Message() {
  const cameraZ = useCameraZ()
  const message = useMessage()
  if (cameraZ > 10) return null
  return message.map((m, i) => (
    <div
      key={m.id + i.toString()}
      className="pointer-events-none absolute size-36 break-words text-neutral-200 text-xs"
      style={{ transform: getTranslate(m.x + 0.5, m.y + 0.5) }}
    >
      {m.text}
    </div>
  ))
})
