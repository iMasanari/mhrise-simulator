import { combineReducers } from 'redux'
import skillLog, { SkillLog } from './skillLog'

export interface RootState {
  skillLog: SkillLog
}

export default combineReducers<RootState>({
  skillLog,
})
