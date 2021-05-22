import Container from '@material-ui/core/Container'
import { InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import React from 'react'
import skills from '../../generated/skills.json'
import { firestore } from '../api/firebase'
import MetaData from '../components/templates/MetaData'
import Simulator from '../components/templates/Simulator'
import { ActiveSkill, SkillSystem } from '../domain/skill'

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticProps = async () => {
  const collection = await firestore.collection('shares').orderBy('createdAt', 'desc').limit(10).get()

  const shares: { id: string, skills: ActiveSkill }[] = []
  collection.forEach(doc => {
    shares.push({ id: doc.id, skills: doc.data().skills })
  })

  return {
    props: { shares },
    revalidate: 15 * 60, // 15分
  }
}

export default function TopPage({ shares }: Props) {
  const skillList = skills.map(({ name, category, details }): SkillSystem => ({
    name,
    category,
    items: details.map(v => v.point),
  }))
  return (
    <Container maxWidth="md">
      <MetaData
        title="MHRise スキルシミュ"
        description="「モンスターハンター Rise」のスキルシミュレーターです。発動したいスキルが発動する防具や装飾品の組み合わせを検索します。"
      />
      <Simulator skills={skillList} shares={shares} />
    </Container>
  )
}
