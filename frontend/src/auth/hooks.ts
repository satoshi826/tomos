import { isNullish } from 'jittoku'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { observe } from 'jotai-effect'
import { loadable } from 'jotai/utils'
import { tokenRefresh } from './api'

type AccessToken = {
  access_token: string | null
  expires_at: number | null
}

export const asyncAccessTokenAtom = atom<Promise<AccessToken>>(tokenRefresh())
const accessTokenAtom = loadable(asyncAccessTokenAtom)

let timer: ReturnType<typeof setTimeout> | null = null

observe((get, set) => {
  const v = get(accessTokenAtom)
  if (v.state === 'loading' || v.state === 'hasError') return
  const { expires_at } = v.data
  if (isNullish(expires_at)) return
  if (timer) clearTimeout(timer)
  const refreshTime = Math.max(0, expires_at * 1000 - Date.now() - 60 * 1000) // Refresh 1 minute before expiration
  console.log('refreshTime:', refreshTime, 'ms')
  timer = setTimeout(async () => {
    console.log('refresh!')
    set(asyncAccessTokenAtom, tokenRefresh())
  }, refreshTime)
})

export const useAccessToken = () => {
  const v = useAtomValue(accessTokenAtom)
  if (v.state === 'hasData') return v.data
  return { access_token: null, expires_at: null }
}

export const useSetAccessToken = () => {
  const set = useSetAtom(asyncAccessTokenAtom)
  return (t: AccessToken) => set(Promise.resolve(t))
}

export const useResetAccessToken = () => {
  const set = useSetAccessToken()
  return () => set({ access_token: null, expires_at: null })
}
