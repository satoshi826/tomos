import type { ClassName } from '@/util/type'
import { cva } from 'class-variance-authority'
import clsx from 'clsx'

const SIZE = {
  sm: '!text-md',
  md: '!text-3xl',
  lg: '!text-4xl',
  unset: null,
}

const iconStyles = cva('material-symbols-rounded select-none text-center', {
  variants: {
    size: SIZE,
  },
  defaultVariants: { size: 'unset' },
})

type Size = keyof typeof SIZE

type Props = {
  children: string
  className?: ClassName
  size?: Size
}

export function Icon({ children, className, size }: Props) {
  return <span className={clsx(iconStyles({ size }), className)}>{children}</span>
}
