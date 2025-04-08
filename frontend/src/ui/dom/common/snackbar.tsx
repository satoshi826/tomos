import { sleep } from '@/util/function'
import { cva } from 'class-variance-authority'
import clsx from 'clsx'
import { atom, useAtom, useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { Icon } from './icon'

type SnackbarType = 'info' | 'error'
const snackbarAtom = atom<{ open: boolean; message: string; type: SnackbarType }>({ open: false, message: '', type: 'info' })

export const useSnackbar = () => {
  const setSnackbar = useSetAtom(snackbarAtom)
  return (message: string, type: SnackbarType = 'info') => setSnackbar({ open: true, message, type })
}

const baseStyle = 'alert !min-w-50 absolute right-5 bottom-4 z-50 border-1 border-divider backdrop-blur-sm duration-300'

const snackbarStyle = cva(baseStyle, {
  variants: {
    show: {
      true: 'opacity-100 scale-100',
      false: 'opacity-0 scale-0',
    },
    variant: {
      info: 'bg-primary-darker/60',
      error: 'bg-base-100A',
    },
  },
})

export function Snackbar() {
  const [snackbar, setSnackbar] = useAtom(snackbarAtom)
  const [show, setShow] = useState(snackbar.open)
  const infoType = snackbar.type === 'info'

  useEffect(() => {
    const effect = async () => {
      if (snackbar.open) {
        setShow(true)
        await sleep(4000)
        setShow(false)
        await sleep(400)
        setSnackbar((prev) => ({ ...prev, open: false }))
      }
    }
    effect()
  }, [setSnackbar, snackbar.open])

  if (!snackbar.open) return null
  return (
    <div className={clsx(snackbarStyle({ show, variant: snackbar.type }))}>
      <Icon>{infoType ? 'check' : 'error'}</Icon>
      <span>{snackbar.message}</span>
    </div>
  )
}
