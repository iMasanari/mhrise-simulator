import { Box, Breadcrumbs, Paper, TableContainer, Typography } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import React from 'react'
import { getArm, getBody, getHead, getLeg, getWst } from '../../api/armors'
import { firestore } from '../../api/firebase'
import Link from '../../components/atoms/Link'
import ResultEquip from '../../components/molecules/ResultEquip'

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

  const equip = {
    weaponSlot: data.weaponSlots,
    head: await getHead(data.head),
    body: await getBody(data.body),
    arm: await getArm(data.arm),
    wst: await getWst(data.wst),
    leg: await getLeg(data.leg),
    charm: data.charm,
    decos: data.decos,
    def: 0,
    skills: data.skills,
  }

  return {
    props: { equip },
    revalidate: 60,
  }
}

export default function Shares({ equip }: Props) {
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
          装備共有
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <ResultEquip equip={equip} />
        </TableContainer>
      </Box>
    </Container>
  )
}
