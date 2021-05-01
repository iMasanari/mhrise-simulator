import Container from '@material-ui/core/Container'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import * as React from 'react'
import { getSkillSystems } from '../api/skills'
import Simulator from '../components/templates/Simulator'
import { SkillSystem } from '../domain/skill'

interface Props {
  skills: SkillSystem[]
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const skills = await getSkillSystems()

  return {
    props: { skills },
  }
}

export default function TopPage({ skills }: Props) {
  return (
    <Container maxWidth="md">
      <Head>
        <title>MHRise スキルシミュ</title>
      </Head>
      <Simulator skills={skills} />
    </Container>
  )
}
