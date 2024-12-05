import { range } from 'jittoku'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import {
	type CanvasSize,
	DEFAULT_POSITION,
	type Message,
	type Position,
	type ScreenPosition,
	type Topic,
} from './type'

const canvasSizeAtom = atom<CanvasSize>({ width: 1000, height: 1000 })
export const useSetCanvasSize = () => useSetAtom(canvasSizeAtom)
export const useCanvasSize = () => useAtomValue(canvasSizeAtom)

//----------------------------------------------------------------

const canvasAdapterAtom = atom((get) => {
	const { width, height } = get(canvasSizeAtom)
	const aspectRatio = width / height
	const aspectRatioVec =
		width > height ? [width / height, 1] : [1, height / width]
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

//----------------------------------------------------------------

const userPositionAtom = atom<Position>((get) => {
	const cameraPosition = get(cameraPositionAtom)
	const mousePosition = get(mousePositionAtom)
	const { aspectRatioVec } = get(canvasAdapterAtom)
	return {
		x: Math.floor(
			cameraPosition.x +
				cameraPosition.z * mousePosition.x * aspectRatioVec[0] * 0.5,
		),
		y: Math.floor(
			cameraPosition.y +
				cameraPosition.z * mousePosition.y * aspectRatioVec[1] * 0.5,
		),
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

export const topicAtom = atom<Topic[]>([
	{ id: 'topic', title: 'topic', message: [], x: 0, y: 0 },
])
export const useTopic = () => useAtomValue(topicAtom)
export const useSetTopic = () => useSetAtom(topicAtom)
