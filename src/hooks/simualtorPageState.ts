import { useSelector } from 'react-redux'
import { RootState } from '../modules'
import { setMode, setSelectionModel, setResultOpen } from '../modules/simualtorPageState'
import { useAction } from './actionHooks'

const selector = (state: RootState) =>
  state.simulatorPageState

export const useSimulatorPageState = () =>
  useSelector(selector)

export const useSetMode = () =>
  useAction(setMode)

export const useSetSelectionModel = () =>
  useAction(setSelectionModel)

export const useSetResultOpen = () =>
  useAction(setResultOpen)
