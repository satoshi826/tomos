import {id, state, idle} from '../../lib/util/util'
import {style, _, toCss, is} from '../../lib/theme'
import {viewState} from '../atom/viewState'
import {toggle} from '../atom/toggle'

export function side() {

  idle(0, toggleSideber)()
  idle(0, dragSideber)()

  style('#sidebar', is('mobile') ? closedSideBarC : sideBarC)
  style.responsive('mobile')('#sidebar', sideBarMobileC)

  const setToggle = (caption, id) => /* html */`
    <div style="${toCss({..._.flex({align: 'center', justify: 'space-between'}), ..._.minW('180px')})}">
      ${caption}
      ${toggle({id})}
    </div>
  `

  return /* html */`
    <div id="sidebar">
      <div></div>
      ${viewState({key: 'drawTime'})}
      <div></div>
      ${setToggle('shadowMap', 1)}
    </div>
  `
}

//----------------------------------------------------------------

const sideBarC = {
  ..._.bgC({i: 2}),
  ..._.flex({col: true, align: 'center', gap: '20px'}),
  ..._.py('20px'),
  ..._.dur('0.35s'),
  ..._.minW('var(--sidebar-width)'),
  ..._.h100,
  ..._.rlt,
  zIndex     : 1000,
  borderRight: '1.5px solid var(--background2)',
}

const closeC = _.transX('calc(-1 *var(--sidebar-width))')

const closedSideBarC = {...sideBarC, ...closeC}

const sideBarMobileC = {
  ..._.bgC({i: 1, alpha: 0.4}),
  backdropFilter: 'blur(8px) saturate(60%)',
}

//----------------------------------------------------------------

const toggleSideber = () => {
  const sideBarE = id('sidebar')
  const menuButtonE = id('menu-button')
  const [watchIsOpen, setIsOpen] = state({key: 'isOpenSidebar'})
  const [watchIsMobile,, getIsMobile] = state({key: 'isMobile'})

  const closeSidebar = (e) => {
    if ((!sideBarE.contains(e.target)) && (!menuButtonE.contains(e.target))) setIsOpen(false)
  }

  watchIsOpen((isOpen) => {
    style('#sidebar', isOpen ? sideBarC : closedSideBarC)
    document.removeEventListener('mousedown', closeSidebar)
    if (isOpen && getIsMobile()) document.addEventListener('mousedown', closeSidebar)
  })

  watchIsMobile((isMobile) => {
    if(isMobile) {
      document.addEventListener('mousedown', closeSidebar)
    } else{
      document.removeEventListener('mousedown', closeSidebar)
    }
  })
}

const dragSideber = () => {
  const watch = state({key: 'isMobile'})[0]
  const set = state({key: 'isOpenSidebar'})[1]
  const sideBarE = id('sidebar')

  let width = sideBarE.offsetWidth
  let start = null
  let now = null
  watch((isMobile) => {
    if (!isMobile) {
      sideBarE.ontouchstart = null
      sideBarE.ontouchmove = null
      sideBarE.ontouchend = null
    }
    sideBarE.ontouchmove = ({changedTouches}) => {
      const {clientX} = changedTouches[0]
      start ??= clientX
      now = clientX
      const position = Math.max(0, (start - now))
      sideBarE.setAttribute('style', `transform: translateX(-${position}px); transition: all 0s;`)
      if ((width / 2) < position) set(false)
    }
    sideBarE.ontouchend = () => {
      start = null
      now = null
      sideBarE.setAttribute('style', '')
    }
  })
}