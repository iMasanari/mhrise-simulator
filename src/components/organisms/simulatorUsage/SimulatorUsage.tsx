import { css } from '@emotion/react'
import { Box, Typography } from '@mui/material'
import Link from '../../atoms/Link'

const imgStyle = css`
  max-width: 100%;
`

export default function SimulatorUsage() {
  return (
    <Box sx={{ my: 2 }}>
      <Box component="section" sx={{ mb: 4 }}>
        <Typography gutterBottom>
          モンスターハンター Rise のスキルシミュレーターです。（サンブレイク未対応）
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          使い方
        </Typography>
        <section>
          <Typography variant="h6" component="h3" gutterBottom>
            スキルを指定して検索
          </Typography>
          <Typography gutterBottom>
            「スキル追加」ボタンから発動したいスキルを選び、「検索」ボタンを押下してください。
            指定したスキルが発動する防具の組み合わせが、防御力の高い順に表示されます。
            結果の行をクリックすると、詳細を確認できます。
          </Typography>
          <Typography gutterBottom>
            結果が10件以上ある場合は「さらに検索」ボタンを押下すると、10件ずつ追加で検索されます。
          </Typography>
        </section>
        <section>
          <Typography variant="h6" component="h3" gutterBottom>
            手持ちの護石を登録する
          </Typography>
          <Typography gutterBottom>
            「護石設定」タブの「護石追加」ボタンで追加できます。
            追加した護石は、検索の結果に表示されます。
          </Typography>
        </section>
      </Box>
      <Box component="section" sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          最近共有された装備
        </Typography>
        <Link href="/shares" prefetch={false}>
          {'>> こちらに移動しました <<'}
        </Link>
      </Box>
      <Box component="section" sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          開発
        </Typography>
        <Typography gutterBottom>
          {'コードは MIT ライセンスの元、Github にて公開しています。 '}
          イシューやプルリクをお待ちしています。
        </Typography>
        <a href="https://github.com/iMasanari/mhrise-simulator" target="_blank" rel="noopener">
          <img css={imgStyle} src="https://gh-card.dev/repos/iMasanari/mhrise-simulator.svg" width={442} height={108} />
        </a>
      </Box>
    </Box>
  )
}
