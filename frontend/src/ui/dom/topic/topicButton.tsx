import { useIsTopicCreate, useTopic, useUserTopicPosition } from '@/domain/hooks'
import { Button } from '../common/button'
import { getTranslate } from '../worldAdapter'
// import {openMessageEditModal} from './messageEditModal'

export function TopicButton() {
  const isTopicCreate = useIsTopicCreate()
  if (!isTopicCreate) return null
  return <TopicButtonBody />
}

function TopicButtonBody() {
  const { x, y } = useUserTopicPosition()
  const existTopic = useTopic({ x, y })
  console.log('existTopic', existTopic)
  if (existTopic) return null
  const style = { transform: getTranslate(x + 5, y + 8, 8) }
  return (
    <Button className="absolute text-nowrap" outline style={style} onClick={() => {}}>
      トピックを作成
    </Button>
  )
}
