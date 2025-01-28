import { IndexDB } from '@/lib/indexDB'
import { oMap } from 'jittoku'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { useEffect, useState } from 'react'

const cacheFamily = atomFamily((name) => atom(name))

export const useCache = (key: string) => useAtomValue(cacheFamily(key))

const useSetCache = (key: string) => useSetAtom(cacheFamily(key))

const promiseMap = new Map<string, Promise<unknown>>()

export function FetchCacher<T extends object>({
  promiseKey,
  fetcher,
  keyValue,
}: {
  promiseKey: string
  fetcher: (key: string) => Promise<T | { code: number } | undefined>
  keyValue: (result: T) => Record<string, { value: unknown }>
}) {
  const [state, setState] = useState<Record<string, { value: unknown }> | null>(null)
  useEffect(() => {
    if (!promiseMap.has(promiseKey) && fetcher) {
      promiseMap.set(
        promiseKey,
        fetcher(promiseKey).then((result) => {
          if (!result) {
            console.error(promiseKey, 'undefined')
            return
          }
          if ('code' in result && typeof result.code === 'number') {
            console.error(promiseKey, result.code)
            return
          }
          setState(keyValue(result as T))
        }),
      )
    }
  }, [fetcher, promiseKey, keyValue])
  return state && oMap(state, ([k, { value: v }]) => <CacheSetter _key={k} _value={v} />)
}

function CacheSetter({ _key, _value }: { _key: string; _value: unknown }) {
  useSetCache(_key)(_value)
  return null
}

export const useIndexDB = () => {
  const [db, setDb] = useState<IndexDB | null>(null)
  useEffect(() => {
    const db = new IndexDB({ dbName: 'world', storeName: 'topics' })
    db.open().then(() => setDb(db))
  }, [])
  return db
}
