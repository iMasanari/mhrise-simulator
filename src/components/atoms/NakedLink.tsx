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
  { href, as, replace, scroll, shallow, prefetch, locale, ...props },
  ref
) {
  return (
    <NextLink
      href={href}
      as={as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      prefetch={prefetch}
      locale={locale}
    >
      <a {...props} ref={ref} />
    </NextLink>
  )
})
