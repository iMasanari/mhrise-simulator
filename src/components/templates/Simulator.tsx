import { Box, Button } from '@material-ui/core'
import React, { useState } from 'react'
import { ActiveSkill, SkillSystem } from '../../domain/skill'
import { WeaponSlot } from '../../domain/weapon'
import { useSimulator } from '../../hooks/simulatorHooks'
import DevelopWarning from '../molecules/DevelopWarning'
import ResultEquip from '../molecules/ResultEquip'
import SimulateCondition from '../organisms/SimulateCondition'

interface Props {
  skills: SkillSystem[]
}

export default function Simulator({ skills }: Props) {
  const [activeSkill, setActiveSkill] = useState<ActiveSkill>({})
  const [weaponSlot, setWeaponSlot] = useState<WeaponSlot>([0, 0, 0])
  const { loading, result, simulate } = useSimulator()

  const execute = () =>
    simulate(activeSkill as Record<string, number>)

  return (
    <Box sx={{ my: 4 }}>
      <DevelopWarning />
      <SimulateCondition
        skills={skills}
        activeSkill={activeSkill}
        setActiveSkill={setActiveSkill}
        weaponSlot={weaponSlot}
        setWeaponSlot={setWeaponSlot}
      />
      <Button onClick={execute}>実行</Button>
      {result.map((equip, i) =>
        <ResultEquip key={i} result={equip} />
      )}
      <div>{loading && '検索中...'}</div>
    </Box>
  )
}
