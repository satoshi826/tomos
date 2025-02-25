import { useMyProfileColor, useSetMyProfileColor } from '@/domain/hooks'
import clsx from 'clsx'

const baseClassName = 'range range-primary'

type Props = {
  className?: string
}

export function MyColorSlider({ className }: Props) {
  const myProfileColor = useMyProfileColor()
  const setMyProfileColor = useSetMyProfileColor()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setMyProfileColor(Number(e.target.value))
  return <input type="range" className={clsx(baseClassName, className)} min="0" max="360" value={myProfileColor} onChange={handleChange} />
}
