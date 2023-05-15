import {mat} from './function/matrix'
let uid = 0

export class Mesh {

  ver = 0
  preVer = -1
  preParentVer = -1

  matrix = {
    local : mat.create(),
    model : mat.create(),
    normal: mat.create()
  }
  parent = null
  children = []

  constructor(core, {geometory, material, position, rotation, scale}) {

    this.core = core
    this.id = geometory.id + '-' + material.id
    this.uid = uid++
    this.geometory = geometory
    this.material = material
    this.attributes = {
      position: position,
      rotation: this.normalizeRot(rotation),
      scale   : this.normalizeSca(scale)
    }
    this.setLocal()
  }

  mutate(att, func) {
    this.attributes[att] = func(this.attributes[att])
    this.ver++
  }

  add(child) {
    this.children.push(child)
    child.parent = this
  }

  update() {
    const isUpdateLocal = this.preVer < this.ver
    const isParent = this.parent
    const isUpdateParent = isParent && (this.preParentVer < this.parent.ver)

    if(isUpdateLocal) {
      this.setLocal()
      this.preVer = this.ver
      if(!isParent) {
        this.setLocalToWorld()
      }
    }
    if(isUpdateParent || (isUpdateLocal && isParent)) {
      this.setWorld()
      this.preParentVer = this.parent.ver
    }
  }

  setLocal() {
    const {position, rotation, scale} = this.attributes
    let {local} = this.matrix
    mat.reset(local)
    if (position) mat.move(local, position, local)
    if (rotation) mat.rot(local, rotation[0], rotation[1], local)
    if (scale) mat.scale(local, scale, local)
  }

  setWorld() {
    let {model, local} = this.matrix
    mat.mul(this.parent.matrix.model, local, model)
    this.setNormal()
  }

  setLocalToWorld() {
    let {local, model} = this.matrix
    mat.copy(local, model)
    this.setNormal()
  }

  setNormal() {
    let {model, normal} = this.matrix
    mat.inv(model, normal)
    mat.trans(normal, normal)
  }

  normalizeRot(rotation) {
    if(!rotation) return null
    let axis = rotation[1]
    let sq = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2])
    if(sq !== 1) {
      rotation[1][0] = rotation[1][0] / sq
      rotation[1][1] = rotation[1][1] / sq
      rotation[1][2] = rotation[1][2] / sq
    }
    return rotation
  }

  normalizeSca(scale) {
    if(!scale) return null
    if(scale.length) return scale
    return [scale, scale, scale]
  }

}