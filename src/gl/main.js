import {Camera} from '../lib/engine/camera'
import {Material} from '../lib/engine/material'
import {Geometory} from '../lib/engine/geometory'
import {Mesh} from '../lib/engine/mesh'
import {PointLight} from '../lib/engine/Light'
import {Renderer, rgba16f} from '../lib/engine/renderer'
import {Animation} from '../lib/engine/animation'
import {prePass} from '../lib/engine/asset/material/prePass'
import {deffered} from '../lib/engine/asset/material/deffered'
import {geo} from '../lib/engine/asset/geometory/geometory'
import {sendState} from '../lib/engine/function/state'
import {cameraControl} from '../lib/engine/function/mouse'

export function main(core) {

  const camera = new Camera({position: [0, 5, 18], controller: {cameraControl}})
  camera.control('cameraControl')

  const basicMta1 = new Material(core, prePass({color: [0.3, 0.3, 1, 1]}))
  const basicMta2 = new Material(core, prePass({color: [1, 0.3, 0.3, 1]}))
  const basicMta3 = new Material(core, prePass({color: [0.3, 1, 0.3, 1]}))
  const basicMta5 = new Material(core, prePass({color: [0.4, 0.4, 0.4, 1]}))

  const box = new Geometory(core, geo.cube(3))
  const plane = new Geometory(core, geo.plane())

  const mesh1 = new Mesh(core, {geometory: box, material: basicMta1, position: [-6, 0, 0], rotation: [0, [1, 0, 0]]})
  const mesh2 = new Mesh(core, {geometory: box, material: basicMta2, position: [0, 0, 0]})
  const mesh3 = new Mesh(core, {geometory: box, material: basicMta3, position: [0, 6, 0], rotation: [0, [0, 0, 1]]})

  const base = new Mesh(core, {geometory: plane, material: basicMta5, position: [0, -8, 0], rotation: [-Math.PI / 2, [1, 0, 0]], scale: [15, 15, 15]})

  let light1 = new PointLight({position: [0.5, 1.0, 2.0]})

  mesh2.add(mesh1)
  mesh1.add(mesh3)

  const preRenderer = new Renderer(core, {
    frameBuffer    : {texture: [rgba16f, rgba16f, rgba16f]},
    backgroundColor: [0.85, 0.85, 0.85, 1.0],
  })

  const postRenderer = new Renderer(core)

  const screen = new Geometory(core, geo.plane())
  const defferedMta = new Material(core, deffered(), {
    u_texture0: preRenderer.renderTexture[0],
    u_texture1: preRenderer.renderTexture[1],
    u_texture2: preRenderer.renderTexture[2]
  })

  const postRendererResult = new Mesh(core, {geometory: screen, material: defferedMta})

  const meshs = [base, mesh1, mesh3, mesh2]
  const lights = [light1]

  const animation = new Animation({callback: ({delta}) => {

    mesh1.mutate((v) => v.rotation[0] += 0.003 * delta)
    mesh2.mutate((v) => v.rotation[0] -= 0.001 * delta)
    mesh3.mutate((v) => v.rotation[0] -= 0.005 * delta)

    preRenderer.render({meshs, camera})
    postRenderer.render({meshs: [postRendererResult], lights})
  }, interval: 0})

  setInterval(() => sendState({drawTime: animation.drawTime}), 100)
  animation.start()
}