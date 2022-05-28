import { useRef } from 'react'
import { useSelector, useStore } from 'react-redux'
import skillList from '../../generated/skills.json'
import { Condition } from '../domain/simulator'
import { RootState } from '../modules'
import { addResult, simulateStart, simulateStop } from '../modules/addableSkillsResult'
import Simulator, { createSiumlatorWorker } from '../simulator'
import { useAction } from './actionHooks'

const skillMaxPointMap = new Map(
  skillList.map(v => [v.name, v.details[v.details.length - 1].point])
)

const selector = (state: RootState) =>
  state.addableSkillsResult

export const useAddableSkillsSimulator = () => {
  const { loading, result } = useSelector(selector)
  const start = useAction(simulateStart)
  const stop = useAction(simulateStop)
  const add = useAction(addResult)

  const addableSkillWorkerRef = useRef<Worker>()

  const store = useStore<RootState>()

  const searchAddableSkills = async (condition: Condition) => {
    if (addableSkillWorkerRef.current) {
      addableSkillWorkerRef.current.terminate()
    }

    const worker = createSiumlatorWorker()
    addableSkillWorkerRef.current = worker

    const skillLog = new Set([...store.getState().skillLog, ...skillList.map(v => v.name)])

    start()

    for (const skill of skillLog) {
      const simulator = new Simulator({ ...condition, objectiveSkill: skill }, worker)
      const result = await simulator.simulate()
      const point = result ? Math.min(result.skills[skill] || 0, skillMaxPointMap.get(skill)!) : 0

      if (point && condition.skills[skill] !== point) {
        add(skill, point)
      }
    }

    stop()
  }

  return {
    loading,
    result,
    searchAddableSkills,
  }
}
