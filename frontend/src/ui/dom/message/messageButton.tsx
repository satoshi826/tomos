import { useCameraPosition, useMessage, useUserPosition } from '@/domain/hooks'
import { Button } from '../common/button'
import { getTranslate } from '../worldAdapter'
import { openMessageEditModal } from './messageEditModal'

export function MessageButton() {
  // const userPosition = useUserPosition()
  // const message = useMessage()
  // const cameraPosition = useCameraPosition()
  // const handleClick = openMessageEditModal
  // if (cameraPosition.z > 4) return null
  // if (message.find((m) => m.x === userPosition.x && m.y === userPosition.y)) return null
  // const style = { transform: getTranslate(userPosition.x + 0.5, userPosition.y + 0.8) }
  // return (
  //   <Button className="absolute text-nowrap" outline onClick={handleClick} style={style}>
  //     ポストする
  //   </Button>
  // )
}
