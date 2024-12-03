import {useCameraPosition, useCanvasAdapter} from '@/domain/hooks'

const BASE_SCALE = 200
export const getTranslate = (x: number, y: number, scale = 1) => `translateX(calc(${x * BASE_SCALE}px - 50%)) translateY(calc(${-y * BASE_SCALE}px  - 50%)) scale(${scale})`

export function WorldAdapter({children}: React.PropsWithChildren) {
  const {x: cX, y: cY, z: cZ} = useCameraPosition()
  const canvasAdapter = useCanvasAdapter()
  const {width, height, aspectRatioVec} = canvasAdapter

  let x = 2 * ((- cX) / (aspectRatioVec[0] * cZ))
  let y = -2 * (- cY) / (aspectRatioVec[1] * cZ)
  x = (x + 1) / 2
  y = (y + 1) / 2
  x *= width
  y *= height

  const transform = `translate3D(${x}px, ${y}px, 0) scale(${Math.min(width, height) / (cZ * BASE_SCALE)})`
  return (
    <div className='absolute w-0 h-0 top-0 contain-size contain-style contain-layout z-20 pointer-events-auto will-change-transform' style={{transform}}>
      {children}
    </div>
  )
}