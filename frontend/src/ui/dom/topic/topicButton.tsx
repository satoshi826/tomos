import { useCameraPosition, useUserPosition } from '@/domain/hooks'
import { Button } from '../common/button'
import { getTranslate } from '../worldAdapter'
// import {openMessageEditModal} from './messageEditModal'

export function MessageButton() {
  const userPosition = useUserPosition()
  const cameraPosition = useCameraPosition()
  const handleClick = () => {}
  if (cameraPosition.z > 4) return null
  const style = {
    transform: getTranslate(userPosition.x + 0.5, userPosition.y + 0.8),
  }
  return (
    <Button className="absolute text-nowrap" outline style={style} onClick={handleClick}>
      ポストする
    </Button>
  )
}
