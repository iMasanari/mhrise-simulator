export interface SimulatorArmor {
  name: string
  series: string
  slots: number[]
  defs: [number, number]
  elements: [number, number, number, number, number]
  skills: Record<string, number>
}

const json: SimulatorArmor[]

export default json
