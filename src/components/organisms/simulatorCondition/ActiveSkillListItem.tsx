import { css } from '@emotion/react'
import { ListItem, ListItemText, Select } from '@material-ui/core'
import React from 'react'
import SkillLevel from '../../molecules/SkillLevel'

interface Props {
  skillName: string
  items: number[]
  value: number | undefined
  setValue: (value: number | undefined) => void
}

export default function ActiveSkillListItem({ skillName, items, value, setValue }: Props) {
  const subActionHandler = (e: React.ChangeEvent<{ value: string | number }>) =>
    setValue(+e.currentTarget.value)

  return (
    <ListItem>
      <ListItemText
        primary={skillName}
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
