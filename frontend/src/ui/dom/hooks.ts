import { useCameraZ, useCanvasAdapter } from '@/domain/hooks'
import { step } from 'jittoku'
import { truncateUnit } from 'shared/functions'
import type { Position } from 'shared/types'

export function useViewablePositions(center: Position, itemSize: number): Position[] {
  const cameraZ = useCameraZ()
  const { aspectRatioVec } = useCanvasAdapter()
  const centerX = center.x
  const centerY = center.y
  const width = cameraZ * 0.5
  const xWidth = truncateUnit(width * aspectRatioVec[0], itemSize)
  const yWidth = truncateUnit(width * aspectRatioVec[1], itemSize)
  const XArray = step(centerX - itemSize - xWidth, centerX + itemSize + xWidth, itemSize)
  const YArray = step(centerY - itemSize - yWidth, centerY + itemSize + yWidth, itemSize)
  return XArray.flatMap((x) => YArray.map((y) => ({ x, y })))
}
