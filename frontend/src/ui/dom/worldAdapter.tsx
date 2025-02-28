import { cameraPositionAtom, canvasAdapterAtom } from '@/domain/hooks'
import { observe } from 'jotai-effect'

const BASE_SCALE = 200
export const getTranslate = (x: number, y: number, scale = 1) =>
  `translateX(calc(${x * BASE_SCALE}px - 50%)) translateY(calc(${-y * BASE_SCALE}px  - 50%)) scale(${scale})`

let worldAdapterEl = null

observe((get) => {
  const cameraPosition = get(cameraPositionAtom)
  worldAdapterEl ??= document.getElementById('world-adapter')
  if (!worldAdapterEl) return
  const { width, height, aspectRatioVec } = get(canvasAdapterAtom)
  const { x: cX, y: cY, z: cZ } = cameraPosition
  let x = 2 * (-cX / (aspectRatioVec[0] * cZ))
  let y = (-2 * -cY) / (aspectRatioVec[1] * cZ)
  x = (x + 1) / 2
  y = (y + 1) / 2
  x *= width
  y *= height
  worldAdapterEl.style.transform = `translate3D(${x}px, ${y}px, 0) scale(${Math.min(width, height) / (cZ * BASE_SCALE)})`
})

export function WorldAdapter({ children }: React.PropsWithChildren) {
  return (
    <div
      id="world-adapter"
      className="pointer-events-auto absolute top-0 z-20 h-0 w-0 will-change-transform contain-size contain-layout contain-style"
    >
      {children}
    </div>
  )
}
