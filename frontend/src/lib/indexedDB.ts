export class IndexedDB {
  private dbName: string
  private storeName: string
  private db: IDBDatabase | null

  constructor({ dbName, storeName }: { dbName: string; storeName: string }) {
    this.dbName = dbName
    this.storeName = storeName
    this.db = null
  }

  private async open(): Promise<void> {
    if (this.db) return

    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.dbName, 1)

      req.onerror = () => reject(new Error('Failed to open database'))
      req.onsuccess = (event: Event) => {
        const target = event.target as IDBOpenDBRequest
        this.db = target.result
        resolve()
      }
      req.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const target = event.target as IDBOpenDBRequest
        const db = target.result
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName)
        }
      }
    })
  }

  private async ensureOpen(): Promise<void> {
    if (!this.db) await this.open()
  }

  async set<T>(key: IDBValidKey, data: T): Promise<IDBValidKey> {
    await this.ensureOpen()
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject(new Error('Database is not open'))
      }

      const tx = this.db.transaction([this.storeName], 'readwrite')
      const store = tx.objectStore(this.storeName)
      const req = store.put(data, key)

      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(new Error('Failed to add data'))
    })
  }

  async get<T>(key: IDBValidKey): Promise<T | undefined> {
    await this.ensureOpen()
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject(new Error('Database is not open'))
      }

      const tx = this.db.transaction([this.storeName], 'readonly')
      const store = tx.objectStore(this.storeName)
      const req = store.get(key)

      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(new Error('Failed to get data'))
    })
  }
}
