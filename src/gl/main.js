import {Camera} from '../lib/engine/Camera'
import {Geometory} from '../lib/engine/geometory'
import {Mesh} from '../lib/engine/Mesh'
import {Animation} from '../lib/engine/animation'
import {geo} from '../lib/engine/asset/geometory/geometory'
import {sendState} from '../lib/engine/function/state'
import {cameraControl} from '../lib/engine/extend/mouse'
import {setHandler} from '../lib/engine/function/state'
import {standart, getDeferredRenderer} from '../lib/engine/extend/deferred'
import {PointLight} from '../lib/engine/Light'
import {lightRoom} from './tmp/lightRoom'

export async function main(core) {

  const camera = new Camera({
    position: [0, 20, 30],
    lookAt  : [0, 0, 0],
    near    : 0.1,
    far     : 1000,
    fovy    : 80,
  })
  cameraControl(camera)

  // const box = new Geometory(core, geo.cube())
  // const playerMaterial = standart(core, {color: [0.05, 0.05, 0.1], emission: 0.2})
  // const playerLight = new PointLight({intensity: 10000, exponent: 2})
  // const player = new Mesh(core, {geometory: box, material: playerMaterial, scale: [2, 5, 2], position: [0, 0, 0]})
  // player.add(playerLight)

  // const moveControl = (mesh) => {
  //   setHandler('KeyW', () => {
  //     mesh.mutate('position', ([x, y, z]) => [x, y, z - 2])
  //   })
  //   setHandler('KeyS', () => {
  //     mesh.mutate('position', ([x, y, z]) => [x, y, z + 2])
  //   })
  //   setHandler('KeyD', () => {
  //     mesh.mutate('position', ([x, y, z]) => [x + 2, y, z])
  //   })
  //   setHandler('KeyA', () => {
  //     mesh.mutate('position', ([x, y, z]) => [x - 2, y, z])
  //   })
  // }

  // moveControl(player)

  let target = {}
  const room = lightRoom(core, target)
  const render = getDeferredRenderer(core)

  const animation = new Animation({callback: () => {
    room.mutate()
    render({meshs: [...target.meshs], camera, lights: [...target.lights]})
  }, interval: 0})

  setInterval(() => sendState({drawTime: animation.drawTime, fps: 1000 / animation.delta}), 200)
  animation.start()
}