import { Box, Breadcrumbs, Button, Paper, TableContainer, Typography } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import React from 'react'
import { getArm, getBody, getHead, getLeg, getWst } from '../../api/armors'
import { getDecoInfo } from '../../api/decos'
import { firestore } from '../../api/firebase'
import Link from '../../components/atoms/Link'
import ResultEquip from '../../components/molecules/ResultEquip'
import { Deco, Equip } from '../../domain/equips'

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps = async (ctx: GetStaticPropsContext) => {
  const shareId = ctx.params?.shareId as string
  const doc = await firestore.collection('shares').doc(shareId).get()

  if (!doc.exists) throw new Error(`${shareId} is not found`)

  const data = doc.data()!

  const equip: Equip = {
    weaponSlot: data.weaponSlots,
    head: await getHead(data.head),
    body: await getBody(data.body),
    arm: await getArm(data.arm),
    wst: await getWst(data.wst),
    leg: await getLeg(data.leg),
    charm: data.charm,
    decos: await Promise.all(data.decos.map(getDecoInfo)) as Deco[],
    def: 0,
    skills: data.skills,
  }

  return {
    props: { equip },
    revalidate: 24 * 60 * 60, // 24時間
  }
}

export default function Shares({ equip }: Props) {
  const skillParam = Object.entries(equip.skills).map(([k, v]) => `${k}Lv${v}`).join(',')
  const slotsParam = equip.weaponSlot.join(',')

  const simulatorUrl = `/?skills=${skillParam}&weaponSlots=${slotsParam}`

  return (
    <Container maxWidth="md">
      <Head>
        <title>装備共有 | MHRise スキルシミュ</title>
      </Head>
      <Breadcrumbs aria-label="breadcrumb" sx={{ my: 1 }}>
        <Link color="inherit" href="/">Top</Link>
        <Typography color="textPrimary">装備共有</Typography>
      </Breadcrumbs>
      <Box sx={{ my: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom textAlign="center">
          {'装備共有'}
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <ResultEquip equip={equip} />
        </TableContainer>
        <Button component={Link} href={simulatorUrl} fullWidth sx={{ my: 2 }}>
          {'この装備の条件で検索する'}
        </Button>
      </Box>
    </Container>
  )
}