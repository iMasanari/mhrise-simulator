import { ActiveSkill } from './skill'
import { WeaponSlot } from './weapon'

export interface Armor {
  name: string
  series: string
  slots: [number, number, number]
  defs: [number, number]
  elements: [number, number, number, number, number]
  skills: ActiveSkill
  materials: Record<string, number>
}

export interface Charm {
  name: string
  skills: ActiveSkill
  materials: Record<string, number>
}

export interface Deco {
  name: string
  size: number
  skills: ActiveSkill
  materials: Record<string, number>
}

export interface Equip {
  def: number
  weaponSlot: WeaponSlot
  head: Armor | undefined
  body: Armor | undefined
  arm: Armor | undefined
  wst: Armor | undefined
  leg: Armor | undefined
  charm: Charm | undefined
  decos: Deco[]
  skills: ActiveSkill
}
