import {toCss, _} from '../../lib/theme'
import {idle, id, setT} from '../../lib/util/util'
import {sendState} from '../canvas'

export function range({key, info, min = 0, max = 100, init = 50}) {

  idle(0, () => {
    const rangeE = id(`range${key}`)
    const infoE = id(`range${key}info`)
    sendState({key: `range${key}`, value: rangeE.value})
    rangeE.oninput = (e) => {
      sendState({[`range${key}`]: e.target.value})
      setT(infoE, info + ' : ' + e.target.value)
    }
  })()

  return /* html */`
  <div style="${toCss(_.flex())}">
    <div id="range${key}info" style="${toCss({width: '60%'})}">${info} : ${init}</div>
    <input id="range${key}" style="${toCss({width: '40%'})}" type="range" min="${min}" max="${max}" value="${init}"/>
  </div>
  `
}
