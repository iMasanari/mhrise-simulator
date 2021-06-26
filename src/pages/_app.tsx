import { css, Global } from '@emotion/react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'
import { AppProps } from 'next/app'
import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import Header from '../components/organisms/header/Header'
import { persistor, store } from '../configureStore'
import { SimulatorProvider } from '../contexts/SimulatorContext'
import theme from '../theme'

const globalStyle = css`
body {
  font-feature-settings: "palt";
}
`

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles)
    }
  }, [])

  return (
    <Provider store={store}>
      <SimulatorProvider>
        <PersistGate persistor={persistor}>
          {() =>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Global styles={globalStyle} />
              <Header title="MHRise スキルシミュ" />
              <Component {...pageProps} />
            </ThemeProvider>
          }
        </PersistGate>
      </SimulatorProvider>
    </Provider>
  )
}
