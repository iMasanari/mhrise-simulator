import Container from '@material-ui/core/Container'
import Head from 'next/head'
import React from 'react'
import skills from '../../generated/skills.json'
import Simulator from '../components/templates/Simulator'
import { SkillSystem } from '../domain/skill'

export default function TopPage() {
  const skillList = skills.map(({ name, category, details }): SkillSystem => ({
    name,
    category,
    items: details.map(v => v.point),
  }))
  return (
    <Container maxWidth="md">
      <Head>
        <title>MHRise スキルシミュ</title>
      </Head>
      <Simulator skills={skillList} />
    </Container>
  )
}
