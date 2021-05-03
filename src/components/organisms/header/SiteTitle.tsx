import { Typography } from '@material-ui/core'
import React, { HTMLProps } from 'react'
import Link from '../../atoms/Link'

interface Props extends HTMLProps<HTMLDivElement> {
  title: string
  isHeading?: boolean
}

export default function SiteTitle({ title, isHeading, ...props }: Props) {
  return (
    <div {...props}>
      <Typography variant="h6" component={isHeading ? 'h1' : 'div'} noWrap>
        <Link href="/" color="inherit" underline="none">
          {title}
        </Link>
      </Typography>
    </div>
  )
}
