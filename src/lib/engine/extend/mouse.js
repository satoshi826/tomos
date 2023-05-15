import {setHandler} from '@engine/function/state'
import {qtn} from '@engine/function/quaternion'

export const cameraControl = (camera) => {
  let qtnCam = qtn.create()
  const initPos = Array.from(camera.attributes.position)
  setHandler('mouse', (mouse) => {
    if(!mouse) return
    let {x, y} = mouse
    let sq = 2 * Math.sqrt(x * x + y * y)
    if (sq === 0) camera.mutate('position', () => {
      return Array.from(initPos)
    })
    let r = sq * 0.5 * Math.PI
    qtn.rot(r, [y, x, 0.0], qtnCam)
    camera.mutate('position', (v) => {
      qtn.toVec(initPos, qtnCam, v)
      return v
    })
  })
}