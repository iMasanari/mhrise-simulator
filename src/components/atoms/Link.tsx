import { Link as MuiLink, LinkProps } from '@material-ui/core'
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

export default forwardRef<HTMLAnchorElement, Props>(function Link(
  { href, as, replace, scroll, shallow, prefetch, locale, ...props },
  ref
) {
  if (href[0] !== ('/')) {
    return <MuiLink href={href} target="_blank" rel="noopener" {...props} ref={ref} />
  }

  return (
    <NextLink
      href={href}
      as={as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      prefetch={prefetch}
      locale={locale}
      passHref
    >
      <MuiLink {...props} ref={ref} />
    </NextLink>
  )
})
