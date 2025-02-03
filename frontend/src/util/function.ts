import { truncate } from 'jittoku'

export const truncateUnit = (value: number, unit: number): number => {
  const digits = unit === 1 ? 0 : -Math.log10(unit)
  return truncate(value, digits)
}
