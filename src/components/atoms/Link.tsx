import { Link as MuiLink, LinkProps } from '@mui/material'
import NextLink from 'next/link'
import React, { forwardRef } from 'react'

interface Props extends LinkProps {
  href: string
  as?: string
  replace?: boolean
  scroll?: boolean
  shallow?: boolean
  prefetch?: boolean
  locale?: string | false
}

export default forwardRef<HTMLAnchorElement, Props>(function LinkBehavior(
  props,
  ref
) {
  if (props.href[0] !== ('/')) {
    return <MuiLink target="_blank" rel="noopener" {...props} ref={ref} />
  }

  return (
    <MuiLink component={NextLink} {...props} ref={ref} />
  )
})
