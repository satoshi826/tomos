import { truncate } from 'jittoku'

export const truncateUnit = (value: number, unit: number): number => {
  const digits = unit === 1 ? 0 : -Math.log10(unit)
  return truncate(value, digits)
}

export const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))
