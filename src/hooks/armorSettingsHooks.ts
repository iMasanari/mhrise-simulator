import { useSelector } from 'react-redux'
import { RootState } from '../modules'
import { updateIgnoreArmors, toggleIgnoreArmors } from '../modules/ignoreArmors'
import { useAction } from './actionHooks'

const selector = (state: RootState) =>
  state.ignoreArmors

export const useIgnoreArmors = () =>
  useSelector(selector)

export const useUpdateIgnoreArmors = () =>
  useAction(updateIgnoreArmors)

export const useToggleIgnoreArmors = () =>
  useAction(toggleIgnoreArmors)
