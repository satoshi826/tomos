import { useEffect } from 'react'

export function useEventListeners({
  ref,
  listeners,
}: {
  ref: React.RefObject<HTMLElement | null>
  listeners: Record<string, EventListener>
}) {
  const option = { passive: true }
  useEffect(() => {
    const el = ref.current
    if (!el) return
    Object.entries(listeners).forEach(([event, handler]) => el?.addEventListener(event, handler, option))
    return () => {
      Object.entries(listeners).forEach(([event, handler]) => el?.removeEventListener(event, handler))
    }
  }, [ref, listeners])
}
