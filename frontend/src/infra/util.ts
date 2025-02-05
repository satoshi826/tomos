import { IndexDB } from '@/lib/indexDB'
import { useEffect, useState } from 'react'

export const resultToJson = async (result: Response) => {
  const json = await result.json()
  if ('code' in json && typeof json.code === 'number') throw new Error(`fetcher error: ${json}`)
  if (json === undefined) throw new Error(`fetcher error: ${json}`)
  return await json
}

export const useIndexDB = () => {
  const [db, setDb] = useState<IndexDB | null>(null)
  useEffect(() => {
    const db = new IndexDB({ dbName: 'world', storeName: 'topics' })
    db.open().then(() => setDb(db))
  }, [])
  return db
}
