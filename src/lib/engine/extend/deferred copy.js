import {Material} from '@engine/material'
import {Renderer, rgba8, rgba16f} from '@engine/renderer'
import {Geometory} from '@engine/geometory'
import {Mesh} from '@engine/mesh'
import {deferred} from '@engine/asset/material/deferred'
import {prePass} from '@engine/asset/material/prePass'
import {blur} from '@engine/asset/material/blur'
import {composer} from '../asset/material/toneMapping'
import {geo} from '@engine/asset/geometory/geometory'

export const deferredMta = (core, {color}) => new Material(core, prePass({color}))

export const getDeferredRenderer = (core) => {

  const pixelRatioBase = 1.0

  const screen = new Geometory(core, geo.plane())
  const screenMesh = (material) => new Mesh(core, {geometory: screen, material})

  const preRenderer = new Renderer(core, {
    frameBuffer: {texture: [rgba16f, rgba16f, rgba16f]},
    pixelRatio : pixelRatioBase,
  })
  const deferredMta = new Material(core, deferred(), {
    u_positionTexture: preRenderer.renderTexture[0],
    u_normalTexture  : preRenderer.renderTexture[1],
    u_colorTexture   : preRenderer.renderTexture[2]
  })
  const deferredRendererResult = screenMesh(deferredMta)

  const deferredRenderer = new Renderer(core, {
    frameBuffer: {texture: [rgba16f]},
    pixelRatio : pixelRatioBase,
  })
  const deferredRendererTexture = core.setTexture('deferred', deferredRenderer.renderTexture[0])

  const blurRatio = 0.5

  const effectMta = new Material(core, blur())
  const postEffectResult = screenMesh(effectMta)

  const postEffectRenderer = new Renderer(core, {
    frameBuffer: {texture: [rgba8]},
    pixelRatio : blurRatio
  })
  const postBlurTexture = core.setTexture('blur1', postEffectRenderer.renderTexture[0])

  const postEffectRenderer2 = new Renderer(core, {
    frameBuffer: {texture: [rgba8]},
    pixelRatio : blurRatio
  })


  const composedRenderer = new Renderer(core, {
    pixelRatio: pixelRatioBase
  })
  const composedMta = new Material(core, composer(), {
    u_blurTexture: postEffectRenderer2.renderTexture[0]
  })
  const composedResult = screenMesh(composedMta)
  composedMta.uniformValue.u_preEffectTexture = deferredRendererTexture



  return ({meshs, camera, lights}) => {
    preRenderer.render({meshs, camera})
    deferredRenderer.render({meshs: [deferredRendererResult], camera, lights})

    effectMta.uniformValue.u_isHorizontal = false
    effectMta.uniformValue.u_invPixelRatio = pixelRatioBase / blurRatio
    effectMta.uniformValue.u_preEffectTexture = deferredRendererTexture
    effectMta.texture[0] = 'deferred'
    postEffectRenderer.render({meshs: [postEffectResult]})

    effectMta.uniformValue.u_isHorizontal = true
    effectMta.uniformValue.u_invPixelRatio = pixelRatioBase
    effectMta.uniformValue.u_preEffectTexture = postBlurTexture
    effectMta.texture[0] = 'blur1'
    postEffectRenderer2.render({meshs: [postEffectResult]})

    composedRenderer.render({meshs: [composedResult]})

  }

}