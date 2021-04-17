import { Button, List, ListItem, ListItemSecondaryAction, ListItemText, ListSubheader, Select } from '@material-ui/core'
import React, { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { ActiveSkill, SkillSystem } from '../../domain/skill'
import { WeaponSlot } from '../../domain/weapon'
import { useSkillLog, useUpdateSkillLog } from '../../hooks/skillLog'
import SkillListItem from '../molecules/SkillListItem'
import SkillDialog from './SkillDialog'

interface Props {
  skills: SkillSystem[]
  activeSkill: ActiveSkill
  setActiveSkill: Dispatch<SetStateAction<ActiveSkill>>
  weaponSlot: WeaponSlot
  setWeaponSlot: Dispatch<SetStateAction<WeaponSlot>>
}

export default function SimulateCondition({ skills, activeSkill, setActiveSkill, weaponSlot, setWeaponSlot }: Props) {
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

  const setWeaponSlotValue = (e: React.ChangeEvent<{ value: string }>) =>
    setWeaponSlot(e.currentTarget.value.split('-').map(Number) as WeaponSlot)

  const handleOpen = () =>
    setSkillOpen(true)

  const handleClose = (activeSkill: ActiveSkill) => {
    const value = Object.fromEntries(
      Object.entries(activeSkill).filter(([_, value]) => value)
    )

    setSkillOpen(false)
    setActiveSkill(value)
    updateSkillLog(value)
  }

  return (
    <>
      <List subheader={<ListSubheader disableSticky>武器</ListSubheader>}>
        <ListItem>
          <ListItemText primary="武器スロット" />
          <ListItemSecondaryAction>
            <Select native value={weaponSlot.join('-')} onChange={setWeaponSlotValue}>
              <optgroup label="武器スロットなし">
                <option value="0-0-0">なし</option>
              </optgroup>
              <optgroup label="最大Lv1">
                <option value="1-0-0">【1】</option>
                <option value="1-1-0">【1】【1】</option>
                <option value="1-1-1">【1】【1】【1】</option>
              </optgroup>
              <optgroup label="最大Lv2">
                <option value="2-0-0">【2】</option>
                <option value="2-1-0">【2】【1】</option>
                <option value="2-1-1">【2】【1】【1】</option>
                <option value="2-2-0">【2】【2】</option>
                <option value="2-2-1">【2】【2】【1】</option>
                <option value="2-2-2">【2】【2】【2】</option>
              </optgroup>
              <optgroup label="最大Lv3">
                <option value="3-0-0">【3】</option>
                <option value="3-1-0">【3】【1】</option>
                <option value="3-1-1">【3】【1】【1】</option>
                <option value="3-2-0">【3】【2】</option>
                <option value="3-2-1">【3】【2】【1】</option>
                <option value="3-2-2">【3】【2】【2】</option>
                <option value="3-3-0">【3】【3】</option>
                <option value="3-3-1">【3】【3】【1】</option>
                <option value="3-3-2">【3】【3】【2】</option>
                <option value="3-3-3">【3】【3】【3】</option>
              </optgroup>
              <optgroup label="最大Lv4">
                <option value="4-0-0">【4】</option>
                <option value="4-1-0">【4】【1】</option>
                <option value="4-1-1">【4】【1】【1】</option>
                <option value="4-2-0">【4】【2】</option>
                <option value="4-2-1">【4】【2】【1】</option>
                <option value="4-2-2">【4】【2】【2】</option>
                <option value="4-3-0">【4】【3】</option>
                <option value="4-3-1">【4】【3】【1】</option>
                <option value="4-3-2">【4】【3】【2】</option>
                <option value="4-3-3">【4】【3】【3】</option>
                <option value="4-4-0">【4】【4】</option>
                <option value="4-4-1">【4】【4】【1】</option>
                <option value="4-4-2">【4】【4】【2】</option>
                <option value="4-4-3">【4】【4】【3】</option>
                <option value="4-4-4">【4】【4】【4】</option>
              </optgroup>
            </Select>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      <List subheader={<ListSubheader disableSticky>スキル</ListSubheader>}>
        {activeSkillList.map(skill =>
          <SkillListItem
            key={skill.name}
            skillName={skill.name}
            items={skill.items}
            value={activeSkill[skill.name]}
            setValue={(value) => setActiveSkill(v => ({ ...v, [skill.name]: value }))}
          />
        )}
        <ListItem>
          <Button variant="outlined" onClick={handleOpen} fullWidth>
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
    </>
  )
}
