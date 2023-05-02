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

  const camera = new Camera({position: [0, 5, 30], near: 0.1, far: 300, fovy: 70, controller: {cameraControl}})
  camera.control('cameraControl')

  const black = deferredMta(core, {color: [0.05, 0.05, 0.05]})

  const box = new Geometory(core, geo.cube())
  const sphere = new Geometory(core, geo.sphere(24, 24, 2))

  const center = new Mesh(core, {geometory: sphere, material: black})
  const room = new Mesh(core, {geometory: box, material: black, scale: [100, 100, 100]})
  insideOut(room)

  const getlightSphere = (num) => {
    console.log(num)
    const meshs = range(num).flatMap(() => new Mesh(core, {
      geometory: sphere, material: deferredMta(core, {color: [random(0.05, 0.11), random(0.05, 0.11), random(0.05, 0.11)]}), scale: fill(3, random(0.3, 5))
    }))
    const lights = range(num).flatMap((_, i) => new PointLight({intensity: meshs[i].attributes.scale[0] * 1200, exponent: 2.4}))

    meshs.forEach((mesh, i) => {
      mesh.add(lights[i])
      mesh.qt = qtn.create()
      mesh.initPos = [random(-80, 80), random(-80, 80), random(-80, 80)]
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

    return {
      lights,
      meshs,
      mutate
    }
  }

  const render = getDeferredRenderer(core)




  let spheres = getlightSphere(40)

  let meshs = [room, center, ...spheres.meshs]
  let lights = [...spheres.lights]

  setHandler('rangelights', (lightsNum) => {
    if(lightsNum) {
      spheres = getlightSphere(Number(lightsNum))
      meshs = [room, center, ...spheres.meshs]
      lights = [...spheres.lights]
    }
  })

  const animation = new Animation({callback: () => {
    spheres.mutate()
    render({meshs, camera, lights})
  }, interval: 0})

  setInterval(() => sendState({drawTime: animation.drawTime, fps: 1000 / animation.delta}), 200)
  animation.start()
}