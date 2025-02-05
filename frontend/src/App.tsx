import { clamp } from 'jittoku'
import { useCallback, useEffect } from 'react'
import { useCameraPosition, useSetCameraPosition, useSetCanvasSize, useSetMousePosition } from './domain/hooks'
import { Fetcher } from './infra'
import { CFRSProvider } from './lib/useCFRS'
import Worker from './ui/canvas/webgl/worker?worker'
import { Frame } from './ui/dom/frame'
import { Messages } from './ui/dom/message/message'
import { MessageButton } from './ui/dom/message/messageButton'
import { MessageEditModal } from './ui/dom/message/messageEditModal'
import { Topics } from './ui/dom/topic/topic'
import { TopicButton } from './ui/dom/topic/topicButton'
import { WorldAdapter } from './ui/dom/worldAdapter'
import { useCanvas, useDragCallback, usePointerCallback, useResizeCallback } from './ui/hooks'
import { ErrorBoundary } from './util/component'

export function App() {
  const { canvas, post, ref } = useCanvas({ Worker })
  return (
    <ErrorBoundary>
      <CFRSProvider>
        {canvas}
        <CanvasInterface post={post} ref={ref} />
        <Fetcher />
        <Frame>
          <WorldAdapter>
            <Messages />
            <MessageButton />
            <MessageEditModal />
            <Topics />
            <TopicButton />
          </WorldAdapter>
        </Frame>
      </CFRSProvider>
    </ErrorBoundary>
  )
}

function CanvasInterface({ post, ref }: { post: (data: unknown) => void; ref: React.RefObject<HTMLDivElement | null> }) {
  const cameraPosition = useCameraPosition()
  const setCameraPosition = useSetCameraPosition()
  const setMousePosition = useSetMousePosition()
  const setCanvasSize = useSetCanvasSize()
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
  useEffect(() => post({ camera: cameraPosition }), [cameraPosition, post])
  // useEffect(() => post({ message: messageView }), [messageView, post]) // messageはindexDB経由で渡す?
  return null
}
