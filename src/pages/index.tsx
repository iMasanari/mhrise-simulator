import { InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import skills from '../../generated/skills.json'
import { firestore } from '../api/firebase'
import MetaData from '../components/templates/MetaData'
import Simulator from '../components/templates/Simulator'
import { ActiveSkill, SkillSystem } from '../domain/skill'
import { useCharms } from '../hooks/charmsHooks'
import { useSetMode } from '../hooks/simualtorPageState'
import { useSetSkills, useSetWeaponSlots } from '../hooks/simulatorConditionsHooks'
import { useSimulator } from '../hooks/simulatorHooks'

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
  const setSkills = useSetSkills()
  const setWeaponSlots = useSetWeaponSlots()
  const charms = useCharms()
  const simulator = useSimulator()
  const setMode = useSetMode()
  const router = useRouter()

  useEffect(() => {
    const query = location.search
    if (query.length < 2) return

    const searchParams = new URLSearchParams(query)

    const skills = Object.fromEntries(
      (searchParams.get('skills') || '').split(',')
        .map(v => v.split('Lv'))
        .map(([key, value]) => [key, +value])
    )

    const slots = (searchParams.get('weaponSlots') || '').split(',').map(Number)

    setSkills(skills)
    setWeaponSlots(slots)
    simulator.simulate(skills, slots, charms)
    setMode('result')

    router.replace(location.pathname)

    // eslint-disable-next-line
  }, [])

  const skillList = skills.map(({ name, category, details }): SkillSystem => ({
    name,
    category,
    items: details.map(v => v.point),
  }))

  return (
    <>
      <MetaData
        title="MHRise スキルシミュ"
        description="「モンスターハンター Rise」のスキルシミュレーターです。発動したいスキルが発動する防具や装飾品の組み合わせを検索します。"
      />
      <Simulator skills={skillList} shares={shares} />
    </>
  )
}
