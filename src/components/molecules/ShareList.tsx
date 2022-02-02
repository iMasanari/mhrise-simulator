import { List, ListItem, ListItemText } from '@mui/material'
import React from 'react'
import { ActiveSkill } from '../../domain/skill'
import NakedLink from '../atoms/NakedLink'

export interface Share {
  id: string
  head: string | null
  body: string | null
  arm: string | null
  wst: string | null
  leg: string | null
  skills: ActiveSkill
}

interface Props {
  shares: Share[]
}

export default function ShareList({ shares }: Props) {
  return (
    <List>
      {shares.map(({ id, head, body, arm, wst, leg, skills }) =>
        <li key={id}>
          <ListItem button component={NakedLink} href={`/shares/${id}`}>
            <ListItemText
              primary={`${head || '装備なし'} - ${body || '装備なし'} - ${arm || '装備なし'} - ${wst || '装備なし'} - ${leg || '装備なし'}`}
              secondary={getSkillText(skills)}
              primaryTypographyProps={{ color: 'primary' }}
            />
          </ListItem>
        </li>
      )}
      {!shares.length && (
        <ListItem>
          <ListItemText primary="データがありません" />
        </ListItem>
      )}
    </List>
  )
}

const getSkillText = (skills: ActiveSkill) => {
  const skillList = Object.entries(skills).map(([name, point]) => ({ name, point }))
    .sort((a, b) => b.point - a.point)

  return skillList.map(({ name, point }) => `${name}Lv${point}`).join(' ')
}
