import { combineReducers } from 'redux'
import addableSkillsResult, { AddableSkillsResult } from './addableSkillsResult'
import charms, { Charms } from './charms'
import decoLimits, { DecoLimits } from './decoLimits'
import ignoreArmors, { IgnoreArmors } from './ignoreArmors'
import simulatorPageState, { SimulatorPageState } from './simualtorPageState'
import simulatorConditions, { SimulatorConditions } from './simulatorConditions'
import simulatorResult, { SimulatorResult } from './simulatorResult'
import skillLog, { SkillLog } from './skillLog'

export interface RootState {
  skillLog: SkillLog
  charms: Charms
  ignoreArmors: IgnoreArmors
  decoLimits: DecoLimits
  simulatorPageState: SimulatorPageState
  simulatorConditions: SimulatorConditions
  simulatorResult: SimulatorResult
  addableSkillsResult: AddableSkillsResult
}

export default combineReducers<RootState>({
  skillLog,
  charms,
  ignoreArmors,
  decoLimits,
  simulatorPageState,
  simulatorConditions,
  simulatorResult,
  addableSkillsResult,
})
