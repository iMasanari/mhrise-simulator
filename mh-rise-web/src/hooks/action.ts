import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

export const useAction = <T extends (...args: any[]) => any>(fn: T) => {
  const dispatch = useDispatch()
  const action = useCallback((...args) => dispatch(fn(...args)), [dispatch, fn])

  return action as T
}
