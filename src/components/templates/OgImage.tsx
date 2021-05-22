import { css, Global } from '@emotion/react'
import { Box, Container, createMuiTheme, CssBaseline, Grid, Link, Paper, Table, TableBody, TableCell, TableContainer, TableRow, ThemeProvider, Typography } from '@material-ui/core'
import React from 'react'
import { Equip, Slots } from '../../domain/equips'
import theme from '../../theme'

interface Props {
  equip: Equip
  font: string
}

const globalStyle = css`
html {
  font-size: 30px;
}

body {
  font-feature-settings: "palt";
}
`

const ogTheme = createMuiTheme({
  ...theme,
  typography: {
    fontFamily: '"Noto Sans JP", sans-serif',
  },
})

const showSlots = (slots: Slots | undefined) =>
  slots?.map((s) => s ? `【${s}】` : null)

export default function OgImage({ equip, font }: Props) {
  const skills = Object.entries(equip.skills).sort(([, a], [, b]) => b - a)

  const weapon = { slots: equip.weaponSlot }
  const armors = [weapon, equip.head, equip.body, equip.arm, equip.wst, equip.leg, equip.charm]
    .filter(Boolean as unknown as <T>(v: T) => v is NonNullable<T>)

  const slots = armors.flatMap(armor => armor.slots.map(s => [armor, s] as const))
    .sort(([, a], [, b]) => b - a)

  const charmName = equip.charm
    ? Object.entries(equip.charm.skills).map(([name, point]) => <div key={name}>{`${name} Lv${point}`}</div>) : null

  return (
    <ThemeProvider theme={ogTheme}>
      <CssBaseline />
      <Container>
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          {'装備共有 '}
          <Link>#Riseシミュ</Link>
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell component="th">武器</TableCell>
                    <TableCell>スロット{equip.weaponSlot[0] ? showSlots(equip.weaponSlot) : 'なし'}</TableCell>
                    <TableCell>{showSlots(equip.weaponSlot)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">頭装備</TableCell>
                    <TableCell>{equip.head?.name}</TableCell>
                    <TableCell>{showSlots(equip.head?.slots)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">胴装備</TableCell>
                    <TableCell>{equip.body?.name}</TableCell>
                    <TableCell>{showSlots(equip.body?.slots)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">腕装備</TableCell>
                    <TableCell>{equip.arm?.name}</TableCell>
                    <TableCell>{showSlots(equip.arm?.slots)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">腰装備</TableCell>
                    <TableCell>{equip.wst?.name}</TableCell>
                    <TableCell>{showSlots(equip.wst?.slots)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">足装備</TableCell>
                    <TableCell>{equip.leg?.name}</TableCell>
                    <TableCell>{showSlots(equip.leg?.slots)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th">護石</TableCell>
                    <TableCell>{charmName}</TableCell>
                    <TableCell>{showSlots(equip.charm?.slots)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={6}>
            <Typography gutterBottom>発動スキル</Typography>
            <Box sx={{ columnCount: 2 }}>
              {skills.map(([skill, point]) =>
                <div key={skill}>
                  {`${skill} Lv${point}`}
                </div>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Global styles={globalStyle} />
      <Global styles={css`
        @font-face {
          font-family: 'Noto Sans JP';
          font-weight: nomal;
          src: url('data:font/ttf;charset=utf-8;base64,${font}') format('woff');
        }`
      } />
    </ThemeProvider >
  )
}
