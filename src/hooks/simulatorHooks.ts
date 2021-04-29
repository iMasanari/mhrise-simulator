import { useEffect, useReducer, useRef } from 'react'
import { Condition, Result } from '../domain/simulator'

type ResultType =
  | { type: 'start', id: number }
  | { type: 'calc', id: number, result: Result }
  | { type: 'end', id: number }

const reducer = (state: State, action: ResultType): State => {
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

export const useSimulator = () => {
  const [state, dispatch] = useReducer(reducer, initState)

  const workerRef = useRef<Worker>()

  useEffect(() => {
    const worker = new Worker(new URL('../worker/index.worker.ts', import.meta.url))

    workerRef.current = worker

    worker.addEventListener('message', (e) => {
      dispatch(e.data)
    })

    return () => worker.terminate()
  }, [])

  const simulate = async (activeSkill: Record<string, number>) => {
    const condition: Condition = {
      skill: activeSkill,
      ignore: [],
      limit: 10,
    }

    workerRef.current!.postMessage(condition)
  }

  return {
    loading: state.loading,
    result: state.result,
    simulate,
  }
}
