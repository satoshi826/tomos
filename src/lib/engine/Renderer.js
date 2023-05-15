
import {mat} from './function/matrix'
import {setHandler} from './function/state'
import {oMapO, oForEach} from '../util/util'

let id = 0
export const rgba8 = ['RGBA', 'RGBA', 'UNSIGNED_BYTE', 'LINEAR']
export const rgba16f = ['RGBA16F', 'RGBA', 'HALF_FLOAT', 'LINEAR']
export const rgba32f = ['RGBA32F', 'RGBA', 'FLOAT', 'LINEAR']
export const depth = ['DEPTH_COMPONENT16', 'DEPTH_COMPONENT', 'UNSIGNED_SHORT', 'NEAREST']

const pointLightUniforms = {
  u_pointLightPosition : (light) => light.worldPosition,
  u_pointLightIntensity: (light) => light.attributes.intensity,
  u_pointLightExponent : (light) => light.attributes.exponent,
}

const getDefaultUniform = {
  u_mvpMatrix     : ({self}) => self.matrix.mvp,
  u_vpMatrix      : ({camera}) => camera.matrix.vp,
  u_modelMatrix   : ({mesh}) => mesh.matrix.model,
  u_normalMatrix  : ({mesh}) => mesh.matrix.normal,
  u_cameraPosition: ({camera}) => camera.attributes.position,
  u_near          : ({camera}) => camera.attributes.near,
  u_far           : ({camera}) => camera.attributes.far,
  u_pointLightNum : ({self}) => self.lightUniforms.u_pointLightNum,
  ...oMapO(pointLightUniforms, ([k]) => ({self}) => self.lightUniforms[k])
}

const getDefaultInstancedAttributes = {
  a_instance_modelMatrix : ({mesh}) => mesh.matrix.model,
  a_instance_normalMatrix: ({mesh}) => mesh.matrix.normal
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
    this.renderTexture = []
    this.depthTextureNum = null
    this.hasDepthTexture = null
    this.depthRenderBuffer = null
    this.drawBuffers = [this.core.gl.BACK]

    this.lightUniforms = {}

    this.instancedValues = null // {meshId : values}
    this.instancedVBO = {} // {meshId : vbo}

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
      if(!this.hasDepthTexture) gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthRenderBuffer)
      this.renderTexture.forEach((renderTexture) => {
        const {internalFormat, format, type} = renderTexture
        gl.bindTexture(gl.TEXTURE_2D, renderTexture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl[internalFormat], width * pixelRatio, height * pixelRatio, 0, gl[format], gl[type], null)
        gl.bindTexture(gl.TEXTURE_2D, null)
        if(!this.hasDepthTexture) gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width * pixelRatio, height * pixelRatio)
      })
      gl.bindRenderbuffer(gl.RENDERBUFFER, null)
    }
  }

  clear() {
    this.core.gl.clearColor(...this.backgroundColor)
    this.core.gl.clearDepth(1.0)
    this.core.gl.clear(this.core.gl.COLOR_BUFFER_BIT | this.core.gl.DEPTH_BUFFER_BIT)
  }

  render({meshs, camera, lights} = {}) {
    this.core.useRenderer(this)
    this.clear()
    this.instancedValues = null
    lights && this.setLight(lights)
    camera && camera.update()
    meshs.forEach(mesh => {
      mesh.update()
      if (mesh.material.instancedAttributes) {
        this.setInstancedAttributes(mesh)
      }else{
        this.draw(mesh, camera)
      }
    })
    this.instancedValues && this.drawInstanced(meshs, camera)
  }

  setLight(lights) {
    const lightUniformsInit = {
      u_pointLightNum: 0,
      ...oMapO(pointLightUniforms, () => [])
    }
    this.lightUniforms = lightUniformsInit
    lights.forEach((light) => {
      light.update()
      if(light.isPoint) {
        this.lightUniforms.u_pointLightNum++
        oForEach(pointLightUniforms, ([k, v]) => {
          this.lightUniforms[k].push(v(light))
        })
      }
    })
    oForEach(pointLightUniforms, ([k]) => {
      this.lightUniforms[k] = Float32Array.from(this.lightUniforms[k].flat())
    })
  }

  draw(mesh, camera) {
    const {geometory, material} = mesh
    material.useProgram()
    if (camera) this.setMVP(mesh, camera)
    this.useVao(geometory)
    this.setUniform({mesh, camera})
    material.render(geometory)
  }

  setInstancedAttributes(mesh) {
    this.instancedValues ??= {}
    this.instancedValues[mesh.id] ??= {}

    mesh.material.instancedAttributes.forEach((att) => {
      if (!this.instancedValues[mesh.id][att]) {
        const strideSize = this.core.getStrideSize(att)
        this.instancedValues[mesh.id][att] = {
          counter: 0,
          value  : new Float32Array(mesh.material.maxInstance * strideSize)
        }
      }
    })

    mesh.material.instancedAttributes.forEach((att) => {
      const getAttributeValue = getDefaultInstancedAttributes[att] ?? (({mesh}) => mesh.material.instancedValue[att])
      const strideSize = this.core.getStrideSize(att)
      let targetAtt = this.instancedValues[mesh.id][att]
      const attributeValue = getAttributeValue({mesh})
      for (let i = 0; i < strideSize; i++) {
        targetAtt.value[i + targetAtt.counter * strideSize] = attributeValue[i]
      }
      targetAtt.counter++
    })
  }

  drawInstanced(meshs, camera) {
    oForEach(this.instancedValues, ([meshId, attributes]) => {
      const instancedMesh = meshs.filter(({id}) => id === meshId)
      const instancedNum = instancedMesh.length
      const instancedMeshSample = instancedMesh[0]
      const {material, geometory} = instancedMeshSample
      this.useVao(geometory)
      this.instancedVBO[meshId] ??= this.core.createInstancedVbo(attributes)
      material.useProgram()
      this.setUniform({mesh: instancedMeshSample, camera})
      this.core.updateInstancedVbo(this.instancedVBO[meshId], attributes)
      material.render(geometory, instancedNum)
    })
  }

  setMVP(mesh, camera) {
    mat.mul(camera.matrix.vp, mesh.matrix.model, this.matrix.mvp)
  }

  useVao(geometory) {
    this.core.useVao(geometory.id)
  }

  setUniform({mesh, camera}) {
    const uniMap = mesh.material.uniforms.reduce((obj, key) => {
      const getUniformValue = getDefaultUniform[key] ?? (({mesh}) => mesh.material.uniformValue[key])
      const uniformValue = getUniformValue({mesh, camera, self: this})
      if (uniformValue === undefined) throw {error: `uniformValue ${key} is undefined`}
      obj[key] = uniformValue
      return obj
    }, {})
    this.core.setUniform(uniMap)
  }

  setFrameBuffer({texture}) {
    const gl = this.core.gl

    this.frameBuffer = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer)

    this.depthTextureNum = texture.findIndex(([, format]) => format === 'DEPTH_COMPONENT')
    if (this.depthTextureNum === -1) this.depthTextureNum = null
    this.hasDepthTexture = this.depthTextureNum !== null

    this.renderTexture = []
    texture.forEach(([internalFormat, format, type, filter], i) => {

      const isDepth = i === this.depthTextureNum
      const attachment = isDepth ? gl.DEPTH_ATTACHMENT : gl.COLOR_ATTACHMENT0 + i

      this.renderTexture[i] = this.core.createTexture(this.width, this.height, internalFormat, format, type, filter)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_2D, this.renderTexture[i], 0)
      this.renderTexture[i].internalFormat = internalFormat
      this.renderTexture[i].format = format
      this.renderTexture[i].type = type
      if (!isDepth) this.drawBuffers[i] = attachment
    })

    if(!this.hasDepthTexture) {
      this.depthRenderBuffer = this.core.gl.createRenderbuffer()
      gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthRenderBuffer)
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height)
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.depthRenderBuffer)
    }

    gl.bindRenderbuffer(gl.RENDERBUFFER, null)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }

}