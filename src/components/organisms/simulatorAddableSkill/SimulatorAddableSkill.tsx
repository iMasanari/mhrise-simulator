import { List, ListItem, ListItemText, Typography } from '@material-ui/core'
import React from 'react'
import { useAddableSkillsSimulator } from '../../../hooks/addableSkillsSimulator'
import { useAddSkills } from '../../../hooks/simulatorConditionsHooks'

export default function SimulatorAddableSkill() {
  const setSkillConditons = useAddSkills()
  const { result, loading } = useAddableSkillsSimulator()

  return (
    <div>
      {result.length > 0 && (
        <List dense>
          {result.map(([skill, point]) =>
            <ListItem key={skill} button component="li" onClick={() => setSkillConditons(skill, point)}>
              <ListItemText primary={`${skill} Lv${point}`} />
            </ListItem>
          )}
        </List>
      )}
      {!loading && <Typography align="center">検索完了 {result.length}件</Typography>}
    </div>
  )
}
