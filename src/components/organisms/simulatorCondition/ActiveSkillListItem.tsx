import { ListItem, ListItemText } from '@material-ui/core'
import React from 'react'
import SkillLevel from '../../molecules/SkillLevel'
import SkillLevelSelect from '../../molecules/SkillLevelSelect'

interface Props {
  name: string
  items: number[]
  value: number
  setValue: (value: number) => void
}

export default function ActiveSkillListItem({ name, items, value, setValue }: Props) {
  return (
    <ListItem>
      <ListItemText
        primary={name}
        secondary={<SkillLevel value={value} items={items} update={setValue} />}
        secondaryTypographyProps={{ component: 'div' }}
      />
      <SkillLevelSelect value={value} items={items} setValue={setValue} />
    </ListItem>
  )
}
