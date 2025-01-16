export class IndexDB {
  private dbName: string
  private storeName: string
  private db: IDBDatabase | null

  constructor({ dbName, storeName }: { dbName: string; storeName: string }) {
    this.dbName = dbName
    this.storeName = storeName
    this.db = null
  }

  async open(): Promise<void> {
    return new Promise((resolve, reject) => {
      const req: IDBOpenDBRequest = indexedDB.open(this.dbName, 1)

      req.onerror = () => reject('Failed to open database')
      req.onsuccess = (event: Event) => {
        const target = event.target as IDBOpenDBRequest
        this.db = target.result
        resolve()
      }
      req.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const target = event.target as IDBOpenDBRequest
        const db = target.result
        db.createObjectStore(this.storeName)
      }
    })
  }

  async set<T>(key: IDBValidKey, data: T): Promise<IDBValidKey> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject('Database is not open')
      }

      const tx: IDBTransaction = this.db.transaction([this.storeName], 'readwrite')
      const store: IDBObjectStore = tx.objectStore(this.storeName)
      const req: IDBRequest<IDBValidKey> = store.put(data, key)

      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject('Failed to add data')
    })
  }

  async get<T>(key: IDBValidKey): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject('Database is not open')
      }

      const tx: IDBTransaction = this.db.transaction([this.storeName], 'readonly')
      const store: IDBObjectStore = tx.objectStore(this.storeName)
      const req: IDBRequest<T> = store.get(key)

      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject('Failed to get data')
    })
  }
}
