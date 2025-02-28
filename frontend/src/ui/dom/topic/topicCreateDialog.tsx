import { truncateAreaPosition, useMyProfileId, useTopic, useUserTopicPosition } from '@/domain/hooks'
import { client } from '@/infra/api'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const [isLoading, setIsLoading] = useState(false)
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setTopicTitle(e.target.value), [])

  const handleSend = useCallback(async () => {
    if (!topicTitle.trim()) {
      alert(t('topic.title_required'))
      return
    }
    try {
      setIsLoading(true)
      await client.topics.$post({
        json: {
          title: topicTitle,
          userId,
          ...truncateAreaPosition(position),
        },
      })
      onClose()
    } catch (error) {
      console.error('Failed to create topic:', error)
      alert(t('topic.create_failed'))
    } finally {
      setIsLoading(false)
    }
  }, [topicTitle, onClose, position, t, userId])

  return (
    <>
      <input
        className="input input-bordered my-3 w-full resize-none bg-base-200A p-5 duration-300 focus:border-primary-lighter focus:outline-none"
        placeholder={t('topic.title_placeholder')}
        value={topicTitle}
        // maxLength={MAX_MESSAGE_LENGTH}
        // rows={1}
        onChange={handleChange}
      />
      <DialogActions>
        <Button onClick={handleSend} icon="check">
          {t('topic.do_create')}
        </Button>
      </DialogActions>
    </>
  )
}
