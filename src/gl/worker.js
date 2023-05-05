self.window ??= self
import {main} from './main'
import {Core} from '../lib/engine/core'
import {setState} from '../lib/engine/function/state'

onmessage = ({data}) => {
  data.init && init(data.init)
  data.resize && resize(data.resize)
  data.mouse && mouse(data.mouse)
  data.keyDown && keyDown(data.keyDown)
  data.state && state(data.state)
}

function init(init) {
  const core = new Core(init)
  main(core)
}

function resize(resize) {
  setState({resize})
}

function mouse(mouse) {
  setState({mouse})
}

function keyDown(keyDown) {
  setState(keyDown)
}

function state(state) {
  setState(state)
}