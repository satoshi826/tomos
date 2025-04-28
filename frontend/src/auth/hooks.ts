import { atom, useAtomValue, useSetAtom } from 'jotai'
import { loadable } from 'jotai/utils'
import { getProfile } from './api'

const oauthAtom = atom<{
  access_token: string | null
  expires_in: number | null
}>({
  access_token: null,
  expires_in: null,
})

const asyncProfileAtom = atom(async (get) => {
  const oauth = get(oauthAtom)
  return getProfile(oauth.access_token)
})
const profileAtom = loadable(asyncProfileAtom)

export const useProfile = () => {
  const profile = useAtomValue(profileAtom)
  console.log(profile)
  if (profile.state === 'loading' || profile.state === 'hasError') return null
  return profile.data
}

export const useSetOauth = () => {
  return useSetAtom(oauthAtom)
}

export const useOauth = () => {
  return useAtomValue(oauthAtom)
}
