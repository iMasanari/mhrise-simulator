import { ActiveSkill } from './skill'

export type Slots = number[]

export interface Armor {
  name: string
  series: string
  slots: Slots
  defs: [number, number]
  elements: [number, number, number, number, number]
  skills: ActiveSkill
  materials: Record<string, number>
}

export interface Charm {
  skills: ActiveSkill
  slots: Slots
}

export interface Deco {
  name: string
  size: number
  skills: ActiveSkill
  materials: Record<string, number>
}

export interface Equip {
  def: number
  weaponSlot: Slots
  head: Armor | null | undefined
  body: Armor | null | undefined
  arm: Armor | null | undefined
  wst: Armor | null | undefined
  leg: Armor | null | undefined
  charm: Charm | null | undefined
  decos: Deco[]
  skills: ActiveSkill
}
