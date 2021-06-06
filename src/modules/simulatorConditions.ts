import ActionReducer from 'action-reducer'
import { Slots } from '../domain/equips'
import { ActiveSkill } from '../domain/skill'

export interface SimulatorConditions {
  weaponSlots: Slots
  skills: ActiveSkill
}

const initState: SimulatorConditions = {
  weaponSlots: [],
  skills: {},
}

const { reducer, createAction } = ActionReducer(initState, 'simulatorConditions/')

export const setWeaponSlots = createAction('setWeaponSlots', (state, slots: Slots) => (
  { ...state, weaponSlots: slots }
))

export const addSkills = createAction('addSkills', (state, skill: string, points: number) => (
  { ...state, skills: { ...state.skills, [skill]: points } }
))

export const setSkills = createAction('setSkills', (state, skills: ActiveSkill) =>
  ({ ...state, skills })
)

export default reducer
