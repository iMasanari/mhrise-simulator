import { Breadcrumbs, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import React from 'react'
import { getSeries } from '../../api/armors'
import { firestore } from '../../api/firebase'
import Link from '../../components/atoms/Link'
import ShareList from '../../components/molecules/ShareList'
import { Armor } from '../../domain/equips'
import { ActiveSkill } from '../../domain/skill'

interface Props {
  armor: Armor
  shares: { id: string, skills: ActiveSkill }[]
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const armorName = ctx.params?.armor
  const seriesList = await getSeries()

  const series = seriesList.find(v =>
    [v.head, v.body, v.arm, v.wst, v.leg].filter(Boolean).some(armor => armor?.name === armorName)
  )

  if (!series) {
    return { notFound: true }
  }

  const armors = [series.head, series.body, series.arm, series.wst, series.leg]
  const armorIndex = armors.findIndex(armor => armor?.name === armorName)!
  const armor = armors[armorIndex]!
  const armorType = ['head', 'body', 'arm', 'wst', 'leg'][armorIndex]

  const collection = await firestore.collection('shares')
    .where(armorType, '==', armor.name)
    .orderBy('createdAt', 'desc')
    .limit(10)
    .get()

  const shares: { id: string, skills: ActiveSkill }[] = []
  collection.forEach(doc => {
    shares.push({ id: doc.id, skills: doc.data().skills })
  })

  return {
    props: { armor, shares },
    revalidate: 15 * 60, // 15分
  }
}

export default function SkillDetailPage({ armor, shares }: Props) {
  const skills = Object.entries(armor.skills)
    .map(([name, point]) => ({ name, point }))
    .sort((a, b) => b.point - a.point)

  return (
    <Container maxWidth="md">
      <Head>
        <title>{armor.name} | MHRise スキルシミュ</title>
      </Head>
      <Breadcrumbs aria-label="breadcrumb" sx={{ my: 1 }}>
        <Link color="inherit" href="/">Top</Link>
        <Link color="inherit" href="/armors">防具一覧</Link>
        <Typography color="textPrimary">{armor.name}</Typography>
      </Breadcrumbs>
      <Box sx={{ my: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom textAlign="center">
          {armor.name}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" gutterBottom>
              基本データ
            </Typography>
            <TableContainer component={Paper} sx={{ my: 2 }} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell component="th" align="center" rowSpan={2}>スロット</TableCell>
                    <TableCell component="th" align="center" colSpan={2}>防御</TableCell>
                    <TableCell component="th" align="center" colSpan={5}>属性耐性</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" align="center">初期</TableCell>
                    <TableCell component="th" align="center">強化</TableCell>
                    <TableCell component="th" align="center">火</TableCell>
                    <TableCell component="th" align="center">水</TableCell>
                    <TableCell component="th" align="center">雷</TableCell>
                    <TableCell component="th" align="center">氷</TableCell>
                    <TableCell component="th" align="center">龍</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={armor.name}>
                    <TableCell align="center">{armor.slots.filter(Boolean).map(v => `【${v}】`).join('') || 'なし'}</TableCell>
                    <TableCell align="center">{armor.defs[0]}</TableCell>
                    <TableCell align="center">{armor.defs[1]}</TableCell>
                    <TableCell align="center">{armor.elements[0] || null}</TableCell>
                    <TableCell align="center">{armor.elements[1] || null}</TableCell>
                    <TableCell align="center">{armor.elements[2] || null}</TableCell>
                    <TableCell align="center">{armor.elements[3] || null}</TableCell>
                    <TableCell align="center">{armor.elements[4] || null}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" component="h2" gutterBottom>
              スキル効果
            </Typography>
            <TableContainer component={Paper} sx={{ my: 2 }} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell component="th">スキル</TableCell>
                    <TableCell component="th" align="center">ポイント</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {skills.map(skill =>
                    <TableRow key={skill.name}>
                      <TableCell>
                        <Link href={`/skills/${skill.name}`} noWrap>{skill.name}</Link>
                      </TableCell>
                      <TableCell align="center">{`${skill.point}pt`}</TableCell>
                    </TableRow>
                  )}
                  {!skills.length && (
                    <TableRow>
                      <TableCell colSpan={2}>
                        <Typography variant="inherit">スキルなし</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" component="h2" gutterBottom>
              必要素材
            </Typography>
            <TableContainer component={Paper} sx={{ my: 2 }} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell component="th">素材</TableCell>
                    <TableCell component="th" align="center">個数</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(armor.materials).map(([key, value]) =>
                    <TableRow key={key}>
                      <TableCell>
                        <Typography variant="inherit" noWrap>{key}</Typography>
                      </TableCell>
                      <TableCell align="center">{value}</TableCell>
                    </TableRow>
                  )}
                  {!Object.keys(armor.materials).length && (
                    <TableRow>
                      <TableCell colSpan={2}>
                        <Typography variant="inherit">データがありません。</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" component="h2" gutterBottom>
              {'この防具を使用した装備'}
            </Typography>
            <ShareList shares={shares} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
