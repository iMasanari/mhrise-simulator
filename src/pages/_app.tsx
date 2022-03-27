import createCache from '@emotion/cache'
import { CacheProvider, css, Global } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { AppProps } from 'next/app'
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

export const cache = createCache({ key: 'css', prepend: true })

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <SimulatorProvider>
        <PersistGate persistor={persistor}>
          {() =>
            <CacheProvider value={cache}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Global styles={globalStyle} />
                <Header title="MHRise スキルシミュ" />
                <Component {...pageProps} />
              </ThemeProvider>
            </CacheProvider>
          }
        </PersistGate>
      </SimulatorProvider>
    </Provider>
  )
}
