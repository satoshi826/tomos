import { useCameraZ, useCanvasAdapter } from '@/domain/hooks'
import type { Position } from '@/domain/types'
import { step, truncate } from 'jittoku'

export function useViewablePositions(center: Position, itemSize: number): Position[] {
  const cameraZ = useCameraZ()
  const { aspectRatioVec } = useCanvasAdapter()
  const centerX = center.x
  const centerY = center.y
  const width = cameraZ * 0.5
  const digits = itemSize === 1 ? 0 : -itemSize / 10
  const xWidth = truncate(width * aspectRatioVec[0], digits)
  const yWidth = truncate(width * aspectRatioVec[1], digits)
  const XArray = step(centerX - itemSize - xWidth, centerX + itemSize + xWidth, itemSize)
  const YArray = step(centerY - itemSize - yWidth, centerY + itemSize + yWidth, itemSize)
  return XArray.flatMap((x) => YArray.map((y) => ({ x, y })))
}
