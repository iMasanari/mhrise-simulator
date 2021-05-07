import { useSelector } from 'react-redux'
import { RootState } from '../modules'
import { addCharm, removeCharms } from '../modules/charms'
import { useAction } from './actionHooks'

const selector = (state: RootState) =>
  state.charms

export const useCharms = () =>
  useSelector(selector)

export const useAddCharm = () =>
  useAction(addCharm)

export const useRemoveCharms = () =>
  useAction(removeCharms)
