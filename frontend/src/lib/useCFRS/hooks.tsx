import { createContext, use, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { CFRS } from './observer'
import Worker from './worker?worker'

const CFRSContext = createContext<CFRS>(null as unknown as CFRS)

export function CFRSProvider({ children }: React.PropsWithChildren) {
  const cfrs = useMemo(() => new CFRS(), [])
  return <CFRSContext.Provider value={cfrs}>{children}</CFRSContext.Provider>
}

const workerStore = (() => {
  const listeners = new Map<string, Set<() => void>>()
  const getters = new Map<string, Set<(d: unknown) => void>>()
  const cache = new Map<string, unknown>()
  const worker = new Worker()

  worker.onmessage = (event) => {
    const { type, key, data } = event.data
    if (type === 'notify') {
      listeners.get(key)?.forEach((listener) => listener())
    }
    if (type === 'send') {
      getters.get(key)?.forEach((getter) => getter(data))
    }
  }

  return {
    subscribe(key: string) {
      return (listener: () => void) => {
        if (!listeners.has(key)) listeners.set(key, new Set())
        listeners.get(key)?.add(listener)
        return () => {
          listeners.get(key)?.delete(listener)
          if (listeners.get(key)?.size === 0) listeners.delete(key)
        }
      }
    },
    get(cacheKey: string) {
      const c = cache.get(cacheKey)
      if (c) return () => c
      throw new Promise((resolve) => {
        worker.postMessage({ type: 'get', key: cacheKey })
        getters.get(cacheKey)?.add((d: unknown) => resolve(cache.set(cacheKey, d)))
      })
    },
    fetch(method: string, param: object) {
      console.log('fetch', method, param)
      worker.postMessage({ type: 'fetch', method, param })
    },
  }
})()

type WorkerStore = typeof workerStore

export function useCFRSCache(key: string) {
  const cfrs = use(CFRSContext)
  const state = useSyncExternalStore(
    (onChange) => cfrs.subscribe(key)(onChange),
    () => cfrs.get(key)(),
  )
  return state
}

export function useCFRSFetch<T>({
  promiseKey,
  fetcher,
  keyValue,
  ttl,
}: {
  promiseKey: string
  fetcher: (key: string) => Promise<T>
  keyValue: (result: T) => Record<string, { value: unknown }>
  ttl?: number
}) {
  const cfrs = use(CFRSContext)
  cfrs.fetch({ promiseKey, fetcher, keyValue, ttl })
}

const CFRSContext2 = createContext<unknown>(null as unknown)

export function CFRSProvider2({ children }: React.PropsWithChildren) {
  return <CFRSContext2.Provider value={workerStore}>{children}</CFRSContext2.Provider>
}

export function useCFRSCache2(key: string) {
  const worker = use(CFRSContext2) as WorkerStore
  const state = useSyncExternalStore(
    (onChange) => worker.subscribe(key)(onChange),
    () => worker.get(key)(),
  )
  return state
}

export function useCFRSFetch2<T>(method: string, param: object) {
  const worker = use(CFRSContext2) as WorkerStore
  return worker.fetch(method, param) as T
}
