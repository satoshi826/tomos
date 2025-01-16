import { useCurrentTopicPosition } from '@/domain/hooks'
import { fetcher } from '@/lib/fetch'
import { atom, useAtom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { memo, useEffect } from 'react'
// import { useIndexDB } from './hooks'

const promiseMap = new Map<string, Promise<unknown>>()
const cacheFamily = atomFamily((name) => atom(name))

export const Fetcher = memo(function Fetcher() {
  // const db = useIndexDB()
  const pos = useCurrentTopicPosition()
  const key = `${pos.x}_${pos.y}`
  const [cache, setCache] = useAtom(cacheFamily(key))

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!promiseMap.has(key)) {
      promiseMap.set(
        key,
        fetcher.get({ path: '/topics', query: { x: pos.x, y: pos.y } }).then((data) => {
          setCache(data)
          console.log('fetched', data)
        }),
      )
    } else if (cache !== undefined) {
      console.log('cache hit', cache)
    } else {
      console.log('fetching')
    }
  }, [pos])
  return null
})
