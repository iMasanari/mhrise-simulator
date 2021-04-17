import { Breadcrumbs, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import * as React from 'react'
import { findArmor } from '../../api/armors'
import { getCharms } from '../../api/charms'
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
  const skillName = ctx.params?.skill as string
  const skills = await getSkills()

  const skill = skills.find(v => v.name === skillName)

  if (!skill) throw new Error(`${skillName} is not found`)

  const armors = await findArmor(skill.name)
  const charms = (await getCharms())
    .filter(v => v.charms.some(w => w.skills[skillName] != null))
    .map(v => ({ name: v.name, point: Math.max(...v.charms.map(w => w.skills[skillName])) }))

  return {
    props: { skill, armors, charms },
  }
}

export default function SkillDetailPage({ skill, armors, charms }: Props) {
  return (
    <Container maxWidth="md">
      <Head>
        <title>{skill.name} | MHRise スキルシミュ</title>
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
        <TableContainer component={Paper} sx={{ my: 2 }} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell component="th" colSpan={2}>発動ポイント / スキル</TableCell>
                <TableCell component="th">効果</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {skill.details.map(detail =>
                <TableRow key={detail.name}>
                  <TableCell align="center">
                    {detail.point}pt
                    </TableCell>
                  <TableCell>
                    <Typography variant="inherit" noWrap>{detail.name}</Typography>
                  </TableCell>
                  <TableCell>
                    {detail.description}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="h6" component="h2" gutterBottom>
          防具
        </Typography>
        <TableContainer component={Paper} sx={{ my: 2 }} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell component="th">名称</TableCell>
                <TableCell component="th">頭</TableCell>
                <TableCell component="th">胴</TableCell>
                <TableCell component="th">腕</TableCell>
                <TableCell component="th">腰</TableCell>
                <TableCell component="th">足</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {armors.map(([name, head, body, arm, wst, leg]) =>
                <TableRow key={name}>
                  <TableCell>
                    <Link href={`/armors/${name}`} noWrap>{name}</Link>
                  </TableCell>
                  <TableCell>{head}</TableCell>
                  <TableCell>{body}</TableCell>
                  <TableCell>{arm}</TableCell>
                  <TableCell>{wst}</TableCell>
                  <TableCell>{leg}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="h6" component="h2" gutterBottom>
          護符
        </Typography>
        <TableContainer component={Paper} sx={{ my: 2 }} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell component="th">名称</TableCell>
                <TableCell component="th" align="center">最大ポイント</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {charms.map(charm =>
                <TableRow key={charm.name}>
                  <TableCell>
                    <Link href={`/charms/${charm.name}`} noWrap>{charm.name}</Link>
                  </TableCell>
                  <TableCell align="center">
                    {charm.point}
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
