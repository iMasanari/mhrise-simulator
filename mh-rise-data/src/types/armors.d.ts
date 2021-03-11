export interface Armor {
  name: string
  slots: [number, number, number]
  defs: [number, number, number]
  elements: [number, number, number, number, number]
  skills: Record<string, number>,
  oneset: boolean
}

const json: Armor[]

export default json
