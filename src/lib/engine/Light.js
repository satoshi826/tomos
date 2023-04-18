import {mat} from './function/matrix'
let id = 0

export class PointLight {

  ver = 0
  preVer = -1
  preParentVer = -1
  type = 'pointLight'

  matrix = {
    local: mat.create(),
    m    : mat.create()
  }

  uniform = {
    u_pointLightPotion: mat.createVec()
  }

  parent = null

  constructor(core, {position} = {}) {

    this.core = core
    this.uid = id++
    this.attributes = {
      position: position ?? [0, 0, 0],
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
    let {m, local} = this.matrix
    mat.mul(this.parent.matrix.m, local, m)
    this.setWorldVec()
  }

  setLocalToWorld() {
    let {local, m} = this.matrix
    mat.copy(local, m)
    this.setWorldVec()
  }

  setWorldVec() {
    let {m} = this.matrix
    mat.mulVec(m, [0, 0, 0, 1], this.uniform.u_pointLightPotion)
  }

}