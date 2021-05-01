import { Breadcrumbs, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import { InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import * as React from 'react'
import { getSkills } from '../../api/skills'
import Link from '../../components/atoms/Link'
import DevelopWarning from '../../components/molecules/DevelopWarning'
import SkillLevel from '../../components/molecules/SkillLevel'

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticProps = async () => {
  const skills = await getSkills()
  const categories = [...new Set(skills.map(v => v.category))]

  const categorySkills = categories.map(category => ({
    category,
    skills: skills
      .filter(v => v.category === category)
      .map(v => ({
        name: v.name,
        points: v.details.map(d => d.point),
        max: v.details[v.details.length - 1].description,
      })),
  }))

  return {
    props: { categorySkills },
  }
}

export default function SkillsPage({ categorySkills }: Props) {
  return (
    <Container maxWidth="md">
      <Head>
        <title>スキル一覧 | MHRise スキルシミュ</title>
      </Head>
      <Breadcrumbs aria-label="breadcrumb" sx={{ my: 1 }}>
        <Link color="inherit" href="/">Top</Link>
        <Typography color="textPrimary">スキル一覧</Typography>
      </Breadcrumbs>
      <Box sx={{ my: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom textAlign="center">
          スキル一覧
        </Typography>
        <DevelopWarning />
        {categorySkills.map(({ category, skills }) =>
          <div key={category}>
            <Typography variant="h6" component="h2" gutterBottom>
              {category}
            </Typography>
            <TableContainer component={Paper} sx={{ my: 2 }} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell component="th">スキル</TableCell>
                    <TableCell component="th">LV最大時効果</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {skills.map(skill =>
                    <TableRow key={skill.name}>
                      <TableCell>
                        <Link href={`/skills/${skill.name}`} noWrap>
                          {skill.name}
                        </Link>
                        <SkillLevel items={skill.points} />
                      </TableCell>
                      <TableCell>
                        {skill.max}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </Box>
    </Container>
  )
}