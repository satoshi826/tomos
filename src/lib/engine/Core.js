import {oForEach, keys} from '../util/util'

const strideMap = {
  a_position    : 3,
  a_normal      : 3,
  a_textureCoord: 2
}

const attLocMap = {
  a_position    : 0,
  a_normal      : 1,
  a_color       : 2,
  a_textureCoord: 3
}

const uniTypeMap = {
  u_mvpMatrix     : [true, 'uniformMatrix4fv'],
  u_modelMatrix   : [true, 'uniformMatrix4fv'],
  u_normalMatrix  : [true, 'uniformMatrix4fv'],
  u_invMatrix     : [true, 'uniformMatrix4fv'],
  u_cameraPosition: [false, 'uniform3fv'],

  u_color              : [false, 'uniform3fv'],
  u_pointLightNum      : [false, 'uniform1i'],
  u_pointLightPosition : [false, 'uniform3fv'],
  u_pointLightIntensity: [false, 'uniform1fv'],
  u_pointLightExponent : [false, 'uniform1fv'],

  u_positionTexture: [false, 'uniform1i'],
  u_normalTexture  : [false, 'uniform1i'],
  u_colorTexture   : [false, 'uniform1i'],
  u_depthTexture   : [false, 'uniform1i'],

  u_preEffectTexture : [false, 'uniform1i'],
  u_postEffectTexture: [false, 'uniform1i'],
  u_blurTexture1     : [false, 'uniform1i'],
  u_blurTexture2     : [false, 'uniform1i'],
  u_blurTexture3     : [false, 'uniform1i'],

  u_isHorizontal : [false, 'uniform1i'],
  u_invPixelRatio: [false, 'uniform1i'],

  u_near: [false, 'uniform1f'],
  u_far : [false, 'uniform1f'],
}

export class Core {

  program = {} // {id : program}
  vao = {} // {id : vao}
  uniLoc = {}
  texture = {}

  preUniformMap = {}

  currentRenderer = null
  currentProgram = null
  currentVao = null

  constructor({canvas, pixelRatio}) {
    this.gl = canvas.getContext('webgl2')

    this.canvasWidth = this.gl.canvas.width
    this.canvasHeight = this.gl.canvas.height
    this.pixelRatio = pixelRatio

    this.gl.enable(this.gl.DEPTH_TEST)
    this.gl.enable(this.gl.CULL_FACE)
    this.gl.depthFunc(this.gl.LEQUAL)
    this.gl.enable(this.gl.BLEND)

    // this.gl.cullFace(this.gl.BACK)

    this.gl.getExtension('EXT_color_buffer_float')
    this.gl.getExtension('EXT_float_blend')
    this.gl.getExtension('OES_texture_half_float')
    this.gl.getExtension('OES_texture_half_float_linear')
    this.gl.getExtension('OES_texture_float')
    this.gl.getExtension('OES_texture_float_linear')
  }

  _compile(txt, type) {
    let shader = this.gl.createShader(this.gl[`${type}_SHADER`])
    this.gl.shaderSource(shader, txt)
    this.gl.compileShader(shader)
    if(this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) return shader
    const log = this.gl.getShaderInfoLog(shader)
    console.error('compile error')
    console.error(log)
  }

  _link(v, f) {
    let program = this.gl.createProgram()
    this.gl.attachShader(program, v)
    this.gl.attachShader(program, f)
    this.gl.linkProgram(program)
    if(this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) return program
    const log = this.gl.getShaderInfoLog(program)
    console.error(log)
  }

  setProgram(id, vText, fText) {
    const shaderV = this._compile(vText, 'VERTEX')
    const shaderF = this._compile(fText, 'FRAGMENT')
    const prg = this._link(shaderV, shaderF)
    this.program[id] = prg
  }

  useProgram(id) {
    if (id !== this.currentProgram) {
      this.gl.useProgram(this.program[id])
      this.currentProgram = id
    }
  }

  setUniLoc(mName, uniforms) {
    this.uniLoc[mName] = {}
    uniforms.forEach(uni => this.uniLoc[mName][uni] = this.gl.getUniformLocation(this.program[mName], uni))
  }

  setVao({id, index, attributes}) {
    let vao = this.gl.createVertexArray()
    this.gl.bindVertexArray(vao)
    oForEach(attributes, ([k, v]) => {
      if (v === undefined) return
      let vbo = this.gl.createBuffer()
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo)
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(v), this.gl.STATIC_DRAW)
      this.gl.enableVertexAttribArray(attLocMap[k])
      this.gl.vertexAttribPointer(attLocMap[k], strideMap[k], this.gl.FLOAT, false, 0, 0)
    })
    if(index) {
      let ibo = this.gl.createBuffer()
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo)
      this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Int16Array(index), this.gl.STATIC_DRAW)
    }
    this.gl.bindVertexArray(null)
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null)
    this.vao[id] = vao
  }

  useVao(geoId) {
    if (geoId !== this.currentVao) {
      // console.log('set Vao', geoId)
      this.gl.bindVertexArray(this.vao[geoId])
      this.currentVao = geoId
    }
  }

  setUniform(uniMap) {
    oForEach(uniMap, ([k, v]) => {
      if(v === undefined) throw {error: ' uniformValue is undefined', k, v}
      const uniType = uniTypeMap[k]
      if (!uniType) throw {error: ' uniform type is not defined', k, v}
      const [isMat, method] = uniTypeMap[k]
      const params = isMat ? [false, v] : [v]
      this.gl[method](this.uniLoc[this.currentProgram][k], ...params)
    })
  }

  useRenderer({id, pixelRatio, width, height, frameBuffer, drawBuffers}) {
    if (id !== this.currentRenderer) {
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, frameBuffer)
      this.gl.drawBuffers(drawBuffers)
      this.gl.viewport(0, 0, width * pixelRatio, height * pixelRatio)
      this.currentRenderer = id
    }
  }

  createTexture(width, height, internalFormat, format, type) {
    const texture = this.gl.createTexture()
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl[internalFormat], width / 2, height / 2, 0, this.gl[format], this.gl[type], null)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)
    this.gl.bindTexture(this.gl.TEXTURE_2D, null)
    return texture
  }

  setTexture(key, data) {
    if(this.texture[key]) {
      this.texture[key] = {...this.texture[key], data}
      return this.texture[key].textureNum
    }
    const textureNum = keys(this.texture).length
    this.texture[key] = {data, number: textureNum}
    return textureNum
  }

  useTexture(key) {
    const {data, number} = this.texture[key]
    if (data) {
      this.gl.activeTexture(this.gl[`TEXTURE${number}`])
      this.gl.bindTexture(this.gl.TEXTURE_2D, data)
    }
  }

}