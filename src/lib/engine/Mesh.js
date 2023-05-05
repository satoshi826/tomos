import {mat} from './function/matrix'
import {oForEach} from '../util/util'
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

  constructor(core, {geometory, material, position, rotation, scale, controller}) {

    this.core = core
    this.id = geometory.id + '-' + material.id
    this.uid = uid++
    this.geometory = geometory
    this.material = material
    this.attributes = {
      position: position ?? [0, 0, 0],
      rotation: rotation ?? [0, [0, 1, 0]],
      scale   : scale ?? [1, 1, 1]
    }
    this.controller = controller ?? {}
    this.setLocal()
  }

  setControl(obj) {
    oForEach(obj, (([k, v]) => {
      this.controller[k] = v
    }))
  }

  control(controller, v) {
    this.controller[controller](this, v)
  }

  mutate(func) {
    func(this.attributes)
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
    mat.move(local, position, local)
    mat.rot(local, rotation[0], rotation[1], local)
    mat.scale(local, scale, local)
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

}