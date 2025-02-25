import type React from 'react'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { Button } from './button'
import { IconButton } from './iconButton'

const ModalPortal = ({ children }: { children: React.ReactNode }) => {
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  return createPortal(children, document.getElementById('modal')!)
}

type Props = {
  open: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  primaryButton?: ReactNode
}

export const Dialog = ({ children, open, onClose, title, primaryButton }: Props) => {
  const [_open, setOpen] = useState(open)
  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setOpen(false)
    }, 250)
  }

  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal()
      setOpen(true)
    } else {
      dialogRef.current?.close()
    }
  }, [open])

  useEffect(() => {
    dialogRef.current?.addEventListener('close', handleClose)
    return () => dialogRef.current?.removeEventListener('close', handleClose)
  })

  const { t } = useTranslation()

  return (
    <ModalPortal>
      <dialog className="modal" ref={dialogRef}>
        <div className="modal-box border border-divider shadow-xl backdrop-blur-md">
          {_open && (
            <>
              {title && <h3 className="font-bold text-lg">{title}</h3>}
              <div className="px-1 py-2">{children}</div>
              <div className="modal-action gap-2.5">{primaryButton}</div>
              <IconButton size="sm" onClick={handleClose} className="absolute top-3 right-4">
                close
              </IconButton>
            </>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={handleClose} />
        </form>
      </dialog>
    </ModalPortal>
  )
}
