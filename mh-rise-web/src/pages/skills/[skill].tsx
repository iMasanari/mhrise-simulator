import { Breadcrumbs, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import * as React from 'react'
import { getSkills } from '../../api/skills'
import Link from '../../components/atoms/Link'

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticPaths: GetStaticPaths = async () => {
  const skills = await getSkills()
  const paths = skills.map(v => ({
    params: { skill: v.name },
  }))

  return { paths, fallback: false }
}

export const getStaticProps = async (ctx: GetStaticPropsContext) => {
  const skillName = ctx.params?.skill
  const skills = await getSkills()

  const skill = skills.find(v => v.name === skillName)

  if (!skill) throw new Error(`${skillName} is not found`)

  return {
    props: { skill },
  }
}

export default function SkillDetailPage({ skill }: Props) {
  return (
    <Container>
      <Head>
        <title>スキル一覧 | MHRise スキルシミュ</title>
      </Head>
      <Breadcrumbs aria-label="breadcrumb" sx={{ my: 1 }}>
        <Link color="inherit" href="/">Top</Link>
        <Link color="inherit" href="/skills">スキル一覧</Link>
        <Typography color="textPrimary">{skill.name}</Typography>
      </Breadcrumbs>
      <Box sx={{ my: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom textAlign="center">
          {skill.name}
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom>
          スキル効果
        </Typography>
        <Container maxWidth="md" disableGutters>
          <TableContainer component={Paper} sx={{ my: 2 }} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell component="th">スキル</TableCell>
                  <TableCell component="th" align="center">発動ポイント</TableCell>
                  <TableCell component="th">効果</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {skill.details.map(detail =>
                  <TableRow key={detail.name}>
                    <TableCell>
                      {detail.name}
                    </TableCell>
                    <TableCell align="center">
                      {detail.point}
                    </TableCell>
                    <TableCell>
                      {detail.description}
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
