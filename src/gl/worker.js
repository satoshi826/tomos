self.window ??= self
import {main} from './main'
import {Core} from '../lib/engine/core'
import {setState} from '../lib/engine/function/state'

onmessage = ({data}) => {
  data.init && init(data.init)
  data.resize && resize(data.resize)
  data.mouse && mouse(data.mouse)
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