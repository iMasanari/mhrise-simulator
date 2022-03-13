import ActionReducer from 'action-reducer'

export type Mode = 'usage' | 'result' | 'addableSkill' | 'charms' | 'armors'

export interface SimulatorPageState {
  mode: Mode
  opens: Record<string, boolean>
}

const initState: SimulatorPageState = {
  mode: 'usage',
  opens: {},
}

const { reducer, createAction } = ActionReducer(initState, 'addableSkillsResult/')

export const setMode = createAction('setMode', (state, mode: Mode) => (
  { ...state, mode }
))

export const setResultOpen = createAction('setResultOpen', (state, id: number, open: boolean) => (
  { ...state, opens: { ...state.opens, [id]: open } }
))

export const resetResultOpens = createAction('resetResultOpens', (state) => (
  { ...state, opens: {} }
))

export default reducer
