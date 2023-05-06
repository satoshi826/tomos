import {Geometory} from '../../lib/engine/geometory'
import {Mesh} from '../../lib/engine/mesh'
import {PointLight} from '../../lib/engine/Light'
import {geo} from '../../lib/engine/asset/geometory/geometory'
import {setHandler} from '../../lib/engine/function/state'
import {qtn} from '../../lib/engine/function/quaternion'
import {insideOut} from '../../lib/engine/extend/mesh'
import {instanse, standart} from '../../lib/engine/extend/deferred'
import {range, random} from '../../lib/util/util'

export function lightRoom(core, target) {

  const roomMaterial = standart(core, {color: [0.05, 0.05, 0.05]})
  const box = new Geometory(core, geo.cube())
  const sphere = new Geometory(core, geo.sphere(24, 24, 2))

  const room = new Mesh(core, {geometory: box, material: roomMaterial, scale: 500})
  insideOut(room)

  const getSphere = (num) => {
    const meshs = range(num).flatMap(() => new Mesh(core, {
      geometory: sphere, material : instanse(core, {color: [random(0.05, 0.11), random(0.05, 0.11), random(0.05, 0.11)]}),
      scale    : random(0.3, 5),
      position : [0, 0, 0]
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
        mesh.mutate('position', (v) => qtn.toVec(mesh.initPos, mesh.qt, v))
      })
    }
    return {meshs, mutate}
  }

  const getLights = (num) => {
    const meshs = range(num).flatMap(() => new Mesh(core, {
      geometory: sphere, material : instanse(core, {
        color   : [random(0.05, 0.11), random(0.05, 0.11), random(0.05, 0.11)],
        emission: 0.4,
      }),
      scale   : random(0.2, 10),
      position: [0, 0, 0]
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
        mesh.mutate('position', (v) => qtn.toVec(mesh.initPos, mesh.qt, v))
      })
    }
    return {lights, meshs, mutate}
  }

  let spheres = getSphere(500)
  let lightsS = getLights(20)

  target.meshs = [room, ...spheres.meshs, ...lightsS.meshs]
  target.lights = [...lightsS.lights]

  setHandler('rangesphere', (lightsNum) => {
    if(lightsNum) {
      spheres = getSphere(Number(lightsNum))
      target.meshs = [room, ...spheres.meshs, ...lightsS.meshs]
      target.lights = [...lightsS.lights]
    }
  })

  setHandler('rangelight', (lightsNum) => {
    if(lightsNum) {
      lightsS = getLights(Number(lightsNum))
      target.meshs = [room, ...spheres.meshs, ...lightsS.meshs]
      target.lights = [...lightsS.lights]
    }
  })

  return {
    mutate: () => {
      spheres.mutate()
      lightsS.mutate()
    }
  }


}