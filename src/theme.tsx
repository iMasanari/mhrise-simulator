import { red } from '@mui/material/colors'
import { createTheme, Theme as MuiTheme } from '@mui/material/styles'

declare module '@emotion/react' {
  interface Theme extends MuiTheme {
  }
}

// Create a theme instance.
const theme = createTheme({
  typography: {
    fontFamily: '游ゴシック体,YuGothic,游ゴシック,Yu Gothic,メイリオ,sans-serif',
    fontWeightRegular: 500,
  },
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
