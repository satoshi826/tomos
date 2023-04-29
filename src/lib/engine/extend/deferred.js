import {Material} from '@engine/material'
import {Renderer, rgba8, rgba16f} from '@engine/renderer'
import {Geometory} from '@engine/geometory'
import {Mesh} from '@engine/mesh'
import {deferred} from '@engine/asset/material/deferred'
import {prePass} from '@engine/asset/material/prePass'
import {blur} from '@engine/asset/material/blur'
import {geo} from '@engine/asset/geometory/geometory'

export const deferredMta = (core, {color}) => new Material(core, prePass({color}))

export const getDeferredRenderer = (core) => {

  const screen = new Geometory(core, geo.plane())

  const preRenderer = new Renderer(core, {
    frameBuffer: {texture: [rgba16f, rgba16f, rgba16f]},
    pixelRatio : 1,
  })
  const deferredMta = new Material(core, deferred(), {
    u_positionTexture: preRenderer.renderTexture[0],
    u_normalTexture  : preRenderer.renderTexture[1],
    u_colorTexture   : preRenderer.renderTexture[2]
  })
  const postRendererResult = new Mesh(core, {geometory: screen, material: deferredMta})


  const postRenderer1 = new Renderer(core, {
    frameBuffer: {texture: [rgba8]},
    pixelRatio : 1,
  })
  const postRenderer2 = new Renderer(core, {
    frameBuffer: {texture: [rgba8]},
    pixelRatio : 1,
  })

  const effectMta = new Material(core, blur({pixelRatio: 0.5}), {
    u_texture: postRenderer1.renderTexture[0],
  })
  const postEffectResult = new Mesh(core, {geometory: screen, material: effectMta})

  const postEffectRenderer = new Renderer(core, {
    pixelRatio: 0.5
  })

  effectMta.uniformValue.u_isHorizontal = true

  return ({meshs, camera, lights}) => {
    preRenderer.render({meshs, camera})
    postRenderer1.render({meshs: [postRendererResult], camera, lights})
    postEffectRenderer.render({meshs: [postEffectResult]})
  }

}