import createEmotionServer from '@emotion/server/create-instance'
import { ServerStyleSheets } from '@material-ui/core/styles'
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import * as React from 'react'
import theme from '../theme'
import { cache } from './_app'

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
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
