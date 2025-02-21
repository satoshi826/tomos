import { useIsTopicCreate, useTopic, useUserTopicPosition } from '@/domain/hooks'
import { useMemo, useState } from 'react'
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
  const { x, y } = useUserTopicPosition() // 重いのでどうにかする
  const existTopic = useTopic({ x, y })
  const style = useMemo(() => ({ transform: getTranslate(x + 5, y + 8, 8) }), [x, y])
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  if (existTopic) return null
  return (
    <>
      <Button className="absolute text-nowrap" outline style={style} onClick={() => setOpen(true)}>
        {t('topic.create')}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} title={t('topic.create')}>
        hoge
      </Dialog>
    </>
  )
}
