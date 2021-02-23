import { Alert, AlertTitle, Box, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import { ActiveSkill, SkillSystem } from '../../domain/skill'
import { WeaponSlot } from '../../domain/weapon'
import SimulateCondition from '../organisms/SimulateCondition'

interface Props {
  skills: SkillSystem[]
}

export default function Simulator({ skills }: Props) {
  const [activeSkill, setActiveSkill] = useState<ActiveSkill>({})
  const [weaponSlot, setWeaponSlot] = useState<WeaponSlot>([0, 0, 0])

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        MHRise スキルシミュ
      </Typography>
      <Alert severity="warning">
        <AlertTitle>データはMHRise製品版とは異なります</AlertTitle>
        MHRiseのデータ判明まで、過去作のデータを使用して開発します。ご了承ください。
      </Alert>
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
