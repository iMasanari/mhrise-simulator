export interface Armor {
  name: string
  series: string
  slots: number[]
  defs: [number, number]
  elements: [number, number, number, number, number]
  skills: Record<string, number>
  materials: Record<string, number>
}

const json: Armor[]

export default json
