import { Box, Breadcrumbs, Button, Grid, Paper, TableContainer, Typography } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import { GetStaticPaths, GetStaticProps } from 'next'
import React from 'react'
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

export default function Shares({ equip }: Props) {
  const skillParam = Object.entries(equip.skills).map(([k, v]) => `${k}Lv${v}`).sort().join(',')
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
    decos: equip.decos.map(v => v.name).join(','),
    skills: skillParam,
  }

  const ogImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/og-images?${Object.entries(params).map(([key, value]) => `${key}=${value}`).join('&')}`

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
        <Button component={Link} href={simulatorUrl} fullWidth sx={{ my: 2 }}>
          {'この装備の条件で検索する'}
        </Button>
      </Box>
    </Container>
  )
}
