import { useCache } from '@/infra/util'
import { truncateUnit } from '@/util/function'
import { truncate } from 'jittoku'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import {
  AREA_SIDE,
  type Area,
  type CanvasSize,
  type CreateMode,
  DEFAULT_POSITION,
  MESSAGES_VIEW_MAX_Z,
  MESSAGE_CREATE_VIEW_MAX_Z,
  MESSAGE_SIDE,
  MESSAGE_VIEW_MAX_Z,
  type Message,
  type Position,
  type ScreenPosition,
  TOPICS_VIEW_MAX_Z,
  TOPIC_CREATE_VIEW_MAX_Z,
  TOPIC_SIDE,
  type Topic,
  type ViewMode,
} from './types'

const canvasSizeAtom = atom<CanvasSize>({ width: 1000, height: 1000 })
export const useSetCanvasSize = () => useSetAtom(canvasSizeAtom)
export const useCanvasSize = () => useAtomValue(canvasSizeAtom)

const canvasAdapterAtom = atom((get) => {
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

const cameraPositionAtom = atom(DEFAULT_POSITION)
export const useSetCameraPosition = () => useSetAtom(cameraPositionAtom)
export const useCameraPosition = () => useAtomValue(cameraPositionAtom)

const cameraZAtom = atom((get) => get(cameraPositionAtom).z)

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

const truncatePosition = (position: Position, unit: number) => {
  return {
    x: truncateUnit(position.x, unit),
    y: truncateUnit(position.y, unit),
  }
}

//----------------------------------------------------------------

const memoAreaPosition = { current: null as Position | null }
export const currentAreaPositionAtom = createPositionAtom((position) => truncatePosition(position, AREA_SIDE), memoAreaPosition)
export const useCurrentAreaPosition = () => useAtomValue(currentAreaPositionAtom)
export const positionToAreaKey = ({ x, y }: Position) => `area_${x}_${y}`
export const areaKeyToPosition = (key: string) => key.split('_').slice(1).map(Number) as [number, number]
export const useArea = (p: Position) => useCache(positionToAreaKey(p)) as Topic | null
export const useCurrentArea = () => {
  const pos = useCurrentAreaPosition()
  return useArea(pos) as Area | null
}

//----------------------------------------------------------------

const memoTopicPosition = { current: null as Position | null }
export const currentTopicPositionAtom = createPositionAtom((position) => truncatePosition(position, TOPIC_SIDE), memoTopicPosition)
export const useCurrentTopicPosition = () => useAtomValue(currentTopicPositionAtom)
export const positionToTopicKey = ({ x, y }: Position) => `topic_${x}_${y}`
export const topicKeyToPosition = (key: string) => key.split('_').slice(1).map(Number) as [number, number]
export const useTopic = (p: Position) => useCache(positionToTopicKey(p)) as Topic | null
export const useCurrentTopic = () => {
  const pos = useCurrentTopicPosition()
  return useTopic(pos) as Topic | null
}

//----------------------------------------------------------------

const memoMessagePosition = { current: null as Position | null }
export const currentMessagePositionAtom = createPositionAtom((position) => truncatePosition(position, MESSAGE_SIDE), memoMessagePosition)
export const useCurrentMessagePosition = () => useAtomValue(currentMessagePositionAtom)
export const positionToMessageKey = ({ x, y }: Position) => `message_${x}_${y}`
export const messageKeyToPosition = (key: string) => key.split('_').slice(1).map(Number) as [number, number]
export const useMessage = (p: Position) => useCache(positionToMessageKey(p)) as Message | null
export const useCurrentMessage = () => {
  const pos = useCurrentMessagePosition()
  return useMessage(pos) as Message | null
}
