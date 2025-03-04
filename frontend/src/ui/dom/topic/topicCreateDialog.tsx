import { positionToAreaKey, useMyProfileId, useTopic, useUserTopicPosition } from '@/domain/hooks'
import { postTopic } from '@/infra/api'
import { useCFRS } from '@/lib/useCFRS'
import { useActionState, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MAX_TOPIC_TITLE_LENGTH } from 'shared/constants'
import { truncateAreaPosition } from 'shared/functions'
import { Button } from '../common/button'
import { Dialog, DialogActions } from '../common/dialog'

type Props = {
  open: boolean
  onClose: () => void
}

export function TopicCreateDialog({ open, onClose }: Props) {
  const { x, y } = useUserTopicPosition()
  const existTopic = useTopic({ x, y })
  const { t } = useTranslation()
  if (existTopic) return null
  return (
    <Dialog open={open} onClose={onClose} title={t('topic.create')}>
      <Body onClose={onClose} position={{ x, y }} />
    </Dialog>
  )
}

function Body({ onClose, position }: { onClose: () => void; position: { x: number; y: number } }) {
  const { t } = useTranslation()
  const userId = useMyProfileId()
  const [topicTitle, setTopicTitle] = useState('')
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setTopicTitle(e.target.value), [])
  const cfrs = useCFRS()

  const handleSend = async () => {
    if (!topicTitle.trim()) {
      alert(t('topic.title_required'))
      return
    }
    try {
      // await postTopic(position.x, position.y, topicTitle, userId)
      await new Promise((resolve) => setTimeout(resolve, 5000))
    } catch (error) {
      console.error('Failed to create topic:', error)
      alert(t('topic.create_failed'))
    } finally {
      cfrs.refetch(positionToAreaKey(truncateAreaPosition(position)))
      onClose()
    }
  }

  const [, send, isPending] = useActionState(handleSend, null)

  return (
    <form action={send}>
      <input
        className="input input-bordered w-full resize-none bg-base-200A p-5 duration-300 focus:border-primary-lighter focus:outline-none"
        placeholder={t('topic.title_placeholder')}
        value={topicTitle}
        maxLength={MAX_TOPIC_TITLE_LENGTH}
        onChange={handleChange}
      />
      <DialogActions>
        <Button type="submit" icon="check" loading={isPending}>
          {t('topic.do_create')}
        </Button>
      </DialogActions>
    </form>
  )
}
