export interface Armor {
  name: string
  slots: [number, number, number]
  defs: [number, number]
  elements: [number, number, number, number, number]
  skills: Record<string, number>
  materials: Record<string, number>
}

export interface Charm {
  name: string
  skills: Record<string, number>
  materials: Record<string, number>
}

export interface Deco {
  name: string
  size: number
  skills: Record<string, number>
  materials: Record<string, number>
}
