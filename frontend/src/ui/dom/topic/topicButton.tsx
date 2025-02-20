import { useIsTopicCreate, useTopic, useUserTopicPosition } from '@/domain/hooks'
import { useMemo } from 'react'
import { Button } from '../common/button'
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
  if (existTopic) return null
  return (
    <Button className="absolute text-nowrap" outline style={style} onClick={() => {}}>
      トピックを作成
    </Button>
  )
}
