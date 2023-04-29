
import {mat} from './function/matrix'
import {setHandler} from './function/state'

let id = 0

export const rgba8 = ['RGBA', 'RGBA', 'UNSIGNED_BYTE']
export const rgba16f = ['RGBA16F', 'RGBA', 'HALF_FLOAT']
export const rgba32f = ['RGBA32F', 'RGBA', 'FLOAT']

const getDefaultUniformValue = {
  u_mvpMatrix         : ({self}) => self.matrix.mvp,
  u_modelMatrix       : ({mesh}) => mesh.matrix.model,
  u_normalMatrix      : ({mesh}) => mesh.matrix.normal,
  u_cameraPosition    : ({camera}) => camera.attributes.position,
  u_pointLightNum     : ({self}) => self.lightUniforms.u_pointLightNum,
  u_pointLightPosition: ({self}) => self.lightUniforms.u_pointLightPosition,
}

export class Renderer {

  matrix = {
    mvp: mat.create()
  }

  constructor(core, {height, width, backgroundColor, frameBuffer, pixelRatio, isScreen = true} = {}) {

    this.id = id++
    this.core = core
    this.pixelRatio = pixelRatio ?? this.core.pixelRatio
    this.width = width ?? core.canvasWidth
    this.height = height ?? core.canvasHeight
    this.backgroundColor = backgroundColor ?? [0, 0, 0, 1]
    this.isCanvas = !frameBuffer
    this.frameBuffer = null
    this.depthRenderBuffer = null
    this.renderTexture = []
    this.drawBuffers = [this.core.gl.BACK]
    this.lightUniforms = {}

    if (frameBuffer) this.setFrameBuffer(frameBuffer)
    if (isScreen) setHandler('resize', this.resize.bind(this))

  }

  resize({width = this.width, height = this.height, pixelRatio = this.pixelRatio} = {}) {
    const gl = this.core.gl
    this.width = width
    this.height = height
    gl.viewport(0, 0, width * pixelRatio, height * pixelRatio)
    if(this.isCanvas) {
      gl.canvas.width = width * pixelRatio
      gl.canvas.height = height * pixelRatio
    }else {
      gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthRenderBuffer)
      this.renderTexture.forEach((renderTexture) => {
        const {internalFormat, format, type} = renderTexture
        gl.bindTexture(gl.TEXTURE_2D, renderTexture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl[internalFormat], width * pixelRatio, height * pixelRatio, 0, gl[format], gl[type], null)
        gl.bindTexture(gl.TEXTURE_2D, null)
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width * pixelRatio, height * pixelRatio)
      })
      gl.bindRenderbuffer(gl.RENDERBUFFER, null)
    }
  }

  clear() {
    this.core.gl.clearColor(...this.backgroundColor)
    this.core.gl.clearDepth(1.0)
    this.core.gl.clear(this.core.gl.COLOR_BUFFER_BIT | this.core.gl.DEPTH_BUFFER_BIT)
  }

  render({meshs, camera, lights = []} = {}) {
    this.core.useRenderer(this)
    this.clear()
    this.setLight(lights)
    meshs.forEach(mesh => {
      this.draw(mesh, camera)
    })
  }

  setLight(lights) {
    const lightUniformsInit = {
      u_pointLightNum     : 0,
      u_pointLightPosition: []
    }
    this.lightUniforms = lightUniformsInit
    lights.forEach((light) => {
      light.update()
      if(light.isPoint) {
        this.lightUniforms.u_pointLightNum++
        this.lightUniforms.u_pointLightPosition.push(...light.worldPosition.slice(0, 3))
      }
    })
    this.lightUniforms.u_pointLightPosition = Float32Array.from(
      this.lightUniforms.u_pointLightPosition
    )
  }

  draw(mesh, camera) {
    const {geometory, material} = mesh
    material.useProgram()
    if (camera) this.setMVP(mesh, camera)
    this.useVao(geometory)
    this.setUniform(mesh, camera)
    material.render(geometory)
  }

  setMVP(mesh, camera) {
    mesh.update()
    camera.update()
    mat.mul(camera.matrix.vp, mesh.matrix.model, this.matrix.mvp)
  }

  useVao(geometory) {
    this.core.useVao(geometory.id)
  }

  setUniform(mesh, camera) {
    const uniMap = this.getUniMap(mesh, camera)
    this.core.setUniform(uniMap)
  }

  getUniMap(mesh, camera) {
    return mesh.material.uniforms.reduce((obj, key) => {
      const getUniformValue =
        getDefaultUniformValue[key] ?? (({mesh}) => mesh.material.uniformValue[key])
      const uniformValue = getUniformValue({mesh, camera, self: this})
      if (uniformValue === undefined) throw {error: `uniformValue ${key} is undefined`}
      obj[key] = uniformValue
      return obj
    }, {})
  }

  setFrameBuffer({texture}) {

    const gl = this.core.gl

    this.frameBuffer = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer)

    this.renderTexture = []
    texture.forEach(([internalFormat, format, type], i) => {
      this.renderTexture[i] = this.core.createTexture(this.width, this.height, internalFormat, format, type)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.TEXTURE_2D, this.renderTexture[i], 0)
      this.renderTexture[i].internalFormat = internalFormat
      this.renderTexture[i].format = format
      this.renderTexture[i].type = type
      this.drawBuffers[i] = gl.COLOR_ATTACHMENT0 + i
    })

    this.depthRenderBuffer = this.core.gl.createRenderbuffer()
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthRenderBuffer)
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height)
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.depthRenderBuffer)
    gl.bindRenderbuffer(gl.RENDERBUFFER, null)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }

}