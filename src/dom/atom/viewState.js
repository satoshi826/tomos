import {idle, state, id, setT} from '../../lib/util/util'

export function viewState({key}) {

  idle(0, () => {
    const watch = state({key})[0]
    const viewE = id(`view-${key}`)
    watch((v) => setT(viewE, key + ' : ' + v))
  })()

  return /* html */`
      <div id="view-${key}">
        ${key} : wait...
      </div>
  `
}
