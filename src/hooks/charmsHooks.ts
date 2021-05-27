import { useSelector } from 'react-redux'
import { RootState } from '../modules'
import { addCharm, removeCharms, replaceCharm } from '../modules/charms'
import { useAction } from './actionHooks'

const selector = (state: RootState) =>
  state.charms

export const useCharms = () =>
  useSelector(selector)

export const useAddCharm = () =>
  useAction(addCharm)

export const useReplaceCharm = () =>
  useAction(replaceCharm)

export const useRemoveCharms = () =>
  useAction(removeCharms)
