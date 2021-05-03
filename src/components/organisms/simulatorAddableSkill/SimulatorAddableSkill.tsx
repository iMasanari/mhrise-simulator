import { List, ListItem, ListItemText, ListSubheader, Typography } from '@material-ui/core'
import React from 'react'
import { ActiveSkill } from '../../../domain/skill'

interface Props {
  skills: [string, number][]
  completed: boolean
  setActiveSkill: React.Dispatch<React.SetStateAction<ActiveSkill>>
}

export default function SimulatorAddableSkill({ skills, completed, setActiveSkill }: Props) {
  return (
    <div>
      {skills.length > 0 && (
        <List subheader={<ListSubheader>追加スキル</ListSubheader>} dense>
          {skills.map(([skill, point]) =>
            <ListItem key={skill} button component="li" onClick={() => setActiveSkill(v => ({ ...v, [skill]: point }))}>
              <ListItemText primary={`${skill} Lv${point}`} />
            </ListItem>
          )}
        </List>
      )}
      {completed && <Typography align="center">検索完了 {skills.length}件</Typography>}
    </div>
  )
}
