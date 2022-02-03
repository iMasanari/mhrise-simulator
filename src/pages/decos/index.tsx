import { Box, Breadcrumbs, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { InferGetStaticPropsType } from 'next'
import React from 'react'
import { getDecos } from '../../api/decos'
import Link from '../../components/atoms/Link'
import MetaData from '../../components/templates/MetaData'

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticProps = async () => {
  const decos = await getDecos()

  const data = decos.map(v => ({
    name: v.name,
    size: v.size,
    skill: Object.entries(v.skills)[0],
  }))

  return {
    props: { decos: data },
  }
}

export default function SkillsPage({ decos }: Props) {
  return (
    <Container maxWidth="md">
      <MetaData
        title="装飾品一覧 | MHRise スキルシミュ"
        description="MHRise スキルシミュで使用している装飾品の一覧です。"
      />
      <Breadcrumbs aria-label="breadcrumb" sx={{ my: 1 }}>
        <Link color="inherit" underline="hover" href="/">Top</Link>
        <Typography color="textPrimary">装飾品一覧</Typography>
      </Breadcrumbs>
      <Box sx={{ my: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom textAlign="center">
          装飾品一覧
        </Typography>
        <TableContainer component={Paper} sx={{ my: 2 }} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell component="th">名称</TableCell>
                <TableCell component="th">サイズ</TableCell>
                <TableCell component="th">スキル</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {decos.map(({ name, size, skill: [skillName, skillPoint] }) =>
                <TableRow key={name}>
                  <TableCell>
                    <Link href={`/decos/${name}`} noWrap>
                      {name}
                    </Link>
                  </TableCell>
                  <TableCell>{size}</TableCell>
                  <TableCell>
                    <Link href={`/skills/${skillName}`} noWrap>
                      {skillName}
                    </Link>
                    {` ${skillPoint}pt`}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  )
}
