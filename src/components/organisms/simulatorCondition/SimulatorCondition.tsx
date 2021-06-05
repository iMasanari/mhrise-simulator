import { Button, List, ListItem, ListItemText, ListSubheader } from '@material-ui/core'
import React, { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { Slots } from '../../../domain/equips'
import { ActiveSkill, SkillSystem } from '../../../domain/skill'
import { useSkillLog, useUpdateSkillLog } from '../../../hooks/skillLogHooks'
import SlotSelect from '../../molecules/SlotSelect'
import SkillDialog from '../skillDialog/SkillDialog'
import ActiveSkillListItem from './ActiveSkillListItem'

interface Props {
  skills: SkillSystem[]
  activeSkill: ActiveSkill
  setActiveSkill: Dispatch<SetStateAction<ActiveSkill>>
  weaponSlots: Slots
  setWeaponSlots: Dispatch<SetStateAction<Slots>>
}

export default function SimulatorCondition({ skills, activeSkill, setActiveSkill, weaponSlots, setWeaponSlots }: Props) {
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
          <SlotSelect slot={weaponSlots} setSlot={setWeaponSlots} />
        </ListItem>
      </List>
      <List subheader={<ListSubheader disableSticky>スキル</ListSubheader>}>
        {activeSkillList.map(skill =>
          <ActiveSkillListItem
            key={skill.name}
            name={skill.name}
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
