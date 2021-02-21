import MuiLink from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import * as React from 'react'

export default function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <MuiLink color="inherit" href="https://material-ui.com/">
        Your Website
      </MuiLink>{' '}
      {new Date().getFullYear()}.
    </Typography>
  )
}
