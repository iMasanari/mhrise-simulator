import { Breadcrumbs, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import * as React from 'react'
import { getSeries } from '../../api/armors'
import Link from '../../components/atoms/Link'

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticPaths: GetStaticPaths = async () => {
  const series = await getSeries()
  const paths = series.map(v => ({
    params: { series: v.name },
  }))

  return { paths, fallback: false }
}

export const getStaticProps = async (ctx: GetStaticPropsContext) => {
  const seriesName = ctx.params?.series
  const seriesList = await getSeries()

  const series = seriesList.find(v => v.name === seriesName)

  if (!series) throw new Error(`${seriesName} is not found`)

  return {
    props: { series },
  }
}

export default function SkillDetailPage({ series }: Props) {
  const armors = [series.head, series.body, series.arm, series.wst, series.leg]
    .filter(<T,>(v: T | null): v is NonNullable<T> => v as any)

  const defs = [
    armors.reduce((acc, v) => acc + v.defs[0], 0),
    armors.reduce((acc, v) => acc + v.defs[1], 0),
    armors.reduce((acc, v) => acc + v.defs[2], 0),
  ]

  const elements = [
    armors.reduce((acc, v) => acc + v.elements[0], 0),
    armors.reduce((acc, v) => acc + v.elements[1], 0),
    armors.reduce((acc, v) => acc + v.elements[2], 0),
    armors.reduce((acc, v) => acc + v.elements[3], 0),
    armors.reduce((acc, v) => acc + v.elements[4], 0),
  ]

  const skills = [...new Set(armors.flatMap(v => Object.keys(v.skills)))]
    .map(v => ({
      name: v,
      point: armors.reduce((acc, { skills }) => acc + (skills[v] || 0), 0),
    }))
    .sort((a, b) => b.point - a.point)

  return (
    <Container>
      <Head>
        <title>{series.name} | MHRise スキルシミュ</title>
      </Head>
      <Breadcrumbs aria-label="breadcrumb" sx={{ my: 1 }}>
        <Link color="inherit" href="/">Top</Link>
        <Link color="inherit" href="/armors">防具一覧</Link>
        <Typography color="textPrimary">{series.name}</Typography>
      </Breadcrumbs>
      <Box sx={{ my: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom textAlign="center">
          {series.name}
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom>
          基本データ
        </Typography>
        <Container maxWidth="md" disableGutters>
          <TableContainer component={Paper} sx={{ my: 2 }} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell component="th" colSpan={2}>名称 / スロット</TableCell>
                  <TableCell component="th" colSpan={2} align="center">防御 / 強化後</TableCell>
                  <TableCell component="th" align="center">火</TableCell>
                  <TableCell component="th" align="center">水</TableCell>
                  <TableCell component="th" align="center">雷</TableCell>
                  <TableCell component="th" align="center">氷</TableCell>
                  <TableCell component="th" align="center">龍</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {armors.map(armor =>
                  <TableRow key={armor.name}>
                    <TableCell>
                      <Typography variant="inherit" noWrap>{armor.name}</Typography>
                    </TableCell>
                    <TableCell>{armor.slots.filter(Boolean).map(v => `【${v}】`).join('')}</TableCell>
                    <TableCell align="center">{armor.defs[0]}</TableCell>
                    <TableCell align="center">{armor.defs[2]}</TableCell>
                    <TableCell align="center">{armor.elements[0] || null}</TableCell>
                    <TableCell align="center">{armor.elements[1] || null}</TableCell>
                    <TableCell align="center">{armor.elements[2] || null}</TableCell>
                    <TableCell align="center">{armor.elements[3] || null}</TableCell>
                    <TableCell align="center">{armor.elements[4] || null}</TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2}>合計</TableCell>
                  <TableCell align="center">{defs[0]}</TableCell>
                  <TableCell align="center">{defs[2]}</TableCell>
                  <TableCell align="center">{elements[0]}</TableCell>
                  <TableCell align="center">{elements[1]}</TableCell>
                  <TableCell align="center">{elements[2]}</TableCell>
                  <TableCell align="center">{elements[3]}</TableCell>
                  <TableCell align="center">{elements[4]}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Container>
        <Typography variant="h6" component="h2" gutterBottom>
          スキル効果
        </Typography>
        <Container maxWidth="md" disableGutters>
          <TableContainer component={Paper} sx={{ my: 2 }} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell component="th" colSpan={2}>発動スキル</TableCell>
                  <TableCell component="th">頭</TableCell>
                  <TableCell component="th">胴</TableCell>
                  <TableCell component="th">腕</TableCell>
                  <TableCell component="th">腰</TableCell>
                  <TableCell component="th">足</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {skills.map(skill =>
                  <TableRow key={skill.name}>
                    <TableCell>
                      <Link href={`/skills/${skill.name}`} noWrap>{skill.name}</Link>
                    </TableCell>
                    <TableCell>{`Lv${skill.point}`}</TableCell>
                    {armors.map(armor =>
                      <TableCell key={armor.name}>
                        {armor.skills[skill.name] || null}
                      </TableCell>
                    )}
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
