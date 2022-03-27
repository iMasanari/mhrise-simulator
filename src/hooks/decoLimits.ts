import { useSelector } from 'react-redux'
import { RootState } from '../modules'
import { updateDecoLimits } from '../modules/decoLimits'
import { useAction } from './actionHooks'

const selector = (state: RootState) =>
  state.decoLimits

export const useDecoLimits = () =>
  useSelector(selector)

export const useUpdateDecoLimits = () =>
  useAction(updateDecoLimits)
