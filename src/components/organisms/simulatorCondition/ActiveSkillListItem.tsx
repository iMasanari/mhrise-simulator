import { ListItem, ListItemText, Select } from '@material-ui/core'
import React from 'react'
import SkillLevel from '../../molecules/SkillLevel'

interface Props {
  name: string
  items: number[]
  value: number
  setValue: (value: number) => void
}

export default function ActiveSkillListItem({ name, items, value, setValue }: Props) {
  const subActionHandler = (e: React.ChangeEvent<{ value: string | number }>) =>
    setValue(+e.currentTarget.value)

  return (
    <ListItem>
      <ListItemText
        primary={name}
        secondary={<SkillLevel value={value} items={items} update={setValue} />}
        secondaryTypographyProps={{ component: 'div' }}
      />
      <Select value={value || 0} onChange={subActionHandler} size="small" native>
        <option value={0} />
        {items.map(level =>
          <option key={level} value={level}>{`LV ${level}`}</option>
        )}
      </Select>
    </ListItem>
  )
}
