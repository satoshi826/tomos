import type { ClassName } from '@/util/type'
import clsx from 'clsx'
import type { ChangeEvent } from 'react'

type Props = {
  label?: string
  value: string
  maxLength?: number
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  hint?: string
  className?: string
  rows?: number
}

const baseClass: ClassName = 'textarea w-full resize-none bg-base-200A p-5 duration-300 focus:border-primary-lighter focus:outline-none'

export function Textarea({ value, maxLength, className, onChange, placeholder, hint, rows }: Props) {
  return (
    <>
      <textarea
        className={clsx(baseClass, className)}
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        onChange={onChange}
        rows={rows}
      />
      <p className="validator-hint mt-1 pl-4 opacity-70">{hint || '\u00A0'}</p>
    </>
  )
}
