import { useCameraPosition, useCurrentAreaPosition, useSetCameraPosition, useSetCanvasSize, useSetMousePosition } from '@/domain/hooks'
import { useCFRS } from '@/lib/useCFRS'
import { clamp } from 'jittoku'
import { useCallback, useEffect } from 'react'
import { useDragCallback, usePointerCallback, useResizeCallback } from '../hooks'

export function CanvasInterface({ post, ref }: { post: (data: unknown) => void; ref: React.RefObject<HTMLDivElement | null> }) {
  const cameraPosition = useCameraPosition()
  const currentAreaPosition = useCurrentAreaPosition()
  const setCameraPosition = useSetCameraPosition()
  const setMousePosition = useSetMousePosition()
  const setCanvasSize = useSetCanvasSize()

  const cfrs = useCFRS()

  // const messageView = useMessageView()
  const resizeCallback = useCallback(
    (resize: { width: number; height: number }) => {
      setCanvasSize(resize)
      post({ resize })
    },
    [setCanvasSize, post],
  )
  useResizeCallback({ callback: resizeCallback, ref })
  usePointerCallback({ callback: setMousePosition, ref })
  useDragCallback({
    callback: ({ x, y, scroll }) => {
      setCameraPosition((prev) => {
        const nextZ = scroll ? clamp(prev.z + (prev.z * scroll) / 1500, 1, 10000) : prev.z
        return {
          x: prev.x + -x * nextZ,
          y: prev.y + -y * nextZ,
          z: nextZ,
        }
      })
    },
    ref,
  })
  useEffect(() => post({ camera: cameraPosition }), [cameraPosition, post]) // atomEffectで送るか

  useEffect(() => {
    console.log(post, currentAreaPosition)
  }, [currentAreaPosition, post])

  // useEffect(() => post({ message: messageView }), [messageView, post]) // messageはIndexedDB経由で渡す?
  return null
}
