import { css } from '@emotion/react'
import { Checkbox, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import React from 'react'
import SkillLevel from '../../molecules/SkillLevel'

interface Props {
  skillName: string
  items: number[]
  value: number
  setValue: (value: number) => void
}

const listItemIconStyle = css`
  min-width: 0;
`

export default function SkillListItem({ skillName, items, value, setValue }: Props) {
  const actionHandler = () =>
    setValue(!value ? items[items.length - 1] : 0)

  return (
    <ListItem button onClick={actionHandler}>
      <ListItemIcon css={listItemIconStyle}>
        <Checkbox
          edge="start"
          checked={!!value}
          tabIndex={-1}
          disableRipple
        />
      </ListItemIcon>
      <ListItemText
        primary={skillName}
        secondary={<SkillLevel value={value} items={items} update={setValue} />}
        secondaryTypographyProps={{ component: 'div' }}
      />
    </ListItem>
  )
}
