import { useIsTopicCreate, useTopic, useUserTopicPosition } from '@/domain/hooks'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../common/button'
import { Dialog } from '../common/dialog'
import { getTranslate } from '../worldAdapter'

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
  const handleClose = useCallback(() => setOpen(false), [])
  const { t } = useTranslation()
  if (existTopic) return null
  return (
    <>
      <Button className="absolute text-nowrap" style={style} onClick={() => setOpen(true)} icon="emoji_objects">
        {t('topic.create')}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        title={t('topic.create')}
        primaryButton={
          <Button onClick={handleClose} icon="check">
            {t('topic.do_create')}
          </Button>
        }
      >
        <input
          className="input input-bordered my-3 w-full resize-none p-5 bg-base-200A"
          placeholder={t('topic.title_placeholder')}
          // value={message}
          // maxLength={MAX_MESSAGE_LENGTH}
          // rows={1}
          // onChange={(e) => setMessage(e.target.value)}
        />
      </Dialog>
    </>
  )
}
