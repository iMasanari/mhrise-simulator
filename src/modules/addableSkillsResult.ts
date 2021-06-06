import ActionReducer from 'action-reducer'

export interface AddableSkillsResult {
  loading: boolean
  result: [string, number][]
}

const initState: AddableSkillsResult = {
  loading: false,
  result: [],
}

const { reducer, createAction } = ActionReducer(initState, 'addableSkillsResult/')

export const simulateStart = createAction('simulateStart', () => (
  { loading: true, result: [] }
))

export const addResult = createAction('addResult', (state, skill: string, point: number) => (
  { ...state, result: [...state.result, [skill, point]] }
))

export const simulateStop = createAction('simulateStop', (state) => (
  { ...state, loading: false }
))

export default reducer
