import type { ClassName } from '@/util/type'
import clsx from 'clsx'
import { Icon } from './icon'

// export const iconButtonStyles: ClassName = 'btn btn-circle border-0 bg-transparent'
export const iconButtonStyles: ClassName = 'duration-300 hover:text-primary-lighter hover:scale-110 active:scale-85 active:text-white '

type Props = {
  children: string
  onClick: () => void
  className?: ClassName
  size?: 'sm' | 'md' | 'lg'
}

export function IconButton({ children, onClick, className, size = 'md' }: Props) {
  return (
    <button type="button" onClick={onClick} className={clsx(iconButtonStyles, className)}>
      <Icon size={size}>{children}</Icon>
    </button>
  )
}
