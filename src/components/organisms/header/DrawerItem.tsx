import { ListItem, ListItemText } from '@mui/material'
import React, { ReactNode } from 'react'
import NakedLink from '../../atoms/NakedLink'

interface Props {
  href: string
  onClick: () => void
  children: NonNullable<ReactNode>
}

export default function DrawerItem({ href, onClick, children }: Props) {
  return (
    <ListItem button component={NakedLink} href={href} onClick={onClick}>
      <ListItemText primary={children} />
    </ListItem>
  )
}
