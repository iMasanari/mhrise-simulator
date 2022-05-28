import ActionReducer from 'action-reducer'

export type DecoLimits = Record<string, number>

const initState: DecoLimits = {
}

const compat = (obj: Record<string, number | undefined>) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v != null)) as Record<string, number>

const { reducer, createAction } = ActionReducer(initState, 'decoLimits/')

export const updateDecoLimits = createAction('update', (state, ignore: Record<string, number | undefined>) => (
  compat({ ...state, ...ignore })
))

export default reducer
