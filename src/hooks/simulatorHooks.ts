import { useSelector } from 'react-redux'
import { useSimulatorRef } from '../contexts/SimulatorContext'
import { Charm, Slots } from '../domain/equips'
import { ActiveSkill } from '../domain/skill'
import { RootState } from '../modules'
import { addResult, simulateComplete, simulateInit, simulateStart, simulateStop } from '../modules/simulatorResult'
import Simulator from '../simulator'
import { useAction } from './actionHooks'
import { useResetResultOpens } from './simualtorPageState'

const selector = (state: RootState) =>
  state.simulatorResult

export const useSimulator = () => {
  const { loading, completed, result } = useSelector(selector)
  const init = useAction(simulateInit)
  const start = useAction(simulateStart)
  const stop = useAction(simulateStop)
  const complete = useAction(simulateComplete)
  const add = useAction(addResult)
  const resetResultOpen = useResetResultOpens()
  const simulatorRef = useSimulatorRef()

  const exec = async (simulator: Simulator) => {
    start()

    for (let i = 0; i < 10; i++) {
      const equip = await simulator.simulate()

      if (simulator !== simulatorRef.current) {
        return
      }

      if (!equip) {
        complete()
        return
      }

      add(equip)
    }

    stop()
  }

  const simulate = async (skills: ActiveSkill, weaponSlots: Slots, charms: Charm[], ignore: string[]) => {
    if (simulatorRef.current) {
      simulatorRef.current.terminate()
    }

    const simulator = new Simulator({ skills, weaponSlots, charms, ignore })
    simulatorRef.current = simulator

    init()
    resetResultOpen()

    await exec(simulator)
  }

  const more = async () => {
    const simulator = simulatorRef.current

    if (!simulator || completed) return

    await exec(simulator)
  }

  return {
    loading,
    completed,
    result,
    simulate,
    more,
  }
}
