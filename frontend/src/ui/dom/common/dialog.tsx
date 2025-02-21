import { type ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { Button } from './button'

const ModalPortal = ({ children }: { children: React.ReactNode }) => {
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  return createPortal(children, document.getElementById('modal')!)
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

  const { t } = useTranslation()
  return (
    <ModalPortal>
      <dialog className="modal" ref={dialogRef}>
        <div className="modal-box">
          {title && <h3 className="font-bold text-lg">{title}</h3>}
          <div className="px-1 py-2">{_open && children}</div>
          <div className="modal-action">
            <form method="dialog">
              <Button onClick={handleClose} outline>
                {t('common.cancel')}
              </Button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={handleClose} />
        </form>
      </dialog>
    </ModalPortal>
  )
}
