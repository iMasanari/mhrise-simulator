import { Box, Breadcrumbs, Container, Typography } from '@mui/material'
import { InferGetStaticPropsType } from 'next'
import { firestore } from '../../api/firebase'
import Link from '../../components/atoms/Link'
import ShareList, { Share } from '../../components/molecules/ShareList'
import MetaData from '../../components/templates/MetaData'

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticProps = async () => {
  const collection = await firestore.collection('shares').orderBy('createdAt', 'desc').limit(10).get()

  const list: any[] = []
  collection.forEach(v => list.push({ id: v.id, ...v.data() }))

  const shares: Share[] = list.map(({ id, head, body, arm, wst, leg, skills }) => ({
    id,
    head,
    body,
    arm,
    wst,
    leg,
    skills,
  }))

  return {
    props: { shares },
    revalidate: 15 * 60, // 15分
  }
}

export default function SkillsPage({ shares }: Props) {
  return (
    <Container maxWidth="md">
      <MetaData
        title="最近共有された装備 | MHRise スキルシミュ"
        description="MHRise スキルシミュでシェアされた装備の一覧です。"
      />
      <Breadcrumbs aria-label="breadcrumb" sx={{ my: 1 }}>
        <Link color="inherit" underline="hover" href="/">Top</Link>
        <Typography color="textPrimary">最近共有された装備</Typography>
      </Breadcrumbs>
      <Box sx={{ my: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom textAlign="center">
          最近共有された装備
        </Typography>
        <ShareList shares={shares} />
      </Box>
    </Container>
  )
}
