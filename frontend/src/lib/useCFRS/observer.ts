import { oForEach } from 'jittoku'

const PROMISE_TTL = 1000 * 60 * 1

const isOutdated = (time: number, ttl: number) => Date.now() - time > ttl

export class CFRS {
  private subscribers = new Map<string, Set<() => void>>()
  private promiseMap = new Map<string, { time: number; promise: Promise<unknown> }>()
  private cacheMap = new Map<string, { time: number; value: unknown }>()

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

  fetch<T>({
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
    const promise = this.promiseMap.get(promiseKey)
    if (!promise || isOutdated(promise.time, ttl)) {
      this.promiseMap.set(promiseKey, {
        time: Date.now(),
        promise: fetcher(promiseKey).then((result) => {
          const kv = keyValue(result as T)
          oForEach(kv, ([k, { value: v }]) => {
            this.cacheMap?.set(k, { time: Date.now(), value: v })
            this.notify(k)
          })
        }),
      })
    }
  }

  get(cacheKey: string) {
    // ここで場合によっては再度fetch
    return () => this.cacheMap.get(cacheKey)?.value
  }
}
