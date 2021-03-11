import { Breadcrumbs, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import { InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import * as React from 'react'
import { getSeries } from '../../api/armors'
import Link from '../../components/atoms/Link'

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticProps = async () => {
  const series = await getSeries()

  const data = series.map(v => {
    const armors = [v.head, v.body, v.arm, v.wst, v.leg]
      .filter(<T,>(v: T | null): v is NonNullable<T> => v as any)

    return {
      name: v.name,
      def: [
        armors.reduce((acc, v) => acc + v.defs[0], 0),
        armors.reduce((acc, v) => acc + v.defs[1], 0),
        armors.reduce((acc, v) => acc + v.defs[2], 0),
      ],
      elements: [
        armors.reduce((acc, v) => acc + v.elements[0], 0),
        armors.reduce((acc, v) => acc + v.elements[1], 0),
        armors.reduce((acc, v) => acc + v.elements[2], 0),
        armors.reduce((acc, v) => acc + v.elements[3], 0),
        armors.reduce((acc, v) => acc + v.elements[4], 0),
      ],
    }
  })

  return {
    props: { series: data },
  }
}

export default function SkillsPage({ series }: Props) {
  return (
    <Container>
      <Head>
        <title>防具一覧 | MHRise スキルシミュ</title>
      </Head>
      <Breadcrumbs aria-label="breadcrumb" sx={{ my: 1 }}>
        <Link color="inherit" href="/">Top</Link>
        <Typography color="textPrimary">防具一覧</Typography>
      </Breadcrumbs>
      <Box sx={{ my: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom textAlign="center">
          防具一覧
        </Typography>
        <Container maxWidth="md" disableGutters>
          <TableContainer component={Paper} sx={{ my: 2 }} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell component="th">防具</TableCell>
                  <TableCell component="th" colSpan={2} align="center">防御 / 強化後</TableCell>
                  <TableCell component="th" align="center">火</TableCell>
                  <TableCell component="th" align="center">水</TableCell>
                  <TableCell component="th" align="center">雷</TableCell>
                  <TableCell component="th" align="center">氷</TableCell>
                  <TableCell component="th" align="center">龍</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {series.map(armor =>
                  <TableRow key={armor.name}>
                    <TableCell>
                      <Link href={`/armors/${encodeURIComponent(armor.name)}`} noWrap>
                        {armor.name}
                      </Link>
                    </TableCell>
                    <TableCell align="center">{armor.def[0]}</TableCell>
                    <TableCell align="center">{armor.def[2]}</TableCell>
                    <TableCell align="center">{armor.elements[0] || null}</TableCell>
                    <TableCell align="center">{armor.elements[1] || null}</TableCell>
                    <TableCell align="center">{armor.elements[2] || null}</TableCell>
                    <TableCell align="center">{armor.elements[3] || null}</TableCell>
                    <TableCell align="center">{armor.elements[4] || null}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>
    </Container>
  )
}
