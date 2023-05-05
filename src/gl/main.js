import {Camera} from '../lib/engine/camera'
import {Geometory} from '../lib/engine/geometory'
import {Mesh} from '../lib/engine/mesh'
import {PointLight} from '../lib/engine/Light'
import {Animation} from '../lib/engine/animation'
import {geo} from '../lib/engine/asset/geometory/geometory'
import {sendState} from '../lib/engine/function/state'
import {cameraControl} from '../lib/engine/extend/mouse'
import {setHandler} from '../lib/engine/function/state'
import {qtn} from '../lib/engine/function/quaternion'
import {insideOut} from '../lib/engine/extend/mesh'
import {deferredMta, getDeferredRenderer} from '../lib/engine/extend/deferred'
import {range, random, fill} from '../lib/util/util'

export function main(core) {

  const camera = new Camera({position: [0, 5, 30], near: 0.1, far: 1000, fovy: 80, controller: {cameraControl}})
  camera.control('cameraControl')

  const black = deferredMta(core, {color: [0.05, 0.05, 0.05]})
  const box = new Geometory(core, geo.cube())
  const sphere = new Geometory(core, geo.sphere(24, 24, 2))

  const center = new Mesh(core, {geometory: sphere, material: black, scale: [0.2, 0.2, 0.2]})
  const room = new Mesh(core, {geometory: box, material: black, scale: [500, 500, 500]})
  insideOut(center)
  insideOut(room)

  const centerLight = new PointLight({intensity: 60, exponent: 1.2})
  center.add(centerLight)

  const getSphere = (num) => {
    const meshs = range(num).flatMap(() => new Mesh(core, {
      geometory: sphere, material: deferredMta(core, {color: [random(0.05, 0.11), random(0.05, 0.11), random(0.05, 0.11)]}), scale: fill(3, random(0.3, 5))
    }))
    meshs.forEach((mesh) => {
      mesh.qt = qtn.create()
      mesh.initPos = [random(-400, 400), random(-400, 400), random(-400, 400)]
      mesh.axis = [random(), random(), random()]
      mesh.speed = (1 / mesh.attributes.scale[0])
    })
    let counter = 0
    const mutate = () => {
      counter++
      meshs.forEach((mesh) => {
        qtn.rot((counter / 100) * mesh.speed, mesh.axis, mesh.qt)
        mesh.mutate((v) => qtn.toVec(mesh.initPos, mesh.qt, v.position))
      })
    }
    return {meshs, mutate}
  }

  console.log(black)

  const getLights = (num) => {
    const meshs = range(num).flatMap(() => new Mesh(core, {
      geometory: sphere, material : deferredMta(core, {
        color   : [random(0.05, 0.11), random(0.05, 0.11), random(0.05, 0.11)],
        emission: 0.4,
      }),
      scale: fill(3, random(0.3, 5)),
    }))
    const lights = range(num).flatMap((_, i) => new PointLight({intensity: meshs[i].attributes.scale[0] * 50000, exponent: 2.5}))
    meshs.forEach((mesh, i) => {
      mesh.add(lights[i])
      mesh.qt = qtn.create()
      mesh.initPos = [random(-400, 400), random(-400, 400), random(-400, 400)]
      mesh.axis = [random(), random(), random()]
      mesh.speed = (1 / mesh.attributes.scale[0])
      mesh.add(lights[i])
    })
    let counter = 0
    const mutate = () => {
      counter++
      meshs.forEach((mesh) => {
        qtn.rot((counter / 100) * mesh.speed, mesh.axis, mesh.qt)
        mesh.mutate((v) => qtn.toVec(mesh.initPos, mesh.qt, v.position))
      })
    }
    return {lights, meshs, mutate}
  }

  const render = getDeferredRenderer(core)
  let spheres = getSphere(500)
  let lightsS = getLights(20)

  let meshs = [center, room, ...spheres.meshs, ...lightsS.meshs]
  let lights = [centerLight, ...lightsS.lights]

  setHandler('rangesphere', (lightsNum) => {
    if(lightsNum) {
      spheres = getSphere(Number(lightsNum))
      meshs = [center, room, ...spheres.meshs, ...lightsS.meshs]
      lights = [centerLight, ...lightsS.lights]
    }
  })

  setHandler('rangelight', (lightsNum) => {
    if(lightsNum) {
      lightsS = getLights(Number(lightsNum))
      meshs = [center, room, ...spheres.meshs, ...lightsS.meshs]
      lights = [centerLight, ...lightsS.lights]
    }
  })

  const animation = new Animation({callback: () => {
    spheres.mutate()
    lightsS.mutate()
    render({meshs, camera, lights})
  }, interval: 0})

  setInterval(() => sendState({drawTime: animation.drawTime, fps: 1000 / animation.delta}), 200)
  animation.start()
}