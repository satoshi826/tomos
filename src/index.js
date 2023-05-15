import {id, setH} from './lib/util/util'
import {init, _, style} from './lib/theme'
import {frame} from './dom/frame/frame'
import {tool} from './dom/frame/tool'
// import {nav} from './dom/frame/nav'
import {side} from './dom/frame/side'
import {canvas} from './dom/canvas'

init()

setH(id('app'), `
${frame({
    top    : tool(),
    side   : side(),
    content: canvas(),
    // bottom : nav()
  })}
`)

const appC = {
  ..._.wh100,
  ..._.flex({col: true}),
  ..._.bgC(),
  ..._.txC(),
  WebkitTapHighlightColor: 'rgba(0,0,0,0)',
}

style('#app', appC)
