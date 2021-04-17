import { List } from '@material-ui/core'
import React from 'react'
import { ActiveSkill } from '../../domain/skill'
import SkillListItem from './SkillListItem'

interface Props {
  checkbox?: boolean
  skills: { name: string, items: number[] }[]
  activeSkill: ActiveSkill
  setActiveSkill: (fn: (activeSkill: ActiveSkill) => ActiveSkill) => void
}

export default function SkillList({ checkbox, skills, activeSkill, setActiveSkill }: Props) {
  return (
    <List >
      {skills.map(skill =>
        <SkillListItem
          key={skill.name}
          skillName={skill.name}
          checkbox={checkbox}
          items={skill.items}
          value={activeSkill[skill.name]}
          setValue={(value) => setActiveSkill(v => ({ ...v, [skill.name]: value }))}
        />
      )}
    </List>
  )
}
