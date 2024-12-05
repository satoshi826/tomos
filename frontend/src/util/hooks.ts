import { useEffect } from 'react'

export function useEventListeners({
	ref,
	listeners,
}: {
	ref: React.RefObject<HTMLElement>
	listeners: Record<string, EventListener>
}) {
	const option = { passive: true }
	useEffect(() => {
		const current = ref.current
		if (!current) return
		Object.entries(listeners).forEach(([event, handler]) =>
			current?.addEventListener(event, handler, option),
		)
		return () => {
			Object.entries(listeners).forEach(([event, handler]) =>
				current?.removeEventListener(event, handler),
			)
		}
	}, [ref, listeners])
}
