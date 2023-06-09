import {style, _, icon} from '../../lib/theme'

export function nav() {

  style('#navbar', navBarC)

  return /* html */`
    <div id="navbar">
      ${icon('chat', {size: '32px'})}
      ${icon('home', {size: '32px'})}
      ${icon('settings', {size: '32px'})}
    </div>
  `
}

const navBarC = {
  ..._.bgC({i: 1}),
  ..._.px('12px'),
  ..._.flex({align: 'center', justify: 'space-around'}),
  ..._.minH('var(--navbar-height)'),
  borderTop: '1px solid var(--backgorund0)',
}