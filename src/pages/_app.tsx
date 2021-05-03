import createCache from '@emotion/cache'
import { CacheProvider, css, Global } from '@emotion/react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'
import { AppProps } from 'next/app'
import * as React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import Header from '../components/organisms/header/Header'
import { persistor, store } from '../configureStore'
import theme from '../theme'

const globalStyle = css`
body {
  font-feature-settings: "palt";
}
`

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
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        {() =>
          <CacheProvider value={cache}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Global styles={globalStyle} />
              <Header title="MHRise シミュ" />
              <Component {...pageProps} />
            </ThemeProvider>
          </CacheProvider>
        }
      </PersistGate>
    </Provider>
  )
}
