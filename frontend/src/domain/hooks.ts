import { useCache } from '@/infra/hooks'
import { range, truncate } from 'jittoku'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { type CanvasSize, DEFAULT_POSITION, type Message, type Position, type ScreenPosition, type Topic } from './types'

const canvasSizeAtom = atom<CanvasSize>({ width: 1000, height: 1000 })
export const useSetCanvasSize = () => useSetAtom(canvasSizeAtom)
export const useCanvasSize = () => useAtomValue(canvasSizeAtom)

//----------------------------------------------------------------

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

const VIEW_MODES = ['message', 'messages', 'topics', 'areas'] as const
const MESSAGE_VIEW_MAX_Z = 1.5
const MESSAGES_VIEW_MAX_Z = 10
const TOPICS_VIEW_MAX_Z = 85

type ViewMode = (typeof VIEW_MODES)[number]

const viewModeAtom = atom<ViewMode>((get) => {
  const { z } = get(cameraPositionAtom)
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

//----------------------------------------------------------------

const defaultMessage = range(10).flatMap((x) =>
  range(10).map((y) => ({
    id: 'message',
    x,
    y,
    userId: 'user',
    text: `message ${x}_${y}`,
    createdAt: '20241101',
  })),
)
export const messageAtom = atom<Message[]>(defaultMessage)
export const useMessage = () => useAtomValue(messageAtom)
export const useSetMessage = () => useSetAtom(messageAtom)

//----------------------------------------------------------------

let memoizedPosition: Position | null = null
export const cameraToTopicPosition = (position: Position) => ({
  x: truncate(position.x, -1),
  y: truncate(position.y, -1),
})
export const currentTopicPositionAtom = atom<Position>((get) => {
  const cameraPosition = get(cameraPositionAtom)
  const newPosition = cameraToTopicPosition(cameraPosition)
  if (memoizedPosition && memoizedPosition.x === newPosition.x && memoizedPosition.y === newPosition.y) {
    return memoizedPosition
  }
  memoizedPosition = newPosition
  return newPosition
})

export const useCurrentTopicPosition = () => useAtomValue(currentTopicPositionAtom)

export const positionToTopicKey = ({ x, y }: Position) => `topic_${x}_${y}`

export const topicKeyToPosition = (key: string) => key.split('_').slice(1).map(Number) as [number, number]

export const useTopic = (p: Position) => useCache(positionToTopicKey(p)) as Topic | null

export const useCurrentTopic = () => {
  const pos = useCurrentTopicPosition()
  return useTopic(pos) as Topic | null
}

const topicAtom = atom<Topic[]>([{ id: 'topic', title: 'topic', message: [], x: 0, y: 0 }])

export const useSetTopic = () => useSetAtom(topicAtom)
