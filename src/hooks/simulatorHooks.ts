import { useEffect, useRef, useState } from 'react'
import { Equip } from '../domain/equips'
import Simulator from '../simulator'

export const useSimulator = () => {
  const [loading, setLoading] = useState(false)
  const [finish, setFinish] = useState(false)
  const [result, setResult] = useState([] as Equip[])

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
        setFinish(true)
        return
      }

      setResult(result => [...result, res])
    }

    setLoading(false)
  }

  const simulate = async (skills: Record<string, number>) => {
    const worker = workerRef.current

    if (!worker) return

    const simulator = new Simulator(worker, { skills, ignore: [] })
    simulatorRef.current = simulator

    setFinish(false)
    setResult([])

    await exec(simulator)
  }

  const more = async () => {
    const simulator = simulatorRef.current

    if (!simulator || finish) return

    await exec(simulator)
  }

  return {
    loading,
    finish,
    result,
    simulate,
    more,
  }
}
