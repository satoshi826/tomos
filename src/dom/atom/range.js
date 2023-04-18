import {toCss, _} from '../../lib/theme'

export function range({id, info}) {

  // (() => {
  //   // const rangeE = _id(`range${id}`)
  //   // _gl.sendState({key: `range${id}`, value: rangeE.value})
  //   // rangeE._onInput((e) => _gl.sendState({key: `range${id}`, value: e.target.value}))
  // })._task(0)()

  return /* html */`
  <div style="${toCss(_.flex())}">
    <div style="${toCss({width: '50%'})}">${info}</div>
    <input id="range${id}" style="${toCss({width: '50%'})}" type="range" min="0" max="400" value="200"/>
  </div>
  `
}
