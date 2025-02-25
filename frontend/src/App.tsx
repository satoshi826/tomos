import { Fetcher } from './infra'
import { CFRSProvider } from './lib/useCFRS'
import { CanvasInterface } from './ui/canvas/interface'
import Worker from './ui/canvas/webgl/worker?worker'
import { Frame } from './ui/dom/flame/frame'
import { Messages } from './ui/dom/message/message'
import { MessageButton } from './ui/dom/message/messageButton'
import { MessageEditModal } from './ui/dom/message/messageEditModal'
import { Topics } from './ui/dom/topic/topic'
import { TopicButton } from './ui/dom/topic/topicButton'
import { WorldAdapter } from './ui/dom/worldAdapter'
import { useCanvas } from './ui/hooks'
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
