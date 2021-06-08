import { createContext, FC, MutableRefObject, useContext, useRef } from 'react'
import Simulator from '../simulator'

const SimulatorContext = createContext<MutableRefObject<Simulator | undefined>>(null!)

export const SimulatorProvider: FC = ({ children }) => {
  const ref = useRef<Simulator>()

  return (
    <SimulatorContext.Provider value={ref}>
      {children}
    </SimulatorContext.Provider>
  )
}

export const useSimulatorRef = () =>
  useContext(SimulatorContext)
