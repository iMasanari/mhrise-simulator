import { Options } from '@i-masanari/mh-rise-simulator'
import { Result } from '@i-masanari/mh-rise-simulator/dist/Simulator'
import { Box, Button } from '@material-ui/core'
import React, { useEffect, useReducer, useRef, useState } from 'react'
import { ActiveSkill, SkillSystem } from '../../domain/skill'
import { WeaponSlot } from '../../domain/weapon'
import DevelopWarning from '../molecules/DevelopWarning'
import SimulateCondition from '../organisms/SimulateCondition'

interface Props {
  skills: SkillSystem[]
}

type ResultType =
  | { type: 'start', id: number }
  | { type: 'calc', id: number, result: Result }
  | { type: 'end', id: number }

const resultReducer = (state: State, action: ResultType): State => {
  switch (action.type) {
    case 'start':
      return {
        loading: true,
        id: action.id,
        result: [],
      }
    case 'calc':
      return action.id !== state.id ? state : {
        ...state,
        result: [...state.result, action.result],
      }
    case 'end':
      return action.id !== state.id ? state : {
        ...state,
        loading: false,
      }
  }
}

type State = {
  loading: boolean
  id: number
  result: Result[]
}

const initState = {
  loading: false,
  id: 0,
  result: [],
}

export default function Simulator({ skills }: Props) {
  const [activeSkill, setActiveSkill] = useState<ActiveSkill>({})
  const [weaponSlot, setWeaponSlot] = useState<WeaponSlot>([0, 0, 0])
  const [result, dispatch] = useReducer(resultReducer, initState)

  const executeRef = useRef<(options: Options) => void>()

  useEffect(() => {
    const worker = new Worker(new URL('../../worker/index.worker.ts', import.meta.url))

    worker.addEventListener('message', (e) => {
      dispatch(e.data)
    })

    executeRef.current = options => worker.postMessage(options)

    return () => worker.terminate()
  }, [])

  const exec = async () => {
    executeRef.current!({
      skill: activeSkill as Record<string, number>,
      ignore: [],
      limit: 10,
    })
  }

  return (
    <Box sx={{ my: 4 }}>
      <DevelopWarning />
      <SimulateCondition
        skills={skills}
        activeSkill={activeSkill}
        setActiveSkill={setActiveSkill}
        weaponSlot={weaponSlot}
        setWeaponSlot={setWeaponSlot}
      />
      <Button onClick={exec}>実行</Button>
      <div>{result.loading && '検索中...'}</div>
      <pre>{JSON.stringify(result.result, null, 2)}</pre>
    </Box>
  )
}
