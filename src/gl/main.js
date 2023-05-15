import {Camera} from '../lib/engine/Camera'
import {Animation} from '../lib/engine/animation'
import {sendState} from '../lib/engine/function/state'
import {cameraControl} from '../lib/engine/extend/mouse'
import {getDeferredRenderer} from '../lib/engine/extend/deferred'
import {lightRoom} from './tmp/lightRoom'

export async function main(core) {

  const camera = new Camera({
    position: [0, 500, 30],
    lookAt  : [0, -380, 0],
    near    : 0.1,
    far     : 2000,
    fovy    : 80,
  })
  cameraControl(camera)

  let target = {}
  const room = lightRoom(core, target)
  const render = getDeferredRenderer(core)

  const animation = new Animation({callback: () => {
    room.mutate()
    render({meshs: [...target.meshs], camera, lights: [...target.lights]})
  }, interval: 0})

  setInterval(() => sendState({drawTime: Number(animation.drawTime).toFixed(2) + ' ms', fps: Number(1000 / animation.delta).toFixed(2)}), 200)
  animation.start()
}