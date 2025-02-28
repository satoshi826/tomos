import { truncate } from 'jittoku'
import type { Position } from './types/util'

export const truncateUnit = (value: number, unit: number): number => {
  const digits = unit === 1 ? 0 : -Math.log10(unit)
  return truncate(value, digits)
}

export const truncatePosition = (position: Position, unit: number) => {
  return {
    x: truncateUnit(position.x, unit),
    y: truncateUnit(position.y, unit),
  }
}

// export const truncateAreaPosition = (position: Position) => truncatePosition(position, AREA_SIDE)
