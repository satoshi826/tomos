import {oForEach, oMapO, keys, range} from '../util/util'

export class Core {

  program = {} // {id : program}
  vao = {} // {id : vao}
  uniLoc = {} // {programName : {uniformName : location}}
  texture = {} // {name : {data, number}}

  currentRenderer = null
  currentProgram = null
  currentVao = null

  constructor({canvas, pixelRatio}) {

    this.gl = canvas.getContext('webgl2')
    console.log(this.gl.getParameter(this.gl.MAX_VERTEX_ATTRIBS))

    this.canvasWidth = this.gl.canvas.width
    this.canvasHeight = this.gl.canvas.height
    this.pixelRatio = pixelRatio

    this.gl.enable(this.gl.DEPTH_TEST)
    this.gl.enable(this.gl.CULL_FACE)
    this.gl.depthFunc(this.gl.LEQUAL)
    this.gl.enable(this.gl.BLEND)

    this.gl.getExtension('EXT_color_buffer_float')
    this.gl.getExtension('EXT_float_blend')
    this.gl.getExtension('OES_texture_half_float')
    this.gl.getExtension('OES_texture_half_float_linear')
    this.gl.getExtension('OES_texture_float')
    this.gl.getExtension('OES_texture_float_linear')
    this.gl.getExtension('WEBGL_color_buffer_float')
    this.gl.getExtension('WEBGL_depth_texture') || this.gl.getExtension('MOZ_WEBGL_depth_texture') || this.gl.getExtension('WEBKIT_WEBGL_depth_texture')
    this.gl.getExtension('OES_vertex_array_object')
    this.gl.getExtension('ANGLE_instanced_arrays')
    this.gl.getExtension('WEBGL_draw_buffers')
    this.gl.getExtension('WEBGL_multi_draw')
    this.gl.getExtension('OES_standard_derivatives')
    this.gl.getExtension('OES_element_index_uint')
    this.gl.getExtension('WEBGL_multisampled_render_to_texture')
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
      this.enableAttribute(k)
    })
    if(index) {
      let ibo = this.gl.createBuffer()
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo)
      this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Int16Array(index), this.gl.STATIC_DRAW)
    }
    this.gl.bindVertexArray(null)
    this.vao[id] = vao
  }

  useVao(geoId) {
    if (geoId !== this.currentVao) {
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

  createInstancedVbo(attributes) {
    const instancedVbo = oMapO(attributes, ([att]) => {
      const isUnitAtt = typeof strideMap[att] === 'number'
      let vbo = this.gl.createBuffer()
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo)
      this.gl.bufferData(this.gl.ARRAY_BUFFER, attributes[att].value, this.gl.DYNAMIC_DRAW)
      this.gl.vertexAttribDivisor(attLocMap[att], 1)
      if (isUnitAtt) {
        this.gl.vertexAttribDivisor(attLocMap[att], 1)
      }else{
        const row = strideMap[att][0]
        range(row).forEach((i) => {
          this.gl.vertexAttribDivisor(attLocMap[att] + i, 1)
        })
      }
      return vbo
    })
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
    return instancedVbo
  }

  updateInstancedVbo(vbo, attributes) {
    oForEach(vbo, ([att, v]) => {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, v)
      this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, attributes[att].value)
      this.enableAttribute(att)
    })
  }

  enableAttribute(att) {
    const isUnitAtt = typeof strideMap[att] === 'number'
    if (isUnitAtt) {
      this.gl.enableVertexAttribArray(attLocMap[att])
      this.gl.vertexAttribPointer(attLocMap[att], strideMap[att], this.gl.FLOAT, 0, 0, 0)
    }else{
      const row = strideMap[att][0]
      const col = strideMap[att][1]
      for (let i = 0; i < row; i++) {
        this.gl.enableVertexAttribArray(attLocMap[att] + i)
        this.gl.vertexAttribPointer(attLocMap[att] + i, col, this.gl.FLOAT, 0, row * col * 4, i * col * 4)
      }
    }
  }

  getStrideSize(att) {
    const isUnitAtt = !strideMap[att].length
    return isUnitAtt ? strideMap[att] : strideMap[att][0] * strideMap[att][1]
  }

  useRenderer({id, pixelRatio, width, height, frameBuffer, drawBuffers}) {
    if (id !== this.currentRenderer) {
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, frameBuffer)
      this.gl.drawBuffers(drawBuffers)
      this.gl.viewport(0, 0, width * pixelRatio, height * pixelRatio)
      this.currentRenderer = id
    }
  }

  createTexture(width, height, internalFormat, format, type, filter) {
    const texture = this.gl.createTexture()
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl[internalFormat], width / 2, height / 2, 0, this.gl[format], this.gl[type], null)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl[filter])
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl[filter])
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
    return new Number(textureNum)
  }

  useTexture(key) {
    const {data, number} = this.texture[key]
    if (data) {
      this.gl.activeTexture(this.gl[`TEXTURE${number}`])
      this.gl.bindTexture(this.gl.TEXTURE_2D, data)
    }
  }
}

//------------------------------------------------------------------------------

export const strideMap = {
  a_position             : 3,
  a_normal               : 3,
  a_color                : 4,
  a_textureCoord         : 2,
  a_instance_color       : 4,
  a_instance_modelMatrix : [4, 4], // 16
  a_instance_normalMatrix: [4, 4], // 16
}

const attLocMap = {
  a_position             : 0,
  a_normal               : 1,
  a_color                : 2,
  a_textureCoord         : 3,
  a_instance_color       : 4,
  a_instance_modelMatrix : 5,
  a_instance_normalMatrix: 9,
}

const uniTypeMap = {
  u_vpMatrix      : [true, 'uniformMatrix4fv'],
  u_modelMatrix   : [true, 'uniformMatrix4fv'],
  u_mvpMatrix     : [true, 'uniformMatrix4fv'],
  u_normalMatrix  : [true, 'uniformMatrix4fv'],
  u_cameraPosition: [false, 'uniform3fv'],

  u_color: [false, 'uniform4fv'],

  u_pointLightNum      : [false, 'uniform1i'],
  u_pointLightPosition : [false, 'uniform3fv'],
  u_pointLightIntensity: [false, 'uniform1fv'],
  u_pointLightExponent : [false, 'uniform1fv'],

  u_positionTexture: [false, 'uniform1i'],
  u_normalTexture  : [false, 'uniform1i'],
  u_colorTexture   : [false, 'uniform1i'],
  u_depthTexture   : [false, 'uniform1i'],

  u_preEffectTexture: [false, 'uniform1i'],
  u_blurTexture1    : [false, 'uniform1i'],
  u_blurTexture2    : [false, 'uniform1i'],
  u_blurTexture3    : [false, 'uniform1i'],

  u_isHorizontal : [false, 'uniform1i'],
  u_invPixelRatio: [false, 'uniform1i'],

  u_near: [false, 'uniform1f'],
  u_far : [false, 'uniform1f'],
}

//------------------------------------------------------------------------------
