import { oForEach } from 'jittoku'
import { IndexedDB } from '../indexedDB'

const PROMISE_TTL = 1000 * 60

const isOutdated = (time: number, ttl: number) => Date.now() - time > ttl

export class CFRS {
  private subscribers = new Map<string, Set<() => void>>()
  private lastFetchTime = new Map<string, number>()
  private promiseMap = new Map<string, Promise<unknown>>()
  private cacheMap = new Map<string, unknown>()
  private indexedDB = new IndexedDB({ dbName: 'cfrs', storeName: 'tomos' })

  constructor() {
    console.debug('CFRS constructor')
  }

  subscribe(key: string) {
    return (onStoreChange: () => void) => {
      if (!this.subscribers.has(key)) this.subscribers.set(key, new Set())
      this.subscribers.get(key)?.add(onStoreChange)
      return () => this.subscribers.get(key)?.delete(onStoreChange)
    }
  }

  notify(key: string) {
    this.subscribers.get(key)?.forEach((onStoreChange) => onStoreChange())
  }

  async fetch<T>({
    promiseKey,
    fetcher,
    keyValue,
    ttl = PROMISE_TTL,
  }: {
    promiseKey: string
    fetcher: (key: string) => Promise<T>
    keyValue: (result: T) => Record<string, { value: unknown }>
    ttl?: number
  }) {
    let lastFetchTime = this.lastFetchTime.get(promiseKey)
    if (!lastFetchTime) {
      this.lastFetchTime.set(promiseKey, Date.now())
      const result = await this.indexedDB.get<{ value: T; time: number }>(promiseKey)
      if (result) {
        this.lastFetchTime.set(promiseKey, result.time)
        this.updateCache(keyValue(result.value))
        return
      }
      lastFetchTime = 1
      this.lastFetchTime.set(promiseKey, lastFetchTime)
    }

    if (lastFetchTime && isOutdated(lastFetchTime, ttl)) {
      const now = Date.now()
      this.lastFetchTime.set(promiseKey, now)
      this.promiseMap.set(
        promiseKey,
        fetcher(promiseKey).then((result) => {
          this.updateCache(keyValue(result))
          this.indexedDB.set(promiseKey, { time: now, value: result })
        }),
      )
    }
  }

  private updateCache(keyValue: Record<string, { value: unknown }>) {
    oForEach(keyValue, ([k, { value: v }]) => {
      this.cacheMap.set(k, v)
      this.notify(k)
    })
  }

  get(cacheKey: string) {
    return () => this.cacheMap.get(cacheKey) as Readonly<unknown>
  }
}
