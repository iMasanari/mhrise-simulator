import { Box, Breadcrumbs, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { GetStaticPaths, GetStaticProps } from 'next'
import * as React from 'react'
import { getDecos } from '../../api/decos'
import Link from '../../components/atoms/Link'
import MetaData from '../../components/templates/MetaData'

interface Deco {
  name: string
  size: number
  skills: Record<string, number>
  materials: Record<string, number>
}

interface Props {
  deco: Deco
}

export const getStaticPaths: GetStaticPaths = async () => {
  const decos = await getDecos()
  const paths = decos.map(v => ({
    params: { deco: v.name },
  }))

  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const decoName = ctx.params?.deco
  const decos = await getDecos()

  const deco = decos.find(v => v.name === decoName)

  if (!deco) {
    return { notFound: true }
  }

  return {
    props: { deco },
  }
}

export default function SkillDetailPage({ deco }: Props) {
  return (
    <Container maxWidth="md">
      <MetaData
        title={`${deco.name} | MHRise スキルシミュ`}
        description={`装飾品「${deco.name}」の詳細です。`}
      />
      <Breadcrumbs aria-label="breadcrumb" sx={{ my: 1 }}>
        <Link color="inherit" underline="hover" href="/">Top</Link>
        <Link color="inherit" underline="hover" href="/decos">装飾品一覧</Link>
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
