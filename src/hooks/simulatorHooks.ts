import { useRef, useState } from 'react'
import { useStore } from 'react-redux'
import skillList from '../../generated/skills.json'
import { Charm, Equip, Slots } from '../domain/equips'
import { ActiveSkill } from '../domain/skill'
import { RootState } from '../modules'
import Simulator, { createSiumlatorWorker } from '../simulator'

const skillMaxPointMap = new Map(
  skillList.map(v => [v.name, v.details[v.details.length - 1].point])
)

export const useSimulator = () => {
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [result, setResult] = useState([] as Equip[])
  const [addableSkillList, setAddableSkillList] = useState([] as [string, number][])

  const simulatorRef = useRef<Simulator>()
  const addableSkillWorkerRef = useRef<Worker>()

  const exec = async (simulator: Simulator) => {
    setLoading(true)

    for (let i = 0; i < 10; i++) {
      const res = await simulator.simulate()

      if (simulator !== simulatorRef.current) {
        return
      }

      if (!res) {
        setLoading(false)
        setCompleted(true)
        return
      }

      setResult(result => [...result, res])
    }

    setLoading(false)
  }

  const simulate = async (skills: ActiveSkill, weaponSlots: Slots, charms: Charm[]) => {
    if (simulatorRef.current) {
      simulatorRef.current.terminate()
    }

    const simulator = new Simulator({ skills, weaponSlots, charms, ignore: [] })
    simulatorRef.current = simulator

    setCompleted(false)
    setResult([])

    await exec(simulator)
  }

  const more = async () => {
    const simulator = simulatorRef.current

    if (!simulator || completed) return

    await exec(simulator)
  }

  const store = useStore<RootState>()

  const searchAddableSkillList = async (skills: ActiveSkill, weaponSlots: Slots, charms: Charm[]) => {
    if (addableSkillWorkerRef.current) {
      addableSkillWorkerRef.current.terminate()
    }

    const worker = createSiumlatorWorker()
    addableSkillWorkerRef.current = worker

    const skillLog = new Set([...store.getState().skillLog, ...skillList.map(v => v.name)])

    setCompleted(false)
    setAddableSkillList([])

    for (const skill of skillLog) {
      const simulator = new Simulator({ skills, weaponSlots, charms, ignore: [], objectiveSkill: skill }, worker)
      const result = await simulator.simulate()
      const point = result ? Math.min(result.skills[skill] || 0, skillMaxPointMap.get(skill)!) : 0

      if (point && skills[skill] !== point) {
        setAddableSkillList((list) => [...list, [skill, point]])
      }
    }

    setCompleted(true)
  }

  return {
    loading,
    completed,
    result,
    addableSkillList,
    simulate,
    more,
    searchAddableSkillList,
  }
}
