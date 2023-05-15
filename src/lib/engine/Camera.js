import {mat} from './function/matrix'
import {setHandler} from './function/state'

export class Camera {

  ver = 0
  preVer = -1
  preParentVer = -1

  matrix = {
    v : mat.create(),
    p : mat.create(),
    vp: mat.create(),
  }

  parent = null

  constructor({position, lookAt, up, fovy, near, far, aspect, isScreen = true} = {}) {

    this.isScreen = isScreen
    this.attributes = {
      aspect  : 1 ?? aspect,
      position: position ?? [0.0, 0.0, 10.0],
      lookAt  : lookAt ?? [0.0, 0.0, 0.0],
      up      : up ?? [0.0, 1.0, 0.0],
      fovy    : fovy ?? 50,
      near    : near ?? 0.1,
      far     : far ?? 100,
    }
    if (isScreen) setHandler('resize', this.resize.bind(this))
    this.update()

  }

  mutate(att, func) {
    this.attributes[att] = func(this.attributes[att])
    this.ver++
  }

  resize({width = 1, height = 1} = {}) {
    this.attributes.aspect = width / height
    this.setVP()
  }

  update() {

    const isUpdateLocal = this.preVer < this.ver
    const isParent = this.parent
    const isUpdateParent = isParent && (this.preParentVer < this.parent.ver)

    if(isUpdateLocal) {
      this.setVP()
      this.preVer = this.ver
    }

    if(isUpdateParent || (isUpdateLocal && isParent)) {
      // this.setWorld()
      this.preParentVer = this.parent.ver
    }

  }

  setVP() {
    const {position, lookAt, up, fovy, aspect, near, far} = this.attributes
    const {v, p, vp} = this.matrix
    mat.look(position, lookAt, up, v)
    mat.pers(fovy, aspect, near, far, p)
    mat.mul(p, v, vp)
  }

}