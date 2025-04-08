import { resizeObserver } from 'glaku'
import { useEffect, useMemo } from 'react'
import type { CanvasWrapperRef } from './useCanvas'

type Callback = (arg: { width: number; height: number }) => void

export function useResizeCallback({ callback, ref }: { callback: Callback; ref: CanvasWrapperRef }) {
  const ro = useMemo(() => resizeObserver(({ width, height }) => callback({ width, height })), [callback])
  useEffect(() => {
    if (ref.current) ro.observe(ref.current)
    return () => {
      if (ref.current) ro.unobserve(ref.current)
    }
  }, [ref, ro])
}
