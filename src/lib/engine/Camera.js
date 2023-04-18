import {mat} from './function/matrix'
import {setHandler} from './function/state'
import {oForEach} from '../util/util'

export class Camera {

  matrix = {
    v : mat.create(),
    p : mat.create(),
    vp: mat.create(),
  }
  isUpdate = true

  constructor({position, lookAt, up, fovy, near, far, aspect, isScreen = true, controller} = {}) {

    this.isScreen = isScreen
    this.controller = controller ?? {}
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
    this.isUpdate = true
  }

  resize({width = 1, height = 1} = {}) {
    this.attributes.aspect = width / height
    this.setVP()
  }

  update() {
    if(this.isUpdate) {
      this.setVP()
      this.isUpdate = false
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