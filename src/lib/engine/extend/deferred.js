import {Material} from '@engine/material'
import {Renderer, depth, rgba16f} from '@engine/renderer'
import {Geometory} from '@engine/geometory'
import {Mesh} from '@engine/mesh'
import {deferred} from '@engine/asset/material/deferred'
import {prePass} from '@engine/asset/material/prePass'
import {blur} from '@engine/asset/material/blur'
import {compose} from '../asset/material/compose'
import {geo} from '@engine/asset/geometory/geometory'

export const deferredMta = (core, {color, emission}) => new Material(core, prePass({color, emission}))

export const getDeferredRenderer = (core) => {

  const pixelRatioBase = 1.0
  const screen = new Geometory(core, geo.plane())
  const screenMesh = (material) => new Mesh(core, {geometory: screen, material})

  //----------------------------------------------------------

  const preRenderer = new Renderer(core, {
    frameBuffer: {texture: [rgba16f, rgba16f, rgba16f, depth]}, // pos nor col
    pixelRatio : pixelRatioBase,
  })

  //----------------------------------------------------------

  const deferredMta = new Material(core, deferred(), {
    u_positionTexture: preRenderer.renderTexture[0],
    u_normalTexture  : preRenderer.renderTexture[1],
    u_colorTexture   : preRenderer.renderTexture[2]
  })

  const deferredRendererResult = screenMesh(deferredMta)

  const deferredRenderer = new Renderer(core, {
    frameBuffer    : {texture: [rgba16f]}, // res highlight
    pixelRatio     : pixelRatioBase,
    backgroundColor: [0.2, 0.2, 0.2, 1.0], //
  })

  const deferredTex = core.setTexture('deferred', deferredRenderer.renderTexture[0])

  //----------------------------------------------------------

  const getBlurPass = (core, {targetName, targetTex}) => {

    const raitos = [0.25, 0.125]

    const blurMta = new Material(core, blur())
    const blurResult = screenMesh(blurMta)

    const renderers = raitos.map((ratio, i) => {
      const renderVertical = new Renderer(core, {
        frameBuffer: {texture: [rgba16f]},
        pixelRatio : ratio
      })
      const renderHorizontal = new Renderer(core, {
        frameBuffer: {texture: [rgba16f]},
        pixelRatio : ratio
      })
      const postBlurTex = core.setTexture(`blur${i}`, renderVertical.renderTexture[0])
      return{renderVertical, renderHorizontal, postBlurTex, ratio}
    })

    return {
      render: () => {
        renderers.forEach(({renderVertical, renderHorizontal, postBlurTex, ratio}, i) => {
          blurMta.texture[0] = targetName
          blurMta.uniformValue.u_preEffectTexture = targetTex
          blurMta.uniformValue.u_isHorizontal = false
          blurMta.uniformValue.u_invPixelRatio = pixelRatioBase / ratio
          renderVertical.render({meshs: [blurResult]})

          blurMta.uniformValue.u_preEffectTexture = postBlurTex
          blurMta.uniformValue.u_isHorizontal = true
          blurMta.uniformValue.u_invPixelRatio = pixelRatioBase
          blurMta.texture[0] = `blur${i}`
          renderHorizontal.render({meshs: [blurResult]})
        })
      },
      texture: renderers.map(({renderHorizontal: {renderTexture: [result]}}) => result)
    }
  }

  const blurPass = getBlurPass(core, {targetName: 'deferred', targetTex: deferredTex})

  //----------------------------------------------------------

  const composedMta = new Material(core, compose(), {
    u_blurTexture1: blurPass.texture[0],
    u_blurTexture2: blurPass.texture[1],
    u_depthTexture: preRenderer.renderTexture[3],
  })
  const composedResult = screenMesh(composedMta)

  composedMta.texture[4] = 'deferred'
  composedMta.uniformValue.u_preEffectTexture = deferredTex

  const composedRenderer = new Renderer(core, {
    pixelRatio: pixelRatioBase
  })

  //----------------------------------------------------------

  return ({meshs, camera, lights}) => {

    preRenderer.render({meshs, camera})
    deferredRenderer.render({meshs: [deferredRendererResult], camera, lights})
    blurPass.render()
    composedRenderer.render({meshs: [composedResult], camera})
  }

}