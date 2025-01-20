import { IndexDB } from '@/lib/indexDB'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { useEffect, useState } from 'react'

const cacheFamily = atomFamily((name) => atom(name))

export const useCache = (key: string) => useAtomValue(cacheFamily(key))

const useSetCache = (key: string) => useSetAtom(cacheFamily(key))

const promiseMap = new Map<string, Promise<unknown>>()
export const useFetchCache = (key: string, fetcher: (key: string) => Promise<unknown>) => {
  const setCache = useSetCache(key)
  useEffect(() => {
    if (!promiseMap.has(key) && fetcher) {
      promiseMap.set(key, fetcher(key).then(setCache))
    }
  }, [fetcher, key, setCache])
}

export const useIndexDB = () => {
  const [db, setDb] = useState<IndexDB | null>(null)
  useEffect(() => {
    const db = new IndexDB({ dbName: 'world', storeName: 'topics' })
    db.open().then(() => setDb(db))
  }, [])
  return db
}
