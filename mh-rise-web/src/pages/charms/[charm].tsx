import { Breadcrumbs, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import * as React from 'react'
import { getCharms } from '../../api/charms'
import Link from '../../components/atoms/Link'

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticPaths: GetStaticPaths = async () => {
  const charms = await getCharms()
  const paths = charms.map(v => ({
    params: { charm: v.name },
  }))

  return { paths, fallback: false }
}

export const getStaticProps = async (ctx: GetStaticPropsContext) => {
  const charmName = ctx.params?.charm
  const charms = await getCharms()

  const charm = charms.find(v => v.name === charmName)

  if (!charm) throw new Error(`${charmName} is not found`)

  return {
    props: { charm },
  }
}

export default function SkillDetailPage({ charm }: Props) {
  const materials = [...new Set(charm.charms.flatMap(v => Object.keys(v.materials)))]
    .map(v => ({
      name: v,
      count: charm.charms.reduce((acc, { materials }) => acc + (materials[v] || 0), 0),
    }))
    .sort((a, b) => b.count - a.count)

  return (
    <Container maxWidth="md">
      <Head>
        <title>{charm.name} | MHRise スキルシミュ</title>
      </Head>
      <Breadcrumbs aria-label="breadcrumb" sx={{ my: 1 }}>
        <Link color="inherit" href="/">Top</Link>
        <Link color="inherit" href="/charms">護符一覧</Link>
        <Typography color="textPrimary">{charm.name}</Typography>
      </Breadcrumbs>
      <Box sx={{ my: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom textAlign="center">
          {charm.name}
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom>
          基本データ
        </Typography>
        <TableContainer component={Paper} sx={{ my: 2 }} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell component="th">名称</TableCell>
                <TableCell component="th">スキル</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {charm.charms.map(charm =>
                <TableRow key={charm.name}>
                  <TableCell>
                    <Typography variant="inherit" noWrap>{charm.name}</Typography>
                  </TableCell>
                  <TableCell>
                    {Object.entries(charm.skills).map(([skill, point]) =>
                      <div key={skill}>
                        <Link href={`/skills/${skill}`}>{skill}</Link>
                        {` ${point}pt`}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="h6" component="h2" gutterBottom>
          必要素材
        </Typography>
        <TableContainer component={Paper} sx={{ my: 2 }} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell component="th">名称</TableCell>
                <TableCell component="th">素材</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {charm.charms.map(charm =>
                <TableRow key={charm.name}>
                  <TableCell>
                    <Typography variant="inherit" noWrap>{charm.name}</Typography>
                  </TableCell>
                  <TableCell>
                    {Object.entries(charm.materials).map(([key, value]) =>
                      <div key={key}>{`${key} x${value}`}</div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>合計</TableCell>
                <TableCell>
                  {materials.map((v) =>
                    <div key={v.name}>{`${v.name} x${v.count}`}</div>
                  )}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  )
}
