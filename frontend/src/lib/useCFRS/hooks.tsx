import { createContext, use, useCallback, useSyncExternalStore } from 'react'
import { CFRS } from './observer'

const CFRSContext = createContext<CFRS>(new CFRS())

export function CFRSProvider({ children }: React.PropsWithChildren) {
  return <CFRSContext.Provider value={new CFRS()}>{children}</CFRSContext.Provider>
}

export function useCFRSCache(key: string) {
  const cfrs = use(CFRSContext)
  const state = useSyncExternalStore(
    useCallback((onChange) => cfrs.subscribe(key)(onChange), [cfrs, key]),
    useCallback(() => cfrs.get(key)(), [cfrs, key]),
  )
  return state
}

export function useCFRSFetch<T>({
  promiseKey,
  fetcher,
  keyValue,
}: {
  promiseKey: string
  fetcher: (key: string) => Promise<T>
  keyValue: (result: T) => Record<string, { value: unknown }>
}) {
  const cfrs = use(CFRSContext)
  cfrs.fetch({ promiseKey, fetcher, keyValue })
}
