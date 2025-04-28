import type { ClassName } from '@/util/type'
import clsx from 'clsx'
import type { ChangeEvent } from 'react'

type Props = {
  label?: string
  value: string
  maxLength?: number
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  hint?: string
  className?: string
}

const baseClass: ClassName = 'input input-bordered w-full resize-none bg-base-200A p-5 duration-300'
const focusClass: ClassName = 'focus:border-primary-lighter focus:outline-none'

export function Input({ value, maxLength, className, onChange, placeholder, hint }: Props) {
  return (
    <>
      <input
        className={clsx(baseClass, focusClass, className)}
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        onChange={onChange}
      />
      <p className="validator-hint mt-1 pl-4 opacity-70">{hint || '\u00A0'}</p>
    </>
  )
}
