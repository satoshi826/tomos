import { useIsMessageCreate, useMessage, useTopic, useUserPosition, useUserTopicPosition } from '@/domain/hooks'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../common/button'
import { getTranslate } from '../worldAdapter'
import { MessageCreateDialog } from './messageCreateDialog'
// import { TopicCreateDialog } from './topicCreateDialog'

export function MessageButton() {
  const isTopicCreate = useIsMessageCreate()
  if (!isTopicCreate) return null
  return <MessageButtonBody />
}

function MessageButtonBody() {
  const { x, y } = useUserPosition()
  const existMessage = useMessage({ x, y })
  const style = useMemo(() => ({ transform: getTranslate(x + 0.5, y + 0.85, 0.85) }), [x, y])
  const [open, setOpen] = useState(false)
  const handleOpen = useCallback(() => setOpen(true), [])
  const handleClose = useCallback(() => setOpen(false), [])
  const { t } = useTranslation()
  if (existMessage) return null
  return (
    <>
      <Button className="absolute text-nowrap" style={style} onClick={handleOpen} icon="edit_square">
        {t('message.create')}
      </Button>
      <MessageCreateDialog open={open} onClose={handleClose} position={{ x, y }} />
    </>
  )
}
