self.window ??= self

//------------------------------------------------------------------

export const values = (object) => Object.values(object)

export const keys = (object) => Object.keys(object)

export const oLength = (object) => Object.keys(object).length

export const oForEach = (object, f) => Object.entries(object).forEach(f)

export const oMap = (object, f) => Object.entries(object).map(f)

export const oReduce = (object, f, int) => Object.entries(object).reduce(f, int)

export const oMapO = (object, f) => Object.entries(object).reduce((obj, [k, v]) => {
  obj[k] = f([k, v])
  return obj
}, {})

export const oReduceO = (object, f) => Object.entries(object).reduce((obj, [k, v]) => {
  const [newK, newV] = f([k, v])
  obj[newK] = newV
  return obj
}, {})

export const shake = (object) => Object?.keys(object).reduce((obj, cur) => {
  if(!(this[cur] === undefined || this[cur] === null)) obj[cur] = this[cur]
  return obj
}, {})

export const range = (num) => [...Array(num).keys()]

export const fill = (num, val) => [...Array(num).fill(val)]

export const unique = (array) => [...new Set(array)]

export const random = (min = 0, max = 1) => Math.random() * (max - min) + min

//------------------------------------------------------------------

export const qs = (selector) => document.querySelector(selector)
export const qsA = (selector) => document.querySelectorAll(selector)
export const id = (id) => document.getElementById(id)
export const name = (name) => document.getElementsByName(name)

export const setH = (element, html) => {
  element.innerHTML = html
  return element
}

export const setT = (element, text) => {
  element.textContent = text
  return element
}

export const beginH = (element, html) => {
  element.insertAdjacentHTML('afterBegin', html)
  return element
}

export const endH = (element, html) => {
  element.insertAdjacentHTML('beforeEnd', html)
  return element
}

//------------------------------------------------------------------

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

//------------------------------------------------------------------


export const sleep = async(ms) => await new Promise(_ => setTimeout(_, ms))

export const throttle = (f, delay) => {
  let timer = 0
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => f.apply(this, args), delay)
  }
}

//------------------------------------------------------------------

const _stateObj = {}

export function state({key, init = null}) {

  if(_stateObj[key] === undefined) {
    _stateObj[key] = {value: init, func: new Set()}
  }

  return [
    (f) => { // watcher
      f(_stateObj[key].value)
      _stateObj[key].func.add(f)
      return () => _stateObj[key].func.delete(f) // omitter
    },
    (v) => { // setter
      _stateObj[key].value = (typeof v === 'function') ? v(_stateObj[key].value) : v
      _stateObj[key].func.forEach((f) => f(_stateObj[key].value))
    },
    () => _stateObj[key].value // value
  ]
}

//------------------------------------------------------------------

export function task(i, f) {
  if (i < 0 || i > 2) throw new Error
  return (v) => taskFunc[i](() => f(v))
}

export function idle(i, f) {
  if (i < 0 || i > 1) throw new Error
  return (v) => idleFunc[i](() => f(v))
}

const hasScheduler = !!window.scheduler
const taskFunc = [
  hasScheduler ? (f) => scheduler.postTask(f, {priority: 'user-blocking'}) : (f) => queueMicrotask(f),
  hasScheduler ? (f) => scheduler.postTask(f, {priority: 'user-visible'}) : (f) => setTimeout(f, 0),
  hasScheduler ? (f) => scheduler.postTask(f, {priority: 'background'}) : (f) => setTimeout(f, 1),
]

const hasIdleCallback = !!window.requestIdleCallback
const idleFunc = [
  hasIdleCallback ? (f) => requestIdleCallback(f, {timeout: 5000}) : (f) => setTimeout(f, 1),
  hasIdleCallback ? (f) => requestIdleCallback(f, {timeout: 1000}) : (f) => setTimeout(f, 2),
]

//------------------------------------------------------------------
