import {
  messageKeyToPosition,
  positionToMessageKey,
  useCurrentMessagePosition,
  useIsMessageView,
  useIsMessagesView,
  useMessage,
} from '@/domain/hooks'
import { memo } from 'react'
import { MESSAGE_SIDE } from 'shared/constants'
import { useViewablePositions } from '../hooks'
import { getTranslate } from '../worldAdapter'

export function Messages() {
  const isMessagesView = useIsMessagesView()
  const isMessageView = useIsMessageView()
  if (!isMessagesView && !isMessageView) return null
  return <MessagesBody />
}

function MessagesBody() {
  const currentMessagePosition = useCurrentMessagePosition()
  const viewablePositions = useViewablePositions(currentMessagePosition, MESSAGE_SIDE)
  return viewablePositions.map((p) => {
    const key = positionToMessageKey(p)
    return <Message key={key} message={key} />
  })
}

const Message = memo(function Message({ message: m }: { message: string }) {
  const [x, y] = messageKeyToPosition(m)
  const message = useMessage({ x, y })
  if (!message) return null
  return (
    <div
      className="pointer-events-none absolute size-36 break-words bg-gray-600 text-lg text-neutral-200 contain-strict"
      style={{ transform: getTranslate(message.x + 0.5, message.y + 0.5, 1) }}
    >
      {message.content}
    </div>
  )
})
