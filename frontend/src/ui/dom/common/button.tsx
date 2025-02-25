import type { ClassName } from '@/util/type'
import { cva } from 'class-variance-authority'
import clsx from 'clsx'
import type React from 'react'
import { Icon } from './icon'

const baseStyles: ClassName = 'rounded-field duration-200 inline-flex gap-0.5 cursor-pointer'

const variants = {
  variant: {
    contained: 'bg-primary hover:bg-primary-light active:bg-primary-lighter active:text-white',
    outlined: 'border border-base-content hover:border-primary-lighter hover:text-primary-lighter',
  },
  size: {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  },
  disabled: {
    true: null,
    false: null,
  },
}

const compoundVariants = [
  {
    variant: 'contained' as const,
    disabled: true,
    class: 'bg-base-300 text-base-content',
  },
  {
    variant: 'outlined' as const,
    disabled: true,
    class: 'border border-base-content text-base-content',
  },
]

const buttonStyles = cva(baseStyles, {
  variants,
  compoundVariants,
  defaultVariants: {
    size: 'md',
    disabled: false,
    variant: 'contained',
  },
})

type Props = {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'contained' | 'outlined'
  disabled?: boolean
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  icon?: string
  onClick?: () => void
}

export const Button = ({ size = 'md', disabled = false, children, className, icon, variant, ...props }: Props) => {
  return (
    <button type="button" className={clsx(buttonStyles({ size, disabled, variant }), className)} disabled={disabled} {...props}>
      {icon && <Icon size="sm">{icon}</Icon>}
      {children}
    </button>
  )
}
