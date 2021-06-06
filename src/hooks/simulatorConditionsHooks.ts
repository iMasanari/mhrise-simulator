import { useSelector } from 'react-redux'
import { RootState } from '../modules'
import { setSkills, addSkills, setWeaponSlots } from '../modules/simulatorConditions'
import { useAction } from './actionHooks'

const selector = (state: RootState) =>
  state.simulatorConditions

export const useSimulatorConditons = () =>
  useSelector(selector)

export const useSetWeaponSlots = () =>
  useAction(setWeaponSlots)

export const useAddSkills = () =>
  useAction(addSkills)

export const useSetSkills = () =>
  useAction(setSkills)
