import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'
import { AppProps } from 'next/app'
import Head from 'next/head'
import * as React from 'react'
import theme from '../theme'

export const cache = createCache({ key: 'css', prepend: true })

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles)
    }
  }, [])

  return (
    <CacheProvider value={cache}>
      <Head>
        <title>My page</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  )
}
