import { css } from '@emotion/react'
import { Checkbox, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, Select } from '@material-ui/core'
import React from 'react'
import SkillLevel from '../molecules/SkillLevel'

interface Props {
  skillName: string
  checkbox?: boolean
  items: number[]
  value: number | undefined
  setValue: (value: number | undefined) => void
}

const listItemIconStyle = css`
  min-width: 0;
`

export default function SkillListItem({ checkbox, skillName, items, value, setValue }: Props) {
  const actionHandler = () =>
    setValue(!value ? items[items.length - 1] : undefined)

  const subActionHandler = (e: React.ChangeEvent<{ value: string | number }>) =>
    setValue(+e.currentTarget.value)

  return (
    <ListItem button={checkbox as true} onClick={checkbox ? actionHandler : undefined}>
      {checkbox &&
        <ListItemIcon css={listItemIconStyle}>
          <Checkbox
            edge="start"
            checked={!!value}
            tabIndex={-1}
            disableRipple
          />
        </ListItemIcon>
      }
      <ListItemText
        primary={skillName}
        secondary={<SkillLevel value={value} items={items} update={setValue} />}
        secondaryTypographyProps={{ component: 'div' }}
      />
      <ListItemSecondaryAction>
        <Select value={value || 0} onChange={subActionHandler} size="small" native>
          <option value={0} />
          {items.map(level =>
            <option key={level} value={level}>{`LV ${level}`}</option>
          )}
        </Select>
      </ListItemSecondaryAction>
    </ListItem>
  )
}
