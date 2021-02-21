import { red } from '@material-ui/core/colors'
import { createMuiTheme, Theme as MuiTheme } from '@material-ui/core/styles'

declare module '@emotion/react' {
  interface Theme extends MuiTheme {
  }
}

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
})

export default theme
