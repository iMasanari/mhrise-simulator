import { Button, List, ListItem, ListItemSecondaryAction, ListItemText, ListSubheader, Select } from '@material-ui/core'
import React, { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { ActiveSkill, SkillSystem } from '../../../domain/skill'
import { WeaponSlot } from '../../../domain/weapon'
import { useSkillLog, useUpdateSkillLog } from '../../../hooks/skillLogHooks'
import SkillDialog from '../skillDialog/SkillDialog'
import ActiveSkillListItem from './ActiveSkillListItem'
import WeaponSlotSelect from './WeaponSlotSelect'

interface Props {
  skills: SkillSystem[]
  activeSkill: ActiveSkill
  setActiveSkill: Dispatch<SetStateAction<ActiveSkill>>
  weaponSlot: WeaponSlot
  setWeaponSlot: Dispatch<SetStateAction<WeaponSlot>>
}

export default function SimulatorCondition({ skills, activeSkill, setActiveSkill, weaponSlot, setWeaponSlot }: Props) {
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
    orderedSkills.filter(skill => activeSkill[skill.name] != null),
    [activeSkill, orderedSkills]
  )

  const handleOpen = () => {
    setSkillOpen(true)
    updateSkillLog(activeSkill)
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
          <WeaponSlotSelect weaponSlot={weaponSlot} setWeaponSlot={setWeaponSlot} />
        </ListItem>
      </List>
      <List subheader={<ListSubheader disableSticky>スキル</ListSubheader>}>
        {activeSkillList.map(skill =>
          <ActiveSkillListItem
            key={skill.name}
            skillName={skill.name}
            items={skill.items}
            value={activeSkill[skill.name]}
            setValue={(value) => setActiveSkill(v => ({ ...v, [skill.name]: value }))}
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
      {skillOpen &&
        <SkillDialog
          open
          skills={orderedSkills}
          activeSkill={activeSkill}
          onClose={handleClose}
        />
      }
    </div>
  )
}
