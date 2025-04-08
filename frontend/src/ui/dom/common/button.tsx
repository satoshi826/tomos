import type { ClassName } from '@/util/type'
import { cva } from 'class-variance-authority'
import clsx from 'clsx'
import { Icon } from './icon'

const Spinner = ({ size = 24, color = 'currentColor' }) => {
  return (
    <svg width={size} height={size} fill={color} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="animate-spin">
      <title>Loading spinner</title>
      <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25" />
      <path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z" />
    </svg>
  )
}

const baseStyles: ClassName = 'rounded-field duration-300 inline-flex gap-2 cursor-pointer justify-center items-center'

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
    true: 'cursor-not-allowed pointer-events-none',
    false: null,
  },
}

const compoundVariants = [
  {
    variant: 'contained' as const,
    disabled: true,
    class: '!bg-base-100A opacity-60',
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

export type ButtonProps = {
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  variant?: 'contained' | 'outlined'
  loading?: boolean
  disabled?: boolean
  children: string
  className?: string
  style?: React.CSSProperties
  icon?: string | React.ReactNode
  onClick?: () => void
}

export const Button = ({
  size = 'md',
  type = 'button',
  loading = false,
  disabled,
  children,
  className,
  icon,
  variant = 'contained',
  ...props
}: ButtonProps) => {
  const _disabled = disabled || loading
  return (
    <button type={type} className={clsx(buttonStyles({ size, disabled: _disabled, variant }), className)} disabled={_disabled} {...props}>
      {icon && (loading ? <Spinner /> : typeof icon === 'string' ? <Icon size="sm">{icon}</Icon> : icon)}
      {children}
    </button>
  )
}
