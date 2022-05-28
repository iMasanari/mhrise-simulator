import { Button, ButtonProps, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React, { ReactNode, useState } from 'react'

interface Props extends ButtonProps {
  dialogTitle: ReactNode
  dialogContent: ReactNode
  actionText: ReactNode
  action: () => void
}

export default function ConfirmButton({ dialogTitle, dialogContent, actionText, action, ...props }: Props) {
  const [open, setOpen] = useState(false)
  const onClose = () => setOpen(false)

  const onAction = () => {
    onClose()
    action()
  }

  return (
    <>
      <Button {...props} onClick={() => setOpen(true)} />
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          {dialogContent}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>
            キャンセル
          </Button>
          <Button onClick={onAction} variant="contained">
            {actionText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
