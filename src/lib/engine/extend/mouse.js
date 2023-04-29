import {setHandler} from '@engine/function/state'
import {qtn} from '@engine/function/quaternion'

export const cameraControl = (camera) => {
  let qtnCam = qtn.create()
  const initPos = Array.from(camera.attributes.position)
  setHandler('mouse', (mouse) => {
    if(!mouse) return
    const {x, y} = mouse
    let sq = Math.sqrt(x * x + y * y)
    if (sq === 0) {
      camera.mutate((v) => v.position = Array.from(initPos))
      return
    }
    let r = sq * 0.5 * Math.PI
    qtn.rot(r, [y, x, 0.0], qtnCam)
    camera.mutate((v) => {
      qtn.toVec(initPos, qtnCam, v.position)
    })
  })
}