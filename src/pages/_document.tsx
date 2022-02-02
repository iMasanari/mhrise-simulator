import createEmotionServer from '@emotion/server/create-instance'
import { ServerStyleSheets } from '@mui/styles'
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import * as React from 'react'
import theme from '../theme'
import { cache } from './_app'

const googleAnalyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID

const googleAnalyticsScript = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', ${JSON.stringify(googleAnalyticsId)});
`

const { extractCritical } = createEmotionServer(cache)

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheets = new ServerStyleSheets()
    const originalRenderPage = ctx.renderPage

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
      })

    const initialProps = await Document.getInitialProps(ctx)
    const styles = extractCritical(initialProps.html)

    return {
      ...initialProps,
      // Styles fragment is rendered after the app and page rendering finish.
      styles: [
        ...React.Children.toArray(initialProps.styles),
        sheets.getStyleElement(),
        <style
          key="emotion-style-tag"
          data-emotion={`css ${styles.ids.join(' ')}`}
          dangerouslySetInnerHTML={{ __html: styles.css }}
        />,
      ],
    }
  }

  render() {
    return (
      <Html lang="ja">
        <Head>
          {/* PWA primary color */}
          <meta name="theme-color" content={theme.palette.primary.main} />
          {googleAnalyticsId && (
            <>
              <script async src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}></script>
              <script dangerouslySetInnerHTML={{ __html: googleAnalyticsScript }}></script>
            </>
          )}
          <link rel="icon" href="/images/icon.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/images/icon.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
