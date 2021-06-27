import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import React from 'react'

interface Props {
  title: string
  onClose: () => void
}

export default function DialogHeader({ title, onClose }: Props) {
  return (
    <AppBar sx={{ position: 'relative' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ mr: 'auto' }}>
          {title}
        </Typography>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <Close />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}
