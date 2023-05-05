import {oForEach} from '../util/util'

export class Material {
  constructor(core, {id, attributes, uniforms, vert, frag, uniformValue, instancedAttributes, instancedValue, maxInstance}, texture) {

    this.core = core
    this.id = id
    this.attributes = attributes
    this.uniforms = uniforms
    this.uniformValue = uniformValue ?? {}
    this.texture = []
    this.vert = vert
    this.frag = frag

    this.instancedAttributes = instancedAttributes ?? null
    this.instancedValue = instancedValue ?? null
    this.maxInstance = maxInstance ?? 8000

    this.renderer = instancedValue
      ? (...arg) => this.core.gl.drawElementsInstanced(...arg)
      : (...arg) => this.core.gl.drawElements(...arg)

    if (!core.program[id]) {
      core.setProgram(id, vert, frag)
      core.setUniLoc(id, uniforms)
    }

    if(texture) {
      oForEach(texture, (([uniform, data], i) => {
        const textureNum = core.setTexture(uniform, data)
        this.uniformValue[uniform] = textureNum
        this.texture[i] = uniform
      }))
    }

  }

  useProgram() {
    this.core.useProgram(this.id)
  }

  render({idxLen}, instancedNum) {
    this.texture.forEach((tex) => {
      this.core.useTexture(tex)
    })
    this.renderer(this.core.gl.TRIANGLES, idxLen, this.core.gl.UNSIGNED_SHORT, 0, instancedNum)
  }

}