import { Alert, AlertTitle } from '@material-ui/core'

export default function DevelopWarning() {
  return (
    <Alert severity="warning" sx={{ my: 2 }}>
      <AlertTitle>入力中・開発中のデータを表示しています</AlertTitle>
      MHRiseのデータは判明し次第、反映いたします。また、過去作品のデータが表示されている可能性があります。
    </Alert>
  )
}
