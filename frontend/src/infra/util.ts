import { IndexedDB } from '@/lib/IndexedDB'
import { useEffect, useState } from 'react'

export const resultToJson = async (result: Response) => {
  const json = await result.json()
  if ('code' in json && typeof json.code === 'number') throw new Error(`fetcher error: ${json}`)
  if (json === undefined) throw new Error(`fetcher error: ${json}`)
  return await json
}

export const useIndexedDB = () => {
  const [db, setDb] = useState<IndexedDB | null>(null)
  useEffect(() => {
    const db = new IndexedDB({ dbName: 'world', storeName: 'topics' })
    db.open().then(() => setDb(db))
  }, [])
  return db
}
