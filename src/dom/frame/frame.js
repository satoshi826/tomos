import {task, state} from '../../lib/util/util'
import {style, _, is} from '../../lib/theme'

export function frame({top = '', side = '', content = '', bottom = ''}) {

  task(0, () => {
    const watch = state({key: 'isOpenSidebar', init: !is('mobile')})[0]
    watch((isOpen) => {
      style('#frame-inner2', isOpen ? inner2C : closedInner2C)
    })
  })()

  style('#frame-outer', outerC)
  style('#frame-inner', innerC)
  style('#frame-inner2', is('mobile') ? closedInner2C : inner2C)
  style.responsive('mobile')('#frame-inner2', inner2MobileC)

  return /* html */`
    <div id="frame-outer" >
      ${top}
      <div id="frame-inner">
        ${side}
        <div id="frame-inner2">
          ${content}
          ${bottom}
        </div>
      </div>
    </div>
  `
}

const outerC = {
  ..._.flex({col: true}),
  ..._.wh('100%'),
  ..._.maxH('100%'),
  overflowX: 'hidden',
}

const innerC = {
  ..._.flex(),
  ..._.wh('100%'),
  ..._.rlt
}

const inner2C = {
  ..._.flex({col: true}),
  ..._.h('100%'),
  ..._.dur('0.35s'),
  ..._.minW('calc(100% - var(--sidebar-width))'),
}

const inner2CloseC = {
  ..._.minW('100vw'),
  ..._.transX('calc(-1 *var(--sidebar-width))')
}

const closedInner2C = {...inner2C, ...inner2CloseC}

const inner2MobileC = {
  ..._.abs,
  ..._.dur('0s'),
  ..._.minW('100vw'),
  ..._.transX('0px')
}