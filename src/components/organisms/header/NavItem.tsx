import { css, Theme } from '@emotion/react'
import React, { ReactNode } from 'react'
import Link from '../../atoms/Link'

interface Props {
  href: string
  children: NonNullable<ReactNode>
}

const linkStyle = (theme: Theme) => css`
  margin-left: ${theme.spacing(3)};
`

export default function NavItem({ href, children }: Props) {
  return (
    <Link href={href} css={linkStyle} color="inherit" underline="hover" variant="body1" noWrap>
      {children}
    </Link>
  )
}
