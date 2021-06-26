import { GridRowId } from '@material-ui/data-grid'
import ActionReducer from 'action-reducer'

export type Mode = 'usage' | 'result' | 'addableSkill' | 'charms'

export interface SimulatorPageState {
  mode: Mode
  resultOpen: boolean
  selectionModel: GridRowId[]
}

const initState: SimulatorPageState = {
  mode: 'usage',
  resultOpen: false,
  selectionModel: [],
}

const { reducer, createAction } = ActionReducer(initState, 'addableSkillsResult/')

export const setMode = createAction('setMode', (state, mode: Mode) => (
  { ...state, mode }
))

export const setSelectionModel = createAction('setSelectionModel', (state, selectionModel: GridRowId[]) => (
  { ...state, selectionModel }
))

export const setResultOpen = createAction('setResultOpen', (state, resultOpen: boolean) => (
  { ...state, resultOpen }
))

export default reducer
