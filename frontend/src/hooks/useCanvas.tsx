import { useCallback, useLayoutEffect, useMemo, useRef } from 'react'

export type CanvasProps = { src: string; state?: object }
export type useCanvasArgs = {
  Worker: new () => Worker
  style?: string
  id?: string
}
export type useCanvasReturns = ReturnType<typeof useCanvas>
export type CanvasWrapperRef = React.MutableRefObject<HTMLDivElement | null>

export function useCanvas({ Worker, style = '', id = '' }: useCanvasArgs) {
  const workerRef = useRef<Worker | null>(null)
  const handlerRef = useRef(new Set<(v: unknown) => void>())
  const coverRef = useRef<HTMLDivElement | null>(null)

  const post = useCallback(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    (message: any, transfer?: any[]) => workerRef.current?.postMessage(message, transfer ?? []),
    [],
  )

  useLayoutEffect(() => {
    const wrapperEl = document.getElementById(`canvas_wrapper_${id}`)
    const canvasEl = document.createElement('canvas')
    canvasEl.id = `canvas_${id}`
    canvasEl.setAttribute('style', `position: absolute; height: 100%; width: 100%; zIndex: 0; pointer-events:none;${style}`)
    canvasEl.setAttribute('name', 'canvas')
    wrapperEl?.appendChild(canvasEl)
    const offScreenCanvas = canvasEl.transferControlToOffscreen()
    const { width, height } = canvasEl.getBoundingClientRect()
    offScreenCanvas.width = width
    offScreenCanvas.height = height
    console.debug('connecting worker')
    workerRef.current = new Worker() as Worker
    post({ canvas: offScreenCanvas, pixelRatio: devicePixelRatio }, [offScreenCanvas])
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    workerRef.current!.onmessage = ({ data }: { data: unknown }) => handlerRef.current.forEach((f) => f(data))
    return () => {
      console.debug('terminate worker')
      document.getElementsByName('canvas').forEach((el) => el.remove())
      workerRef.current?.terminate()
      workerRef.current = null
    }
  }, [Worker, id, post, style])

  const canvas = useMemo(
    () => (
      <div
        id={`canvas_wrapper_${id}`}
        ref={coverRef}
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          top: 0,
          zIndex: 10,
          WebkitTapHighlightColor: 'rgba(0,0,0,0)',
        }}
      />
    ),
    [id],
  )
  return { canvas, post, ref: coverRef }
}
