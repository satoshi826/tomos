import {mat} from './function/matrix'
let id = 0

export class PointLight {

  ver = 0
  preVer = -1
  preParentVer = -1
  isPoint = true

  matrix = {
    local: mat.create(),
    model: mat.create()
  }

  worldPosition = mat.createVec()

  parent = null

  constructor({position, intensity, exponent} = {}) {

    this.uid = id++
    this.attributes = {
      position : position ?? [0, 0, 0],
      intensity: intensity ?? 1.0,
      exponent : exponent ?? 0.0,
    }
  }

  mutate(func) {
    func(this.attributes)
    this.ver++
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
    const {position} = this.attributes
    let {local} = this.matrix
    mat.reset(local)
    mat.move(local, position, local)
  }

  setWorld() {
    let {model, local} = this.matrix
    mat.mul(this.parent.matrix.model, local, model)
    this.setWorldVec()
  }

  setLocalToWorld() {
    let {local, model} = this.matrix
    mat.copy(local, model)
    this.setWorldVec()
  }

  setWorldVec() {
    let {model} = this.matrix
    mat.mulVec(model, [0, 0, 0, 1], this.worldPosition)
    this.worldPosition = this.worldPosition.slice(0, 3)
  }

}

export class SpotLight {

}

export class AmbientLight {

}