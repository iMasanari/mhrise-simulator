import { Box, Button, List, ListItem, ListItemText, ListSubheader } from '@mui/material'
import React, { useMemo, useState } from 'react'
import { ActiveSkill, SkillSystem } from '../../../domain/skill'
import { useAddableSkillsSimulator } from '../../../hooks/addableSkillsSimulator'
import { useCharms } from '../../../hooks/charmsHooks'
import { useSetMode } from '../../../hooks/simualtorPageState'
import { useAddSkills, useSetSkills, useSetWeaponSlots, useSimulatorConditons } from '../../../hooks/simulatorConditionsHooks'
import { useSimulator } from '../../../hooks/simulatorHooks'
import { useSkillLog, useUpdateSkillLog } from '../../../hooks/skillLogHooks'
import SlotSelect from '../../molecules/SlotSelect'
import SkillDialog from '../skillDialog/SkillDialog'
import ActiveSkillListItem from './ActiveSkillListItem'

interface Props {
  skills: SkillSystem[]
}

export default function SimulatorCondition({ skills }: Props) {
  const conditions = useSimulatorConditons()
  const setWeaponSlots = useSetWeaponSlots()
  const setActiveSkill = useSetSkills()
  const addSkill = useAddSkills()
  const [skillOpen, setSkillOpen] = useState(false)

  const skillLog = useSkillLog()
  const updateSkillLog = useUpdateSkillLog()

  const orderedSkills = useMemo(() => {
    const logSet = new Set(skillLog)
    const skillMap = new Map(skills.map(v => [v.name, v]))

    return [
      ...skillLog.map(v => skillMap.get(v)!),
      ...skills.filter(v => !logSet.has(v.name)),
    ]
  }, [skillLog, skills])

  const activeSkillList = useMemo(() =>
    orderedSkills.filter(skill => conditions.skills[skill.name] != null),
    [conditions, orderedSkills]
  )
  const { simulate } = useSimulator()
  const { searchAddableSkills } = useAddableSkillsSimulator()
  const charms = useCharms()
  const setMode = useSetMode()

  const execute = () => {
    setMode('result')
    simulate(conditions.skills, conditions.weaponSlots, charms)
    updateSkillLog(conditions.skills)
  }

  const addableSkill = () => {
    setMode('addableSkill')
    searchAddableSkills(conditions.skills, conditions.weaponSlots, charms)
    updateSkillLog(conditions.skills)
  }

  const handleOpen = () => {
    setSkillOpen(true)
    updateSkillLog(conditions.skills)
  }

  const handleClose = (activeSkill: ActiveSkill) => {
    const value = Object.fromEntries(
      Object.entries(activeSkill).filter(([_, value]) => value)
    )

    setSkillOpen(false)
    setActiveSkill(value)
    updateSkillLog(value)
  }

  return (
    <div>
      <List subheader={<ListSubheader disableSticky>武器</ListSubheader>}>
        <ListItem>
          <ListItemText primary="武器スロット" />
          <SlotSelect slot={conditions.weaponSlots} setSlot={setWeaponSlots} />
        </ListItem>
      </List>
      <List subheader={<ListSubheader disableSticky>スキル</ListSubheader>}>
        {activeSkillList.map(skill =>
          <ActiveSkillListItem
            key={skill.name}
            name={skill.name}
            items={skill.items}
            value={conditions.skills[skill.name]}
            setValue={(value) => addSkill(skill.name, value)}
          />
        )}
        {!activeSkillList.length && (
          <ListItem>
            <ListItemText primary="スキルが選択されていません" sx={{ textAlign: 'center' }} />
          </ListItem>
        )}
        <ListItem>
          <Button onClick={handleOpen} fullWidth>
            スキル追加
          </Button>
        </ListItem>
      </List>
      <Box display="flex" mx={2}>
        <Button onClick={execute} variant="contained" sx={{ flex: '1', mr: 1 }}>検索</Button>
        <Button onClick={addableSkill} variant="outlined">追加スキル検索</Button>
      </Box>
      {skillOpen &&
        <SkillDialog
          open
          skills={orderedSkills}
          activeSkill={conditions.skills}
          onClose={handleClose}
        />
      }
    </div>
  )
}
