import { combineReducers } from 'redux'
import addableSkillsResult, { AddableSkillsResult } from './addableSkillsResult'
import charms, { Charms } from './charms'
import simulatorPageState, { SimulatorPageState } from './simualtorPageState'
import simulatorConditions, { SimulatorConditions } from './simulatorConditions'
import simulatorResult, { SimulatorResult } from './simulatorResult'
import skillLog, { SkillLog } from './skillLog'

export interface RootState {
  skillLog: SkillLog
  charms: Charms
  simulatorPageState: SimulatorPageState
  simulatorConditions: SimulatorConditions
  simulatorResult: SimulatorResult
  addableSkillsResult: AddableSkillsResult
}

export default combineReducers<RootState>({
  skillLog,
  charms,
  simulatorPageState,
  simulatorConditions,
  simulatorResult,
  addableSkillsResult,
})
