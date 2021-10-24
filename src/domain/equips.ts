import { ActiveSkill } from './skill'

export type Slots = number[]

export interface Armor {
  name: string
  series: string
  slots: Slots
  defs: [number, number]
  elements: [number, number, number, number, number]
  skills: ActiveSkill
}

export interface ArmorWithDetails extends Armor {
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
}

export interface DecoWithDetails extends Deco {
  materials: Record<string, number>
}

export interface Equip {
  def: number
  weaponSlots: Slots
  head: Armor | null
  body: Armor | null
  arm: Armor | null
  wst: Armor | null
  leg: Armor | null
  charm: Charm | null
  decos: Deco[]
  skills: ActiveSkill
}

export interface EquipWithDetails {
  def: number
  weaponSlots: Slots
  head: ArmorWithDetails | null
  body: ArmorWithDetails | null
  arm: ArmorWithDetails | null
  wst: ArmorWithDetails | null
  leg: ArmorWithDetails | null
  charm: Charm | null
  decos: DecoWithDetails[]
  skills: ActiveSkill
  elements: [number, number, number, number, number]
}

interface EquipConditon {
  weaponSlots: Slots
  head: Armor | null
  body: Armor | null
  arm: Armor | null
  wst: Armor | null
  leg: Armor | null
  charm: Charm | null
  decos: Deco[]
}

export const toEquip = ({ weaponSlots, head, body, arm, wst, leg, charm, decos }: EquipConditon): Equip => {
  const armors = [head, body, arm, wst, leg].filter(Boolean as unknown as <T>(v: T) => v is NonNullable<T>)
  const def = armors.reduce((sum, v) => sum + (v ? v.defs[1] : 0), 0)

  const skills = {} as ActiveSkill

  // 防具スキル
  for (const value of armors) {
    for (const [skill, point] of Object.entries(value.skills)) {
      skills[skill] = (skills[skill] || 0) + point
    }
  }

  // 風雷合一スキル対応
  if (skills['風雷合一'] > 4) {
    const point = skills['風雷合一'] - 3
    for (const skill of Object.keys(skills)) {
      if (skill === '風雷合一') continue
      skills[skill] = skills[skill] + point
    }
  }

  // 護石、装飾品スキル
  for (const value of [charm, ...decos]) {
    if (!value) continue
    for (const [skill, point] of Object.entries(value.skills)) {
      skills[skill] = (skills[skill] || 0) + point
    }
  }

  return { weaponSlots, head, body, arm, wst, leg, charm, decos, def, skills }
}
