import { useSelector } from 'react-redux'
import { RootState } from '../modules'
import { setMode, setResultOpen, resetResultOpens } from '../modules/simualtorPageState'
import { useAction } from './actionHooks'

const selector = (state: RootState) =>
  state.simulatorPageState

export const useSimulatorPageState = () =>
  useSelector(selector)

export const useSetMode = () =>
  useAction(setMode)

export const useSetResultOpen = () =>
  useAction(setResultOpen)

export const useResetResultOpens = () =>
  useAction(resetResultOpens)
