import {idle, id, state, oForEach} from '../lib/util/util'
import {style, _} from '../lib/theme'
import CanvasWorker from '../gl/worker?worker'

export function canvas() {


  idle(0, () => {

    const canvasE = id('canvas')
    const canvasWrapperE = id('canvasWrapper')

    const canvasWorker = new CanvasWorker()

    canvasE.width = canvasE.clientWidth
    canvasE.height = canvasE.clientHeight
    const offscreenCanvas = canvasE.transferControlToOffscreen()
    canvasWorker.postMessage({init: {
      canvas    : offscreenCanvas,
      pixelRatio: window.devicePixelRatio
    }}, [offscreenCanvas])

    const resizeObserver = new ResizeObserver((entries) => {
      const {width, height} = entries[0].contentRect
      canvasWorker.postMessage({resize: {width, height}})
    })

    resizeObserver.observe(canvasE)

    canvasWrapperE.onmousemove = (e) => {
      const x = 2 * (e.offsetX / canvasWrapperE.clientWidth) - 1
      const y = - (2 * (e.offsetY / canvasWrapperE.clientHeight) - 1)
      canvasWorker.postMessage({mouse: {x, y}})
    }

    canvasWrapperE.onmouseleave = () => {
      canvasWorker.postMessage({mouse: {x: 0.0, y: 0.0}})
    }

    let start
    canvasWrapperE.addEventListener('touchmove', ({changedTouches}) => {
      {
        const touch = changedTouches[0]
        start ??= [touch.clientX, touch.clientY]
        const x = 2 * (touch.clientX - start[0]) / canvasWrapperE.clientWidth
        const y = 2 * (touch.clientY - start[0]) / canvasWrapperE.clientHeight
        canvasWorker.postMessage({mouse: {x, y}})
      }
    })

    const setterMap = {}
    canvasWorker.onmessage = ({data}) => {
      oForEach(data, ([k, v]) => {
        setterMap[k] ??= state({key: k, init: v})[1]
        setterMap[k](v)
      })
    }

  })()

  style('#canvasWrapper', wrapperC)
  style('#canvas', canvasC)
  style('#canvasCover', coverC)


  return /* html */`
    <div id="canvasWrapper">
      <canvas id="canvas"></canvas>
      <div id="canvasCover"></div>
    </div>
  `
}

//----------------------------------------------------------------

const wrapperC = {
  ..._.bgC({type: 'gray', i: 0}),
  ..._.rlt,
  ..._.wh100,
}

const canvasC = {
  ..._.abs,
  ..._.wh100,
}

const coverC = {
  ..._.abs,
  ..._.wh100,
  boxShadow: `
  inset 0 0 100px rgba(0, 0, 0, 0.6),
  inset 0 0 200px rgba(0, 0, 0, 0.4);`,
}