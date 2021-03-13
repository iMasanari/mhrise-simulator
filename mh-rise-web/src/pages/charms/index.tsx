import { Breadcrumbs, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import { InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import React from 'react'
import { getCharms } from '../../api/charms'
import Link from '../../components/atoms/Link'

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticProps = async () => {
  const charms = await getCharms()

  const data = charms.map(v => ({
    name: v.name,
    level: v.charms.length,
    skills: [...new Set(v.charms.flatMap(v => Object.keys(v.skills)))],
  }))

  return {
    props: { charms: data },
  }
}

export default function SkillsPage({ charms }: Props) {
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
          護符一覧
        </Typography>
        <Container maxWidth="md" disableGutters>
          <TableContainer component={Paper} sx={{ my: 2 }} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell component="th">名称</TableCell>
                  <TableCell component="th" align="center">最大強化</TableCell>
                  <TableCell component="th" colSpan={2}>スキル</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {charms.map(charm =>
                  <TableRow key={charm.name}>
                    <TableCell>
                      <Link href={`/charms/${charm.name}`} noWrap>
                        {charm.name}
                      </Link>
                    </TableCell>
                    <TableCell align="center">{charm.level}</TableCell>
                    <TableCell>
                      <Link href={`/skills/${charm.skills[0]}`} noWrap>
                        {charm.skills[0]}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/skills/${charm.skills[1]}`} noWrap>
                        {charm.skills[1]}
                      </Link>
                    </TableCell>
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
