import {Material} from '@engine/material'
import {Renderer, rgba8, rgba16f} from '@engine/renderer'
import {Geometory} from '@engine/geometory'
import {Mesh} from '@engine/mesh'
import {deferred} from '@engine/asset/material/deferred'
import {prePass} from '@engine/asset/material/prePass'
import {blur} from '@engine/asset/material/blur'
import {compose} from '../asset/material/conpose'
import {geo} from '@engine/asset/geometory/geometory'

export const deferredMta = (core, {color, emission}) => new Material(core, prePass({color, emission}))

export const getDeferredRenderer = (core) => {

  const pixelRatioBase = 1.0
  const screen = new Geometory(core, geo.plane())
  const screenMesh = (material) => new Mesh(core, {geometory: screen, material})

  //----------------------------------------------------------

  const preRenderer = new Renderer(core, {
    frameBuffer: {texture: [rgba16f, rgba16f, rgba16f]}, // pos nor col
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
    frameBuffer: {texture: [rgba16f, rgba16f]}, // res highlight
    pixelRatio : pixelRatioBase,
  })

  //----------------------------------------------------------

  const getBlurPass = ({targetName, targetTex}, i) => {

    const raitos = [0.25, 0.125]

    const blurMta = new Material(core, blur())
    const blurResult = screenMesh(blurMta)

    const renderers = raitos.map((ratio) => {

      const renderVertical = new Renderer(core, {
        frameBuffer: {texture: [rgba8]},
        pixelRatio : ratio
      })

      const renderHorizontal = new Renderer(core, {
        frameBuffer: {texture: [rgba8]},
        pixelRatio : ratio
      })

      const postBlurTex = core.setTexture(`blur${i}`, renderVertical.renderTexture[0])

      return{renderVertical, renderHorizontal, postBlurTex}
    })


    return {
      renderBlur: () => {
        renderers.forEach(({renderVertical, renderHorizontal, postBlurTex}, i) => {
          blurMta.texture[0] = targetName
          blurMta.uniformValue.u_preEffectTexture = targetTex
          blurMta.uniformValue.u_isHorizontal = false
          blurMta.uniformValue.u_invPixelRatio = pixelRatioBase / blurRatio1
          renderVertical.render({meshs: [blurResult]})

          blurMta.uniformValue.u_isHorizontal = true
          blurMta.uniformValue.u_invPixelRatio = pixelRatioBase
          blurMta.uniformValue.u_preEffectTexture = postBlurTex
          blurMta.texture[0] = `blur${i}`
          renderHorizontal.render({meshs: [blurResult]})
        })
      },
      postBlurTex: renderers.map(({renderHorizontal: {renderTexture: [result]}}) => result)
    }
  }

  const highlightTex = core.setTexture('highlight', deferredRenderer.renderTexture[1])

  const blurRatio1 = 0.25

  const blurMta = new Material(core, blur())
  const blurResult = screenMesh(blurMta)

  const blurRenderer = new Renderer(core, {
    frameBuffer: {texture: [rgba8]},
    pixelRatio : blurRatio1
  })

  const blurTmpTex = core.setTexture('blur1', blurRenderer.renderTexture[0])

  const blurRenderer2 = new Renderer(core, {
    frameBuffer: {texture: [rgba8]},
    pixelRatio : blurRatio1
  })

  const blurRatio2 = 0.125

  const blurRendererLow1 = new Renderer(core, {
    frameBuffer: {texture: [rgba8]},
    pixelRatio : blurRatio2
  })

  const blurTmpTex2 = core.setTexture('blur2', blurRendererLow1.renderTexture[0])

  const blurRendererLow2 = new Renderer(core, {
    frameBuffer: {texture: [rgba8]},
    pixelRatio : blurRatio2
  })

  //----------------------------------------------------------

  const composedMta = new Material(core, compose(), {
    u_preEffectTexture: deferredRenderer.renderTexture[0],
    u_blurTexture     : blurRenderer2.renderTexture[0]
  })
  const composedResult = screenMesh(composedMta)

  const composedRenderer = new Renderer(core, {
    pixelRatio: pixelRatioBase
  })

  //----------------------------------------------------------

  return ({meshs, camera, lights}) => {

    preRenderer.render({meshs, camera})
    deferredRenderer.render({meshs: [deferredRendererResult], camera, lights})

    blurMta.uniformValue.u_isHorizontal = false
    blurMta.uniformValue.u_invPixelRatio = pixelRatioBase / blurRatio1
    blurMta.uniformValue.u_preEffectTexture = highlightTex
    blurMta.texture[0] = 'highlight'
    blurRenderer.render({meshs: [blurResult]})

    blurMta.uniformValue.u_isHorizontal = true
    blurMta.uniformValue.u_invPixelRatio = pixelRatioBase
    blurMta.uniformValue.u_preEffectTexture = blurTmpTex
    blurMta.texture[0] = 'blur1'
    blurRenderer2.render({meshs: [blurResult]})

    blurMta.uniformValue.u_isHorizontal = false
    blurMta.uniformValue.u_invPixelRatio = pixelRatioBase / blurRatio2
    blurMta.uniformValue.u_preEffectTexture = highlightTex
    blurMta.texture[0] = 'highlight'
    blurRendererLow1.render({meshs: [blurResult]})

    blurMta.uniformValue.u_isHorizontal = true
    blurMta.uniformValue.u_invPixelRatio = pixelRatioBase
    blurMta.uniformValue.u_preEffectTexture = blurTmpTex2
    blurMta.texture[0] = 'blur2'
    blurRendererLow2.render({meshs: [blurResult]})



    composedRenderer.render({meshs: [composedResult]})

    // effectMta.uniformValue.u_isHorizontal = false
    // effectMta.uniformValue.u_invPixelRatio = pixelRatioBase / blurRatio
    // effectMta.uniformValue.u_preEffectTexture = deferredRendererTexture
    // effectMta.texture[0] = 'deferred'
    // postEffectRenderer.render({meshs: [postEffectResult]})

    // effectMta.uniformValue.u_isHorizontal = true
    // effectMta.uniformValue.u_invPixelRatio = pixelRatioBase
    // effectMta.uniformValue.u_preEffectTexture = postBlurTexture
    // effectMta.texture[0] = 'blur1'
    // postEffectRenderer2.render({meshs: [postEffectResult]})

    // composedMta.uniformValue.u_preEffectTexture = deferredRendererTexture
  }

}