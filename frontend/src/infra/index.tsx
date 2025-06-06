import { useIsMessagesView, useIsTopicsView } from '@/domain/hooks'
import { MessagesFetcher } from './components/messages'
import { TopicsFetcher } from './components/topics'

export const Fetcher = function Fetcher() {
  const isTopicsView = useIsTopicsView()
  const isMessagesView = useIsMessagesView()
  if (isTopicsView) return <TopicsFetcher />
  if (isMessagesView) return <MessagesFetcher />
  return null
}
