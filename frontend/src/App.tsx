import { clamp } from 'jittoku'
import { useEffect } from 'react'
import { useCameraPosition, useSetCameraPosition, useSetCanvasSize, useSetMousePosition } from './domain/hooks'
import { useData } from './infra/hooks'
import { useMessageView } from './ui/canvas/hooks'
import Worker from './ui/canvas/webgl/worker?worker'
import { Frame } from './ui/dom/frame'
import { Message } from './ui/dom/message/message'
import { MessageButton } from './ui/dom/message/messageButton'
import { MessageEditModal } from './ui/dom/message/messageEditModal'
import { Topic } from './ui/dom/topic/topic'
import { WorldAdapter } from './ui/dom/worldAdapter'
import { useCanvas, useDragCallback, usePointerCallback, useResizeCallback } from './ui/hooks'

function App() {
  const { canvas, post, ref } = useCanvas({ Worker })
  const cameraPosition = useCameraPosition()
  const setCameraPosition = useSetCameraPosition()
  const setMousePosition = useSetMousePosition()
  const setCanvasSize = useSetCanvasSize()
  const messageView = useMessageView()

  useResizeCallback({
    callback: (resize) => {
      setCanvasSize(resize)
      post({ resize })
    },
    ref,
  })
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
  useEffect(() => post({ message: messageView }), [messageView, post])

  useData()

  return (
    <>
      {canvas}
      <Frame>
        <WorldAdapter>
          <Message />
          <MessageButton />
          <MessageEditModal />
          <Topic />
        </WorldAdapter>
      </Frame>
    </>
  )
}

export default App
