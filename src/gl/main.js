import {Camera} from '../lib/engine/camera'
import {Material} from '../lib/engine/material'
import {Geometory} from '../lib/engine/geometory'
import {Mesh} from '../lib/engine/mesh'
import {PointLight} from '../lib/engine/Light'
import {Renderer, rgba16f} from '../lib/engine/renderer'
import {Animation} from '../lib/engine/animation'
import {deferred} from '../lib/engine/asset/material/deferred'
import {geo} from '../lib/engine/asset/geometory/geometory'
import {sendState} from '../lib/engine/function/state'
import {cameraControl} from '../lib/engine/function/mouse'
import {insideOut} from '../lib/engine/extend/mesh'

import {deferredMta, getDeferredRenderer} from '../lib/engine/extend/deferred'

export function main(core) {

  const camera = new Camera({position: [0, 5, 15], fovy: 70, controller: {cameraControl}})
  camera.control('cameraControl')

  const basicMta1 = deferredMta(core, {color: [0.3, 0.3, 1]})
  const basicMta2 = deferredMta(core, {color: [1, 0.3, 0.3]})
  const basicMta3 = deferredMta(core, {color: [0.3, 1, 0.3]})
  const basicMta5 = deferredMta(core, {color: [0.1, 0.1, 0.1]})

  const torus = new Geometory(core, geo.torus(48, 48, 1, 2))
  const box = new Geometory(core, geo.cube())

  const mesh1 = new Mesh(core, {geometory: torus, material: basicMta1, position: [-8, 0, 0], rotation: [0, [1, 0, 0]]})
  const mesh2 = new Mesh(core, {geometory: torus, material: basicMta2, position: [0, 0, 0]})
  const mesh3 = new Mesh(core, {geometory: torus, material: basicMta3, position: [0, 8, 0], rotation: [0, [0, 0, 1]]})

  const base = new Mesh(core, {geometory: box, material: basicMta5, position: [0, 0, 0], scale: [30, 11, 30]})
  insideOut(base)

  let light1 = new PointLight()
  let light2 = new PointLight()
  let light3 = new PointLight()

  mesh2.add(mesh1)
  mesh1.add(mesh3)

  mesh1.add(light1)
  mesh2.add(light2)
  mesh3.add(light3)

  const renderer = getDeferredRenderer(core)

  const preRenderer = new Renderer(core, {
    frameBuffer: {texture: [rgba16f, rgba16f, rgba16f]},
  })

  const postRenderer = new Renderer(core)

  const screen = new Geometory(core, geo.plane())
  const defferedMta = new Material(core, deferred(), {
    u_positionTexture: preRenderer.renderTexture[0],
    u_normalTexture  : preRenderer.renderTexture[1],
    u_colorTexture   : preRenderer.renderTexture[2]
  })

  const postRendererResult = new Mesh(core, {geometory: screen, material: defferedMta})

  const meshs = [base, mesh1, mesh3, mesh2]
  const lights = [light1, light2, light3]

  const animation = new Animation({callback: ({delta}) => {

    mesh1.mutate((v) => v.rotation[0] += 0.003 * delta)
    mesh2.mutate((v) => v.rotation[0] -= 0.001 * delta)
    mesh3.mutate((v) => v.rotation[0] -= 0.005 * delta)


    preRenderer.render({meshs, camera})
    postRenderer.render({meshs: [postRendererResult], lights, camera})
  }, interval: 0})

  setInterval(() => sendState({drawTime: animation.drawTime}), 200)
  animation.start()
}