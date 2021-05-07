import { Breadcrumbs, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import * as React from 'react'
import { getDecos } from '../../api/decos'
import Link from '../../components/atoms/Link'

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticPaths: GetStaticPaths = async () => {
  const decos = await getDecos()
  const paths = decos.map(v => ({
    params: { deco: v.name },
  }))

  return { paths, fallback: false }
}

export const getStaticProps = async (ctx: GetStaticPropsContext) => {
  const decoName = ctx.params?.deco
  const decos = await getDecos()

  const deco = decos.find(v => v.name === decoName)

  if (!deco) throw new Error(`${decoName} is not found`)

  return {
    props: { deco },
  }
}

export default function SkillDetailPage({ deco }: Props) {
  return (
    <Container maxWidth="md">
      <Head>
        <title>{deco.name} | MHRise スキルシミュ</title>
      </Head>
      <Breadcrumbs aria-label="breadcrumb" sx={{ my: 1 }}>
        <Link color="inherit" href="/">Top</Link>
        <Link color="inherit" href="/decos">装飾品一覧</Link>
        <Typography color="textPrimary">{deco.name}</Typography>
      </Breadcrumbs>
      <Box sx={{ my: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom textAlign="center">
          {deco.name}
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
              <TableRow key={deco.name}>
                <TableCell>
                  <Typography variant="inherit" noWrap>{deco.name}</Typography>
                </TableCell>
                <TableCell>
                  {Object.entries(deco.skills).map(([skill, point]) =>
                    <div key={skill}>
                      <Link href={`/skills/${skill}`}>{skill}</Link>
                      {` ${point}pt`}
                    </div>
                  )}
                </TableCell>
              </TableRow>
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
              <TableRow key={deco.name}>
                <TableCell>
                  <Typography variant="inherit" noWrap>{deco.name}</Typography>
                </TableCell>
                <TableCell>
                  {Object.entries(deco.materials).map(([key, value]) =>
                    <div key={key}>{`${key} x${value}`}</div>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  )
}
