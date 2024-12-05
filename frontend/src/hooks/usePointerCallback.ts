import { screenToViewPort } from 'glaku'
import { useEffect } from 'react'
import type { CanvasWrapperRef } from './useCanvas'

type Callback = (arg: { x: number; y: number }) => void

export function usePointerCallback({
	callback,
	ref,
}: { callback: Callback; ref: CanvasWrapperRef }) {
	useEffect(() => {
		const handleMouseMove = ({ offsetX, offsetY, target }: MouseEvent) => {
			const { clientWidth, clientHeight } = target as HTMLElement
			const { x, y } = screenToViewPort({
				offsetX,
				offsetY,
				clientWidth,
				clientHeight,
			})
			callback({ x, y })
		}

		const handleTouchMove = ({ changedTouches, touches }: TouchEvent) => {
			if (touches.length === 1) {
				const touch = changedTouches[0]
				const { clientX, clientY, target } = touch
				const { clientWidth, clientHeight } = target as HTMLElement
				const { x, y } = screenToViewPort({
					offsetX: clientX,
					offsetY: clientY,
					clientWidth,
					clientHeight,
				})
				callback({ x, y })
			}
		}

		if (!ref.current) return
		ref.current.addEventListener('mousemove', handleMouseMove, {
			passive: true,
		})
		ref.current.addEventListener('touchmove', handleTouchMove, {
			passive: true,
		})
		return () => {
			if (ref.current) {
				ref.current.removeEventListener('mousemove', handleMouseMove)
				ref.current.removeEventListener('touchmove', handleTouchMove)
			}
		}
	}, [callback, ref])
}
