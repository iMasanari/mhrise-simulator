import { css, Theme } from '@emotion/react'
import { Box, Breadcrumbs, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import { GetStaticPaths, GetStaticProps } from 'next'
import React, { useMemo } from 'react'
import { getArm, getBody, getHead, getLeg, getWst } from '../../api/armors'
import { getDecoInfo } from '../../api/decos'
import { firestore } from '../../api/firebase'
import Link from '../../components/atoms/Link'
import ResultEquip from '../../components/molecules/ResultEquip'
import ResultSkills from '../../components/molecules/ResultSkills'
import MetaData from '../../components/templates/MetaData'
import { Deco, Equip, toEquip } from '../../domain/equips'

interface Props {
  equip: Equip
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const shareId = ctx.params?.shareId as string
  const doc = await firestore.collection('shares').doc(shareId).get()

  if (!doc.exists) {
    return { notFound: true }
  }

  const data = doc.data()!

  const equip = toEquip({
    weaponSlots: data.weaponSlots,
    head: await getHead(data.head),
    body: await getBody(data.body),
    arm: await getArm(data.arm),
    wst: await getWst(data.wst),
    leg: await getLeg(data.leg),
    charm: data.charm,
    decos: await Promise.all(data.decos.map(getDecoInfo)) as Deco[],
  })

  return {
    props: { equip },
    revalidate: 24 * 60 * 60, // 24時間
  }
}

const materialsTotalStyle = (theme: Theme) => css`
  column-count: 2;
  ${theme.breakpoints.up('sm')} {
    column-count: 3;
  }
`

export default function Shares({ equip }: Props) {
  const skillParam = Object.entries(equip.skills)
    .sort(([, a], [, b]) => b - a)
    .map(([k, v]) => `${k}Lv${v}`)
    .join(',')

  const slotsParam = equip.weaponSlots.join(',')

  const simulatorUrl = `/?skills=${skillParam}&weaponSlots=${slotsParam}`

  const params = {
    weaponSlots: equip.weaponSlots,
    head: equip.head?.name || '',
    body: equip.body?.name || '',
    arm: equip.arm?.name || '',
    wst: equip.wst?.name || '',
    leg: equip.leg?.name || '',
    charmSkills: Object.entries(equip.charm?.skills || {}).map(([k, v]) => `${k}Lv${v}`).join(','),
    charmSlots: equip.charm?.slots.join(',') || '',
    skills: skillParam,
  }

  const ogImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/og-images?${Object.entries(params).map(([key, value]) => `${key}=${value}`).join('&')}`

  const materialEquipList = useMemo(() => {
    const armors = [equip.head, equip.body, equip.arm, equip.wst, equip.leg]
      .filter(Boolean as unknown as <T>(v: T) => v is NonNullable<T>)

    const decos = [...new Set(equip.decos.map(deco => deco.name))].map(name => {
      const list = equip.decos.filter(deco => deco.name === name)

      return { deco: list[0], amount: list.length }
    })

    return [
      ...armors.map(v => ({ name: v.name, href: `/armors/${v.name}`, materials: v.materials, amount: 1 })),
      ...decos.map(({ deco, amount }) => ({ name: deco.name, href: `/decos/${deco.name}`, materials: deco.materials, amount })),
    ]
  }, [equip])

  const materialList = useMemo(() => {
    const materials = materialEquipList.reduce((acc, v) => {
      for (const [material, amount] of Object.entries(v.materials)) {
        acc[material] = (acc[material] || 0) + amount * v.amount
      }
      return acc
    }, {} as Record<string, number>)

    return Object.entries(materials).sort(([a], [b]) => {
      const aIsStorn = a.includes('原珠')
      const bIsStorn = b.includes('原珠')

      return aIsStorn === bIsStorn ? (a > b ? 1 : -1) : (aIsStorn ? 1 : -1)
    })
  }, [materialEquipList])

  return (
    <Container maxWidth="md">
      <MetaData
        title="装備共有 | MHRise スキルシミュ"
        description="MHRise スキルシミュで検索・共有された装備です。"
        image={ogImageUrl}
        twitterCard="summary_large_image"
      />
      <Breadcrumbs aria-label="breadcrumb" sx={{ my: 1 }}>
        <Link color="inherit" href="/">Top</Link>
        <Typography color="textPrimary">装備共有</Typography>
      </Breadcrumbs>
      <Box sx={{ my: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom textAlign="center">
          {'装備共有'}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <ResultEquip equip={equip} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: [1, 2] }}>
              <ResultSkills equip={equip} />
            </Box>
          </Grid>
        </Grid>
        <Box position="sticky" bottom={0} py={1} bgcolor="background.paper">
          <Button variant="contained" component={Link} href={simulatorUrl} fullWidth>
            この装備の条件で検索する
          </Button>
        </Box>
        <Typography variant="h6" component="h2" gutterBottom>
          必要素材
        </Typography>
        <TableContainer component={Paper} sx={{ my: 2 }} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell component="th">名称</TableCell>
                <TableCell component="th">素材</TableCell>
                <TableCell component="th" align="center">装備数</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {materialEquipList.map((equip) =>
                <TableRow key={equip.name}>
                  <TableCell>
                    <Link href={equip.href} >{equip.name}</Link>
                  </TableCell>
                  <TableCell>
                    {Object.entries(equip.materials).map(([key, value]) =>
                      <div key={key}>{`${key} x${value}`}</div>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {equip.amount}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography component="div" gutterBottom variant="body2">
                    合計
                  </Typography>
                  <div css={materialsTotalStyle}>
                    {materialList.map(([key, value]) =>
                      <div key={key}>{`${key} x${value}`}</div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  )
}
