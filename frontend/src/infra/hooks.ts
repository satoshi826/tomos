import { IndexDB } from '@/lib/indexDB'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'

const cacheAtom = atom(new Map())

export const useSetCache = () => useSetAtom(cacheAtom)

export const useCache = () => useAtomValue(cacheAtom)

export const useIndexDB = () => {
  const [db, setDb] = useState<IndexDB | null>(null)
  useEffect(() => {
    const db = new IndexDB({ dbName: 'world', storeName: 'topics' })
    db.open().then(() => setDb(db))
  }, [])
  return db
}
