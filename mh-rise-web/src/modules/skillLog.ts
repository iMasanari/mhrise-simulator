import ActionReducer from 'action-reducer'
import { ActiveSkill } from '../domain/skill'

export type SkillLog = string[]

const initState: SkillLog = []

const { reducer, createAction } = ActionReducer(initState, 'skillLog/')

export const updateSkillLog = createAction('update', (state, activeSkill: ActiveSkill) => {
  const skills = Object.keys(activeSkill)
    .filter((v) => activeSkill[v])
    .sort((a, b) => activeSkill[b]! - activeSkill[a]!)

  return [
    ...skills,
    ...state.filter(v => !activeSkill[v]),
  ]
})

export default reducer
