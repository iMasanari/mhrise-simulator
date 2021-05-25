// @ts-expect-error
import solver from 'javascript-lp-solver'
import { Armor, Charm, Deco, Slots } from '../domain/equips'
import { Result } from '../domain/simulator'
import { ActiveSkill } from '../domain/skill'
import { NO_ARMOR_COEFFICIENT } from './constants'

export type EquipsType = 'head' | 'body' | 'arm' | 'wst' | 'leg' | 'charm'

const Y_OBJECTIVE = 'Y_OBJECTIVE'

const Y_WEAPON_COUNT = 'Y_WEAPON_COUNT'
const Y_HEAD_COUNT = 'Y_HEAD_COUNT'
const Y_BODY_COUNT = 'Y_BODY_COUNT'
const Y_ARM_COUNT = 'Y_ARM_COUNT'
const Y_WST_COUNT = 'Y_WST_COUNT'
const Y_LEG_COUNT = 'Y_LEG_COUNT'
const Y_CHARM_COUNT = 'Y_CHARM_COUNT'

const Y_SLOT_1_OVER = 'Y_SLOT_1_OVER'
const Y_SLOT_2_OVER = 'Y_SLOT_2_OVER'
const Y_SLOT_3_OVER = 'Y_SLOT_3_OVER'

const DECO_PREFIX = 'X/deco/'

const typeRecord = {
  head: Y_HEAD_COUNT,
  body: Y_BODY_COUNT,
  arm: Y_ARM_COUNT,
  wst: Y_WST_COUNT,
  leg: Y_LEG_COUNT,
  charm: Y_CHARM_COUNT,
} as const

const findEquip = (type: EquipsType, list: [string, unknown][]) => {
  const prefix = `X/${type}/`
  const key = list.find(([v]) => v.startsWith(prefix))

  return key?.[0].slice(prefix.length)
}

const findDecoList = (list: [string, number][]) => {
  return list
    .filter(([v]) => v.startsWith(DECO_PREFIX))
    .map(([v, count]): [string, number] => [v.slice(DECO_PREFIX.length), count])
}

export default class Simulator {
  private constraints: Record<string, { max?: number, min?: number }> = {
    // 装備数
    [Y_WEAPON_COUNT]: { max: 1 },
    [Y_HEAD_COUNT]: { max: 1 },
    [Y_BODY_COUNT]: { max: 1 },
    [Y_ARM_COUNT]: { max: 1 },
    [Y_WST_COUNT]: { max: 1 },
    [Y_LEG_COUNT]: { max: 1 },
    [Y_CHARM_COUNT]: { max: 1 },
    // スロット
    [Y_SLOT_1_OVER]: { min: 0 },
    [Y_SLOT_2_OVER]: { min: 0 },
    [Y_SLOT_3_OVER]: { min: 0 },
  }

  private ints: Record<string, number> = {
    [Y_OBJECTIVE]: 1,
    [Y_WEAPON_COUNT]: 1,
    [Y_HEAD_COUNT]: 1,
    [Y_BODY_COUNT]: 1,
    [Y_ARM_COUNT]: 1,
    [Y_WST_COUNT]: 1,
    [Y_LEG_COUNT]: 1,
    [Y_CHARM_COUNT]: 1,
    [Y_SLOT_1_OVER]: 1,
    [Y_SLOT_2_OVER]: 1,
    [Y_SLOT_3_OVER]: 1,
  }

  private variables: Record<string, Record<string, number>> = {
  }

  private skillKeys: string[]

  constructor(skillCondition: ActiveSkill, private objectiveSkill: string | undefined) {
    this.skillKeys = Object.keys(skillCondition)

    for (const [skill, point] of Object.entries(skillCondition)) {
      this.ints[skill] = 1
      this.constraints[skill] = { min: point }
    }
  }

  setWeaponSlots(slots: Slots) {
    const key = 'X/WeaponSlot'

    // 個数制限
    this.ints[key] = 1
    this.constraints[key] = { max: 1 }

    this.variables[key] = {
      [Y_WEAPON_COUNT]: 1,
      [Y_SLOT_1_OVER]: slots.filter(v => v >= 1).length,
      [Y_SLOT_2_OVER]: slots.filter(v => v >= 2).length,
      [Y_SLOT_3_OVER]: slots.filter(v => v >= 3).length,
    }
  }

  addEquip(type: EquipsType, equip: Armor) {
    const key = `X/${type}/${equip.name}`

    // 個数制限
    this.ints[key] = 1
    this.constraints[key] = { max: 1 }

    const def = equip.defs[1] || 0
    const slot1Over = equip.slots.filter(v => v >= 1).length
    const slot2Over = equip.slots.filter(v => v >= 2).length
    const slot3Over = equip.slots.filter(v => v >= 3).length

    const target = this.objectiveSkill
      ? (equip.skills[this.objectiveSkill] || 0) * 1000 + def
      : -1 * (NO_ARMOR_COEFFICIENT * 100) + def * 100 + slot1Over + slot2Over + slot3Over

    this.variables[key] = {
      [Y_OBJECTIVE]: target,
      [typeRecord[type]]: 1,
      // スロット
      [Y_SLOT_1_OVER]: slot1Over,
      [Y_SLOT_2_OVER]: slot2Over,
      [Y_SLOT_3_OVER]: slot3Over,
      // スキル
      ...Object.fromEntries(this.skillKeys.map(skill =>
        [skill, equip.skills[skill] || 0]
      )),
    }
  }

  addCharm(charm: Charm & { name: string }) {
    const key = `X/charm/${charm.name}`

    // 個数制限
    this.ints[key] = 1
    this.constraints[key] = { max: 1 }

    const slot1Over = charm.slots.filter(v => v >= 1).length
    const slot2Over = charm.slots.filter(v => v >= 2).length
    const slot3Over = charm.slots.filter(v => v >= 3).length

    const target = this.objectiveSkill
      ? (charm.skills[this.objectiveSkill] || 0) * 1000
      : slot1Over + slot2Over + slot3Over

    this.variables[key] = {
      [Y_OBJECTIVE]: target,
      [typeRecord.charm]: 1,
      // スロット
      [Y_SLOT_1_OVER]: slot1Over,
      [Y_SLOT_2_OVER]: slot2Over,
      [Y_SLOT_3_OVER]: slot3Over,
      // スキル
      ...Object.fromEntries(this.skillKeys.map(skill =>
        [skill, charm.skills[skill] || 0]
      )),
    }
  }

  addDeco(deco: Deco) {
    const key = `${DECO_PREFIX}${deco.name}`

    // 個数制限
    this.ints[key] = 1

    const slot1Over = deco.size >= 1 ? -1 : 0
    const slot2Over = deco.size >= 2 ? -1 : 0
    const slot3Over = deco.size >= 3 ? -1 : 0

    const target = this.objectiveSkill
      ? (deco.skills[this.objectiveSkill] || 0) * 1000
      : slot1Over + slot2Over + slot3Over

    this.variables[key] = {
      [Y_OBJECTIVE]: target,
      // スロット
      [Y_SLOT_1_OVER]: slot1Over,
      [Y_SLOT_2_OVER]: slot2Over,
      [Y_SLOT_3_OVER]: slot3Over,
      // スキル
      ...Object.fromEntries(this.skillKeys.map(skill =>
        [skill, deco.skills[skill] || 0]
      )),
    }
  }

  setPrevs(prevs: Result[]) {
    for (const [index, equip] of prevs.entries()) {
      const key = `Y_PREVS/${index}`

      this.constraints[key] = {
        max: [equip.head, equip.body, equip.arm, equip.wst, equip.leg].filter(Boolean).length - 1,
      }

      if (equip.head) this.variables[`X/head/${equip.head}`][key] = 1
      if (equip.body) this.variables[`X/body/${equip.body}`][key] = 1
      if (equip.arm) this.variables[`X/arm/${equip.arm}`][key] = 1
      if (equip.wst) this.variables[`X/wst/${equip.wst}`][key] = 1
      if (equip.leg) this.variables[`X/leg/${equip.leg}`][key] = 1
    }
  }

  solve(): Result | null {
    const result = solver.Solve({
      optimize: Y_OBJECTIVE,
      opType: 'max',
      constraints: this.constraints,
      variables: this.variables,
      ints: this.ints,
    })

    if (!result.feasible) {
      return null
    }

    const entries = Object.entries<number>(result)

    const head = findEquip('head', entries)
    const body = findEquip('body', entries)
    const arm = findEquip('arm', entries)
    const wst = findEquip('wst', entries)
    const leg = findEquip('leg', entries)
    const charm = findEquip('charm', entries)

    const deco = findDecoList(entries)

    return {
      head,
      body,
      arm,
      wst,
      leg,
      charm,
      deco,
    }
  }
}
