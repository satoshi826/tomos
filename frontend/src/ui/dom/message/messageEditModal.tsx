import { useSetMessage, useUserPosition } from '@/domain/hooks'
import { MAX_MESSAGE_LENGTH } from '@/domain/type'
import { useState } from 'react'
import { z } from 'zod'

const messageSchema = z
  .string()
  .min(1, 'メッセージを入力してください。')
  .max(MAX_MESSAGE_LENGTH, `メッセージは${MAX_MESSAGE_LENGTH}文字以内で入力してください。`)

export const openMessageEditModal = () => {
  ;(document.getElementById('message_edit_modal') as HTMLDialogElement).showModal()
}

const closeModal = () => {
  ;(document.getElementById('message_edit_modal') as HTMLDialogElement).close()
}

export function MessageEditModal() {
  const userPosition = useUserPosition()
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const postMessage = useSetMessage()

  const handleClose = () => {
    setMessage('')
    setError(null)
    closeModal()
  }

  const handlePost = () => {
    const validationResult = messageSchema.safeParse(message)
    if (!validationResult.success) {
      console.error(validationResult.error.issues)
      setError(validationResult.error.issues[0].message)
      return
    }
    postMessage((prev) => [
      ...prev,
      {
        id: 'message',
        x: userPosition.x,
        y: userPosition.y,
        userId: 'user',
        text: message,
        createdAt: Date.now().toString(),
      },
    ])
    handleClose()
  }

  return (
    <dialog id="message_edit_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">メッセージを作成</h3>
        <textarea
          className="textarea textarea-bordered mt-3 w-full resize-none"
          placeholder="メッセージ"
          value={message}
          maxLength={MAX_MESSAGE_LENGTH}
          rows={5}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="mt-1 text-right text-gray-500 text-sm">
          {message.length}/{MAX_MESSAGE_LENGTH}
        </div>
        {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
        <div className="modal-action mt-4 flex justify-end gap-2">
          <button type="button" className="btn btn-outline" onClick={handleClose}>
            キャンセル
          </button>
          <button type="button" className="btn btn-primary" onClick={handlePost}>
            投稿
          </button>
        </div>
      </div>
    </dialog>
  )
}
