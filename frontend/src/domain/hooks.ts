import { asyncAccessTokenAtom } from '@/auth/hooks'
import { getProfile } from '@/infra/api'
import { useCFRSCache } from '@/lib/useCFRS'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { observe } from 'jotai-effect'
import { loadable, selectAtom } from 'jotai/utils'
import { DEFAULT_COLOR, TOPIC_SIDE } from 'shared/constants'
import { truncateAreaPosition, truncateMessagePosition, truncateTopicPosition, truncateUnit } from 'shared/functions'
import type { Area, Message, Position, Topic } from 'shared/types'
import {
  type CanvasSize,
  type CreateMode,
  DEFAULT_POSITION,
  MESSAGES_VIEW_MAX_Z,
  MESSAGE_CREATE_VIEW_MAX_Z,
  MESSAGE_VIEW_MAX_Z,
  type ScreenPosition,
  TOPICS_VIEW_MAX_Z,
  TOPIC_CREATE_VIEW_MAX_Z,
  type ViewMode,
} from './types'

type Profile = {
  id: string
  color?: number // 0 - 360 deg
  name?: string
  guest?: boolean
}

const defaultProfile: Profile = {
  id: 'Loading...',
  name: 'Loading...',
  guest: true,
}

const asyncProfileAtom = atom(async (get) => {
  const accessToken = await get(asyncAccessTokenAtom)
  return getProfile(accessToken.access_token)
})
const profileAtom = loadable(asyncProfileAtom)

export const useProfile: () => Profile = () => {
  const profile = useAtomValue(profileAtom)
  if (profile.state === 'loading' || profile.state === 'hasError') return defaultProfile
  return profile.data
}

const myProfileAtom = atom({
  id: '7b7db97f-0205-4685-a373-5573d5fe2a53',
  name: 'Anonymous',
  color: DEFAULT_COLOR, // 0 - 360 deg
})

const myProfileColorAtom = atom((get) => get(myProfileAtom).color)
const myProfileIdAtom = atom((get) => get(myProfileAtom).id)

const setStyleProperty = (key: string, value: string) => document.body.style.setProperty(key, value)
const setMyProfileColorEffect = (color: number) => {
  setStyleProperty('--color-primary', `oklch(46% 0.20 ${color})`)
  setStyleProperty('--color-primary-darker', `oklch(38% 0.12 ${color})`)
  setStyleProperty('--color-primary-dark', `oklch(40% 0.18 ${color})`)
  setStyleProperty('--color-primary-light', `oklch(55% 0.25 ${color})`)
  setStyleProperty('--color-primary-lighter', `oklch(82% 0.20 ${color})`)
}
observe((get) => setMyProfileColorEffect(get(myProfileColorAtom)))

export const useMyProfileColor = () => useAtomValue(myProfileColorAtom)
export const useMyProfileId = () => useAtomValue(myProfileIdAtom)
export const useSetMyProfileColor = () => {
  const setMyProfile = useSetAtom(myProfileAtom)
  return (color: number) => {
    setMyProfile((prev) => ({ ...prev, color: Math.max(0, Math.min(360, color)) }))
  }
}

//----------------------------------------------------------------

const canvasSizeAtom = atom<CanvasSize>({ width: 1000, height: 1000 })
export const useSetCanvasSize = () => useSetAtom(canvasSizeAtom)
export const useCanvasSize = () => useAtomValue(canvasSizeAtom)

export const canvasAdapterAtom = atom((get) => {
  const { width, height } = get(canvasSizeAtom)
  const aspectRatio = width / height
  const aspectRatioVec = width > height ? [width / height, 1] : [1, height / width]
  return { width, height, aspectRatio, aspectRatioVec }
})
export const useCanvasAdapter = () => useAtomValue(canvasAdapterAtom)

//----------------------------------------------------------------

const mousePositionAtom = atom<ScreenPosition>({ x: 0, y: 0 })
export const useSetMousePosition = () => useSetAtom(mousePositionAtom)
export const useMousePosition = () => useAtomValue(mousePositionAtom)

//----------------------------------------------------------------

export const cameraPositionAtom = atom(DEFAULT_POSITION)
export const useSetCameraPosition = () => useSetAtom(cameraPositionAtom)
export const useCameraPosition = () => useAtomValue(cameraPositionAtom)

const cameraZAtom = selectAtom(cameraPositionAtom, (position) => position.z)
export const useCameraZ = () => useAtomValue(cameraZAtom)

const viewModeAtom = atom<ViewMode>((get) => {
  const z = get(cameraZAtom)
  if (z < MESSAGE_VIEW_MAX_Z) return 'message'
  if (z < MESSAGES_VIEW_MAX_Z) return 'messages'
  if (z < TOPICS_VIEW_MAX_Z) return 'topics'
  return 'areas'
})
export const useViewMode = () => useAtomValue(viewModeAtom)
export const useIsMessageView = () => useViewMode() === 'message'
export const useIsMessagesView = () => useViewMode() === 'messages'
export const useIsTopicsView = () => useViewMode() === 'topics'
export const useIsAreasView = () => useViewMode() === 'areas'

const createModeAtom = atom<CreateMode | null>((get) => {
  const z = get(cameraZAtom)
  if (z < MESSAGE_CREATE_VIEW_MAX_Z) return 'message'
  if (z > MESSAGES_VIEW_MAX_Z && z < TOPIC_CREATE_VIEW_MAX_Z) return 'topic'
  return null
})
export const useCreateMode = () => useAtomValue(createModeAtom)
export const useIsMessageCreate = () => useCreateMode() === 'message'
export const useIsTopicCreate = () => useCreateMode() === 'topic'

//----------------------------------------------------------------

const userPositionAtom = atom<Position>((get) => {
  const cameraPosition = get(cameraPositionAtom)
  const mousePosition = get(mousePositionAtom)
  const { aspectRatioVec } = get(canvasAdapterAtom)
  return {
    x: Math.floor(cameraPosition.x + cameraPosition.z * mousePosition.x * aspectRatioVec[0] * 0.5),
    y: Math.floor(cameraPosition.y + cameraPosition.z * mousePosition.y * aspectRatioVec[1] * 0.5),
  }
})
export const useUserPosition = () => useAtomValue(userPositionAtom)

const userTopicPositionAtom = atom<Position>((get) => {
  const userPosition = get(userPositionAtom)
  return {
    x: truncateUnit(userPosition.x, TOPIC_SIDE),
    y: truncateUnit(userPosition.y, TOPIC_SIDE),
  }
})
export const useUserTopicPosition = () => useAtomValue(userTopicPositionAtom)

//----------------------------------------------------------------

const createPositionAtom = (transformFn: (position: Position) => Position, memoRef: { current: Position | null }) =>
  atom<Position>((get) => {
    const cameraPosition = get(cameraPositionAtom)
    const newPosition = transformFn(cameraPosition)
    if (memoRef.current && memoRef.current.x === newPosition.x && memoRef.current.y === newPosition.y) {
      return memoRef.current
    }
    memoRef.current = newPosition
    return newPosition
  })

//----------------------------------------------------------------

const memoAreaPosition = { current: null as Position | null }
const currentAreaPositionAtom = createPositionAtom((position) => truncateAreaPosition(position), memoAreaPosition)
export const useCurrentAreaPosition = () => useAtomValue(currentAreaPositionAtom)
export const positionToAreaKey = ({ x, y }: Position) => `area_${x}_${y}`
export const areaKeyToPosition = (key: string) => key.split('_').slice(1).map(Number) as [number, number]
export const useArea = (p: Position) => useCFRSCache(positionToAreaKey(p)) as Topic | null
export const useCurrentArea = () => {
  const pos = useCurrentAreaPosition()
  return useArea(pos) as Area | null
}

//----------------------------------------------------------------
const memoTopicPosition = { current: null as Position | null }
const currentTopicPositionAtom = createPositionAtom((position) => truncateTopicPosition(position), memoTopicPosition)
export const useCurrentTopicPosition = () => useAtomValue(currentTopicPositionAtom)
export const positionToTopicKey = ({ x, y }: Position) => `topic_${x}_${y}`
export const topicKeyToPosition = (key: string) => key.split('_').slice(1).map(Number) as [number, number]
export const useTopic = (p: Position) => useCFRSCache(positionToTopicKey(p)) as Topic | null
export const useCurrentTopic = () => {
  const pos = useCurrentTopicPosition()
  return useTopic(pos) as Topic | null
}

//----------------------------------------------------------------

const memoMessagePosition = { current: null as Position | null }
const currentMessagePositionAtom = createPositionAtom((position) => truncateMessagePosition(position), memoMessagePosition)
export const useCurrentMessagePosition = () => useAtomValue(currentMessagePositionAtom)
export const positionToMessageKey = ({ x, y }: Position) => `message_${x}_${y}`
export const messageKeyToPosition = (key: string) => key.split('_').slice(1).map(Number) as [number, number]
export const useMessage = (p: Position) => useCFRSCache(positionToMessageKey(p)) as Message | null
export const useCurrentMessage = () => {
  const pos = useCurrentMessagePosition()
  return useMessage(pos) as Message | null
}
