import { useMyProfileColor, useSetMyProfileColor } from '@/domain/hooks'
import clsx from 'clsx'
import './rainbowSlider.css'

type Props = { className?: string }

const RAINBOW_GRADIENT = `linear-gradient(90deg, ${Array.from({ length: 11 }, (_, i) => `oklch(72% 0.25 ${(i / 10) * 360})`).join(', ')})`
const style = { background: RAINBOW_GRADIENT, color: 'transparent' }

export function MyColorSlider({ className }: Props) {
  const myProfileColor = useMyProfileColor()
  const setMyProfileColor = useSetMyProfileColor()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setMyProfileColor(Number(e.target.value))
  return (
    <input
      type="range"
      style={style}
      className={clsx(className, 'rainbow-slider range range-primary w-full')}
      min="0"
      max="360"
      value={myProfileColor}
      onChange={handleChange}
    />
  )
}
