import {Mesh} from './mesh'

export class MeshInstanced extends Mesh {

  instancedValues = null // {meshId : values}
  instancedVBO = {} // {meshId : vbo}

  constructor(core, {geometory, material, position, rotation, scale}, {offset, maxInstanced} = {}) {
    super(core, {geometory, material, position, rotation, scale})
    this.offset = offset
    this.maxInstanced = maxInstanced
  }

  hoge() {
    console.log('hoge')
    console.log(this.instancedVBO)
  }

  setOffset() {

  }

}