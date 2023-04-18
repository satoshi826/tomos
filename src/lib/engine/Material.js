import {oForEach} from '../util/util'

export class Material {
  constructor(core, {id, attributes, uniform, vert, frag, uniformValue}, texture) {

    this.core = core
    this.id = id
    this.attributes = attributes
    this.uniforms = uniform
    this.uniformValue = uniformValue ?? {}
    this.texture = []
    this.vert = vert
    this.frag = frag

    if (!core.program[id]) {
      core.setProgram(id, vert, frag)
      core.setUniLoc(id, uniform)
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

  render({idxLen}) {
    this.texture.forEach((tex) => {
      this.core.useTexture(tex)
    })
    this.core.gl.drawElements(this.core.gl.TRIANGLES, idxLen, this.core.gl.UNSIGNED_SHORT, 0)
  }


}