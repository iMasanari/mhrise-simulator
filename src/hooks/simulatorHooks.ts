import { useEffect, useRef, useState } from 'react'
import { useStore } from 'react-redux'
import skillList from '../../generated/skills.json'
import { Equip } from '../domain/equips'
import { ActiveSkill } from '../domain/skill'
import { WeaponSlot } from '../domain/weapon'
import { RootState } from '../modules'
import Simulator from '../simulator'

const skillMaxPointMap = new Map(
  skillList.map(v => [v.name, v.details[v.details.length - 1].point])
)

export const useSimulator = () => {
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [result, setResult] = useState([] as Equip[])
  const [addableSkillList, setAddableSkillList] = useState([] as [string, number][])

  const workerRef = useRef<Worker>()
  const simulatorRef = useRef<any>()

  useEffect(() => {
    const worker = new Worker(new URL('../simulator/worker.ts', import.meta.url))

    workerRef.current = worker

    return () => worker.terminate()
  }, [])

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

  const simulate = async (skills: ActiveSkill, weaponSlot: WeaponSlot) => {
    const worker = workerRef.current

    if (!worker) return

    const simulator = new Simulator(worker, { skills, weaponSlot, ignore: [] })
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

  const searchAddableSkillList = async (skills: ActiveSkill, weaponSlot: WeaponSlot) => {
    const worker = workerRef.current

    if (!worker) return

    const skillLog = new Set([...store.getState().skillLog, ...skillList.map(v => v.name)])

    setCompleted(false)
    setAddableSkillList([])

    for (const skill of skillLog) {
      const simulator = new Simulator(worker, { skills, weaponSlot, ignore: [], objectiveSkill: skill })
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
