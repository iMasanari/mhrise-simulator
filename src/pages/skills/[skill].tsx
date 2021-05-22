import { Breadcrumbs, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import * as React from 'react'
import { getDecos } from '../../../scripts/converter/deco'
import { findArmor } from '../../api/armors'
import { firestore } from '../../api/firebase'
import { getSkills } from '../../api/skills'
import Link from '../../components/atoms/Link'
import ShareList from '../../components/molecules/ShareList'
import { ActiveSkill } from '../../domain/skill'

type Armor = { name: string, point: number } | null

interface Props {
  skill: {
    name: string;
    category: string;
    details: {
      name: string;
      point: number;
      description: string;
    }[];
  }
  armors: (readonly [string, Armor, Armor, Armor, Armor, Armor])[]
  decos: { name: string, point: number }[]
  shares: { id: string, skills: ActiveSkill }[]
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<Props> = async ctx => {
  const skillName = ctx.params?.skill as string
  const skills = await getSkills()

  const skill = skills.find(v => v.name === skillName)

  if (!skill) throw new Error(`${skillName} is not found`)

  const armors = await findArmor(skill.name)
  const decos = (await getDecos())
    .filter(v => v.skills[skillName] != null)
    .map(v => ({ name: v.name, point: v.skills[skillName] }))


  const collection = await firestore.collection('shares')
    .where('skillList', 'array-contains', skillName)
    .orderBy('createdAt', 'desc')
    .limit(10)
    .get()

  const shares: { id: string, skills: ActiveSkill }[] = []
  collection.forEach(doc => {
    shares.push({ id: doc.id, skills: doc.data().skills })
  })

  return {
    props: { skill, armors, decos, shares },
  }
}

export default function SkillDetailPage({ skill, armors, decos, shares }: Props) {
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
                    <Typography variant="inherit" noWrap>{name}</Typography>
                  </TableCell>
                  <TableCell>
                    {head && (
                      <Link href={`/armors/${head.name}`}>{head.point}pt</Link>
                    )}
                  </TableCell>
                  <TableCell>
                    {body && (
                      <Link href={`/armors/${body.name}`}>{body.point}pt</Link>
                    )}
                  </TableCell>
                  <TableCell>
                    {arm && (
                      <Link href={`/armors/${arm.name}`}>{arm.point}pt</Link>
                    )}
                  </TableCell>
                  <TableCell>
                    {wst && (
                      <Link href={`/armors/${wst.name}`}>{wst.point}pt</Link>
                    )}
                  </TableCell>
                  <TableCell>
                    {leg && (
                      <Link href={`/armors/${leg.name}`}>{leg.point}pt</Link>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="h6" component="h2" gutterBottom>
          装飾品
        </Typography>
        <TableContainer component={Paper} sx={{ my: 2 }} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell component="th">名称</TableCell>
                <TableCell component="th" align="center">ポイント</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {decos.map(deco =>
                <TableRow key={deco.name}>
                  <TableCell>
                    <Link href={`/decos/${deco.name}`} noWrap>{deco.name}</Link>
                  </TableCell>
                  <TableCell align="center">
                    {`${deco.point}pt`}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="h5" component="h2" gutterBottom>
          {'このスキルを使用した装備'}
        </Typography>
        <ShareList shares={shares} />
      </Box>
    </Container>
  )
}
