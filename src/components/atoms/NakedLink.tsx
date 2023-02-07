import NextLink from 'next/link'
import React, { AnchorHTMLAttributes, forwardRef } from 'react'

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  as?: string
  replace?: boolean
  scroll?: boolean
  shallow?: boolean
  prefetch?: boolean
  locale?: string | false
}

export default forwardRef<HTMLAnchorElement, Props>(function NakedLink(
  props,
  ref
) {
  return (
    <NextLink {...props} ref={ref} />
  )
})
