import { Container } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import skills from '../../generated/skills.json'
import MetaData from '../components/templates/MetaData'
import Simulator from '../components/templates/Simulator'
import { SkillSystem } from '../domain/skill'
import { useCharms } from '../hooks/charmsHooks'
import { useDecoLimits } from '../hooks/decoLimits'
import { useIgnoreArmors } from '../hooks/ignoreArmors'
import { useSetMode } from '../hooks/simualtorPageState'
import { useSetSkills, useSetWeaponSlots } from '../hooks/simulatorConditionsHooks'
import { useSimulator } from '../hooks/simulatorHooks'

export default function TopPage() {
  const setSkills = useSetSkills()
  const setWeaponSlots = useSetWeaponSlots()
  const charms = useCharms()
  const ignore = useIgnoreArmors()
  const decoLimits = useDecoLimits()
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

    const weaponSlots = (searchParams.get('weaponSlots') || '').split(',').map(Number)

    setSkills(skills)
    setWeaponSlots(weaponSlots)

    simulator.simulate({
      skills,
      weaponSlots,
      charms,
      ignore: Object.keys(ignore),
      decoLimits,
    })

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
    <Container maxWidth="md">
      <MetaData
        title="MHRise スキルシミュ"
        description="「モンスターハンター Rise」のスキルシミュレーターです。発動したいスキルが発動する防具や装飾品の組み合わせを検索します。"
      />
      <Simulator skills={skillList} />
    </Container>
  )
}
