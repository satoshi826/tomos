import {id, qs, endH, setT, oReduce, oForEach, oMap, state, capitalize} from '../util/util'

import {snippets} from './snippets'
import {resetCss} from './resetCss'
import {shape} from './shape'
import {palette} from './palette'
import {breakpoints} from './breakpoints'

const head = qs('head')

export const _ = snippets

export const toCss = (obj) => oMap(obj, ([k, v]) => `${kebabToCamel(k)}:${v}`).join(';')

//----------------------------------------------------------------

export const style = (selector, css) => {
  const isRaw = (typeof css === 'string')
  const styleT = isRaw ? css : `${selector}{${toCss(css)}}`
  const styleId = `sytle_${selector}`
  const existStyle = id(styleId)
  if (existStyle) {
    setT(existStyle, styleT)
    return
  }
  endH(head, `<style id=${styleId}>${styleT}</style>`)
}

style.responsive = (device) => (selector, obj) => {
  style(`${selector}&${device}`, `@media (max-width : ${breakpoints[device]}){${selector}{${toCss(obj)}}}`)
}

style.hover = (selector, obj) => {
  style(`${selector}&hover`,
    `@media (hover: hover){${selector}:hover{${toCss(obj)}}}`
  + `@media (hover: none) {${selector}:active{${toCss(obj)}}}`)
}

//----------------------------------------------------------------

export const init = () => {

  endH(head, `<style id='reset'>${resetCss}</style>`)

  oForEach(breakpoints, ([k, v]) => {
    const mediaQuery = window.matchMedia(`(max-width: ${v})`)
    const setIs = state({key: `is${capitalize(k)}`, init: mediaQuery.matches})[1]
    mediaQuery.addEventListener('change', ({matches}) => setIs(matches))
  })

  const paletteVal = oReduce(palette, (obj, [k, v]) => {
    v.forEach((hex, i) => {
      obj[`--${k}${i}`] = hex
      obj[`--${k}${i}-rgb`] = rgbFromHEX(hex)
    })
    return obj
  }, {})

  const shapeVal = oReduce(shape, (obj, [k, v]) => {
    oForEach(v, ([atr, val]) => {
      obj[`--${k}-${atr}`] = val
    })
    return obj
  }, {})

  style(':root', {...paletteVal, ...shapeVal})

}

export const is = (device) => {
  const mediaQuery = window.matchMedia(`(max-width: ${breakpoints[device]})`)
  return mediaQuery.matches
}

oForEach(breakpoints, ([k, v]) => {
  const mediaQuery = window.matchMedia(`(max-width: ${v})`)
  const setIs = state({key: `is${capitalize(k)}`, init: mediaQuery.matches})[1]
  mediaQuery.addEventListener('change', ({matches}) => setIs(matches))
})

//----------------------------------------------------------------

export const icon = (name, {size = '48px'} = {}) => /* html */`
<span class="material-symbols-outlined" style=${toCss({..._.f(size), ..._.nonSel})}>
  ${name}
</span>
`

//----------------------------------------------------------------

const kebabToCamel = (k) => k.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)

const rgbFromHEX = (hex) => `
${parseInt(hex[1] + hex[2], 16)},${parseInt(hex[3] + hex[4], 16)},${parseInt(hex[5] + hex[6], 16)}
`
