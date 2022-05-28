import ActionReducer from 'action-reducer'

export type IgnoreArmors = Record<string, true | undefined>

const initState: IgnoreArmors = {
}

const compat = (obj: Record<string, boolean | undefined>) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v)) as Record<string, true>

const { reducer, createAction } = ActionReducer(initState, 'ignoreArmors/')

export const updateIgnoreArmors = createAction('update', (state, ignore: Record<string, boolean | undefined>) => (
  compat({ ...state, ...ignore })
))

export const toggleIgnoreArmors = createAction('toggle', (state, name: string) => {
  const currentValue = state[name]

  if (currentValue) {
    const { [name]: _, ...rest } = state

    return rest
  }

  return (
    { ...state, [name]: true }
  )
})

export default reducer
