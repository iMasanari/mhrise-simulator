import { Box } from '@material-ui/core'
import React, { useState } from 'react'
import { ActiveSkill, SkillSystem } from '../../domain/skill'
import { WeaponSlot } from '../../domain/weapon'
import DevelopWarning from '../molecules/DevelopWarning'
import SimulateCondition from '../organisms/SimulateCondition'

interface Props {
  skills: SkillSystem[]
}

export default function Simulator({ skills }: Props) {
  const [activeSkill, setActiveSkill] = useState<ActiveSkill>({})
  const [weaponSlot, setWeaponSlot] = useState<WeaponSlot>([0, 0, 0])

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
    </Box>
  )
}
