import type React from 'react'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { IconButton } from './iconButton'

const modalId = 'modal'
export function ModalWrapper() {
  return <div id={modalId} />
}

const ModalPortal = ({ children }: { children: React.ReactNode }) => {
  return createPortal(children, document.getElementById(modalId)!)
}

type Props = {
  open: boolean
  onClose: () => void
  children: ReactNode
  title?: string
}

export const Dialog = ({ children, open, onClose, title }: Props) => {
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

  return (
    <ModalPortal>
      <dialog className="modal" ref={dialogRef}>
        <div className="modal-box border border-divider shadow-xl backdrop-blur-md">
          {_open && (
            <>
              {title && <h3 className="pb-3 font-bold text-lg">{title}</h3>}
              <div className="px-1 py-1">{children}</div>
              <IconButton size="sm" onClick={handleClose} className="absolute top-4 right-4">
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

export const DialogActions = ({ children }: { children: ReactNode }) => {
  return (
    <div className="modal-action mt-3 gap-2.5">
      <button type="submit" disabled style={{ display: 'none' }} />
      {children}
    </div>
  )
}
