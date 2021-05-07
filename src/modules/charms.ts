import ActionReducer from 'action-reducer'
import { Charm } from '../domain/equips'

export type Charms = Charm[]

const initState: Charms = []

const { reducer, createAction } = ActionReducer(initState, 'charms/')

export const addCharm = createAction('add', (state, charm: Charm) =>
  [...state, charm]
)

export const removeCharms = createAction('remove', (state, indexs: number[]) => {
  const indexSet = new Set(indexs)
  return state.filter((_, i) => !indexSet.has(i))
})

export default reducer
