import { useCurrentTopicPosition } from '@/domain/hooks'
import { fetcher } from '@/lib/fetch'
import { use, useEffect } from 'react'

export const useData = () => {
  const currentTopicPosition = useCurrentTopicPosition()
  useEffect(() => {
    fetcher.get({ path: '/topics', query: { x: currentTopicPosition.x, y: currentTopicPosition.y } }).then(console.log)
  }, [currentTopicPosition])
}
