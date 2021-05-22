import Head from 'next/head'

interface Props {
  title: string
  description: string
  type?: 'website' | 'article'
  image?: string
  twitterCard?: string
}

const icon = `${process.env.BASE_URL}/images/icon.png`

export default function MetaData({ title, description, type = 'website', image = icon, twitterCard = 'summary' }: Props) {
  return (
    <Head>
      <title>{title}</title>
      <meta key="description" name="description" content={description} />
      <meta key="og:type" property="og:type" content={type} />
      <meta key="og:title" property="og:title" content={title} />
      <meta key="og:description" property="og:description" content={description} />
      <meta key="og:image" property="og:image" content={image} />
      <meta key="twitter:card" name="twitter:card" content={twitterCard} />
    </Head>
  )
}
