import { combineReducers } from 'redux'
import charms, { Charms } from './charms'
import skillLog, { SkillLog } from './skillLog'

export interface RootState {
  skillLog: SkillLog
  charms: Charms
}

export default combineReducers<RootState>({
  skillLog,
  charms,
})
