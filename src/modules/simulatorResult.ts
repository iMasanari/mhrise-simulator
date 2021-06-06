import ActionReducer from 'action-reducer'
import { Equip } from '../domain/equips'

export interface SimulatorResult {
  loading: boolean
  completed: boolean
  result: Equip[]
}

const initState: SimulatorResult = {
  loading: false,
  completed: false,
  result: [],
}

const { reducer, createAction } = ActionReducer(initState, 'simulatorResult/')

export const simulateInit = createAction('simulateInit', () => (
  initState
))

export const simulateStart = createAction('simulateStart', (state) => (
  { ...state, loading: true, completed: false }
))

export const addResult = createAction('addResult', (state, equip: Equip) => (
  { ...state, result: [...state.result, equip] }
))

export const simulateStop = createAction('simulateStop', (state) =>
  ({ ...state, loading: false })
)

export const simulateComplete = createAction('simulateComplete', (state) =>
  ({ ...state, loading: false, completed: true })
)

export default reducer
