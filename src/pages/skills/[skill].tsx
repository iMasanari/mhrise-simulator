import { Box, Breadcrumbs, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { GetStaticPaths, GetStaticProps } from 'next'
import * as React from 'react'
import { findArmor, getArm, getBody, getHead, getLeg, getWst } from '../../api/armors'
import { getDecos } from '../../api/decos'
import { firestore } from '../../api/firebase'
import { getSkills } from '../../api/skills'
import Link from '../../components/atoms/Link'
import ShareList, { Share } from '../../components/molecules/ShareList'
import MetaData from '../../components/templates/MetaData'

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
  shares: Share[]
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

  if (!skill) {
    return { notFound: true }
  }

  const armors = await findArmor(skill.name)
  const decos = (await getDecos())
    .filter(v => v.skills[skillName] != null)
    .map(v => ({ name: v.name, point: v.skills[skillName] }))

  const collection = await firestore.collection('shares')
    .where('skillList', 'array-contains', skillName)
    .orderBy('createdAt', 'desc')
    .limit(10)
    .get()

  const list: any[] = []
  collection.forEach(v => list.push({ id: v.id, ...v.data() }))

  const shares: Share[] = await Promise.all(
    list.map(async ({ id, head, body, arm, wst, leg, skills }) => ({
      id: id,
      head: (await getHead(head))?.series || head,
      body: (await getBody(body))?.series || body,
      arm: (await getArm(arm))?.series || arm,
      wst: (await getWst(wst))?.series || wst,
      leg: (await getLeg(leg))?.series || leg,
      skills,
    }))
  )

  return {
    props: { skill, armors, decos, shares },
  }
}

export default function SkillDetailPage({ skill, armors, decos, shares }: Props) {
  return (
    <Container maxWidth="md">
      <MetaData
        title={`${skill.name} | MHRise ??????????????????`}
        description={`????????????${skill.name}??????????????????????????????????????????????????????????????????????????????`}
      />
      <Breadcrumbs aria-label="breadcrumb" sx={{ my: 1 }}>
        <Link color="inherit" underline="hover" href="/">Top</Link>
        <Link color="inherit" underline="hover" href="/skills">???????????????</Link>
        <Typography color="textPrimary">{skill.name}</Typography>
      </Breadcrumbs>
      <Box sx={{ my: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom textAlign="center">
          {skill.name}
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom>
          ???????????????
        </Typography>
        <TableContainer component={Paper} sx={{ my: 2 }} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell component="th" colSpan={2}>?????????????????? / ?????????</TableCell>
                <TableCell component="th">??????</TableCell>
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
          ??????
        </Typography>
        <TableContainer component={Paper} sx={{ my: 2 }} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell component="th">??????</TableCell>
                <TableCell component="th">???</TableCell>
                <TableCell component="th">???</TableCell>
                <TableCell component="th">???</TableCell>
                <TableCell component="th">???</TableCell>
                <TableCell component="th">???</TableCell>
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
          ?????????
        </Typography>
        <TableContainer component={Paper} sx={{ my: 2 }} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell component="th">??????</TableCell>
                <TableCell component="th" align="center">????????????</TableCell>
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
          ????????????????????????????????????
        </Typography>
        <ShareList shares={shares} />
      </Box>
    </Container>
  )
}
