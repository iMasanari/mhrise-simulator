import { useSelector } from 'react-redux'
import { RootState } from '../modules'
import { updateSkillLog } from '../modules/skillLog'
import { useAction } from './action'

const selector = (state: RootState) =>
  state.skillLog

export const useSkillLog = () =>
  useSelector(selector)

export const useUpdateSkillLog = () =>
  useAction(updateSkillLog)
