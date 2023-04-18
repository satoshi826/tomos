import {style, _} from '../../lib/theme'

const size = 24

export function toggle({id}) {

  // (() => {
  //   const toggleE = _id(`toggle${id}`)
  //   _gl.sendState({key: `toggle${id}`, value: toggleE.checked})
  //   toggleE._onInput(() => _gl.sendState({key: `toggle${id}`, value: toggleE.checked}))
  // })._task(0)()

  const activeBackground = {
    [`+#toggle${id}:checked`]: {
      ..._.bgC({type: 'primary', i: 1}),
    }
  }

  const activeInner = {
    [`+#toggle${id}:checked`]: {
      ..._.transX(size + 'px'),
      ..._.bgC({type: 'text', i: 0})
    }
  }

  style('#toggle-outer', toggleOuterC)
  style(`#toggle-background${id}`, {...toggleBackgroundC, ...activeBackground})
  style(`#toggle-inner${id}`, {...toggleInnerC, ...activeInner})
  style(`#toggle${id}`, toggleInputC)

  return /* html */`
    <div id="toggle-outer" >
      <input type="checkbox" id="toggle${id}" hidden>
      <label id="toggle-background${id}" for="toggle${id}"></label>
      <div id="toggle-inner${id}" ></div>
    </div>
  `
}

const toggleOuterC = {
  ..._.w(size * 2 + 'px'),
  ..._.h(size + 'px'),
  ..._.rlt,
}

const toggleBackgroundC = {
  ..._.bRd(size * 2 + 'px'),
  ..._.bgC({i: 3}),
  ..._.dur('0.4s'),
  cursor: 'pointer',
  ..._.abs,
  ..._.wh100,
}

const toggleInnerC = {
  ..._.bgC({type: 'text', i: 2}),
  ..._.wh(size + 'px'),
  ..._.bRd('50%'),
  ..._.dur('0.15s'),
  ..._.abs,
  ..._.nonEve,
}

const toggleInputC = {
  ..._.abs,
  ..._.wh('100%'),
}

