import { useIsTopicCreate, useTopic, useUserTopicPosition } from '@/domain/hooks'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../common/button'
import { getTranslate } from '../worldAdapter'
import { TopicCreateDialog } from './topicCreateDialog'

export function TopicButton() {
  const isTopicCreate = useIsTopicCreate()
  if (!isTopicCreate) return null
  return <TopicButtonBody />
}

function TopicButtonBody() {
  const { x, y } = useUserTopicPosition()
  const existTopic = useTopic({ x, y })
  const style = useMemo(() => ({ transform: getTranslate(x + 5, y + 8.5, 8) }), [x, y])
  const [open, setOpen] = useState(false)
  const handleOpen = useCallback(() => setOpen(true), [])
  const handleClose = useCallback(() => setOpen(false), [])
  const { t } = useTranslation()
  if (existTopic) return null
  return (
    <>
      <Button className="absolute text-nowrap" style={style} onClick={handleOpen} icon="emoji_objects">
        {t('topic.create')}
      </Button>
      <TopicCreateDialog open={open} onClose={handleClose} position={{ x, y }} />
    </>
  )
}
