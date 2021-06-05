// @ts-expect-error
import solver from 'javascript-lp-solver'
import { Armor, Charm, Deco, Slots } from '../domain/equips'
import { Result } from '../domain/simulator'
import { ActiveSkill } from '../domain/skill'
import { NO_ARMOR_COEFFICIENT } from './constants'

type ArmorType = 'head' | 'body' | 'arm' | 'wst' | 'leg'
type EquipType = ArmorType | 'charm'

const Y_OBJECTIVE = 'Y_OBJECTIVE'

const Y_WEAPON_COUNT = 'Y_WEAPON_COUNT'
const Y_HEAD_COUNT = 'Y_HEAD_COUNT'
const Y_BODY_COUNT = 'Y_BODY_COUNT'
const Y_ARM_COUNT = 'Y_ARM_COUNT'
const Y_WST_COUNT = 'Y_WST_COUNT'
const Y_LEG_COUNT = 'Y_LEG_COUNT'
const Y_CHARM_COUNT = 'Y_CHARM_COUNT'
const Y_ARMAR_COUNT = 'Y_ARMAR_COUNT'

const Y_DEF = 'Y_DEF'

const Y_SLOT_1_OVER = 'Y_SLOT_1_OVER'
const Y_SLOT_2_OVER = 'Y_SLOT_2_OVER'
const Y_SLOT_3_OVER = 'Y_SLOT_3_OVER'

const DECO_PREFIX = 'X/deco/'

const armorTypeRecord = {
  head: Y_HEAD_COUNT,
  body: Y_BODY_COUNT,
  arm: Y_ARM_COUNT,
  wst: Y_WST_COUNT,
  leg: Y_LEG_COUNT,
} as const

const findEquip = (type: EquipType, list: [string, unknown][]) => {
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
  }

  private variables: Record<string, Record<string, number>> = {
  }

  private skillKeys: string[]

  constructor(skillCondition: ActiveSkill, private objectiveSkill: string | undefined) {
    this.skillKeys = Object.keys(skillCondition)

    for (const [skill, point] of Object.entries(skillCondition)) {
      // スキル設定
      this.ints[skill] = 1
      this.constraints[skill] = { min: point }

      // 風雷合一用スキル設定
      if (skill !== '風雷合一') {
        this.constraints[`Y_風雷合一_${skill}_count`] = { max: 1 }
        this.constraints[`Y_風雷合一_${skill}_armor`] = { min: 0 }
        this.constraints[`Y_風雷合一_${skill}_skill`] = { min: 0 }

        this.addIntVariable(`風雷合一Lv4_${skill}`, {
          [`Y_風雷合一_${skill}_count`]: 1,
          [`Y_風雷合一_${skill}_armor`]: -1,
          [`Y_風雷合一_${skill}_skill`]: -4,
          [skill]: 1,
        })

        this.addIntVariable(`風雷合一Lv5_${skill}`, {
          [`Y_風雷合一_${skill}_count`]: 1,
          [`Y_風雷合一_${skill}_armor`]: -1,
          [`Y_風雷合一_${skill}_skill`]: -5,
          [skill]: 2,
        })
      }
    }
  }

  private addIntVariable(key: string, variable: Record<string, number>) {
    this.ints[key] = 1

    const objective = this.objectiveSkill
      ? (variable[this.objectiveSkill] || 0) * 1000 + (variable[Y_DEF] || 0)
      : -(variable[Y_ARMAR_COUNT] || 0) * (NO_ARMOR_COEFFICIENT * 100) + (variable[Y_DEF] || 0) * 100 + (variable[Y_SLOT_1_OVER] || 0) + (variable[Y_SLOT_2_OVER] || 0) + (variable[Y_SLOT_3_OVER] || 0)

    this.variables[key] = {
      ...variable,
      [Y_OBJECTIVE]: objective,
    }
  }

  setWeaponSlots(slots: Slots) {
    this.addIntVariable('X/weaponSlots', {
      [Y_WEAPON_COUNT]: 1,
      [Y_SLOT_1_OVER]: slots.filter(v => v >= 1).length,
      [Y_SLOT_2_OVER]: slots.filter(v => v >= 2).length,
      [Y_SLOT_3_OVER]: slots.filter(v => v >= 3).length,
    })
  }

  addArmor(type: ArmorType, armor: Armor) {
    this.addIntVariable(`X/${type}/${armor.name}`, {
      [armorTypeRecord[type]]: 1,
      [Y_ARMAR_COUNT]: 1,
      // 防御力
      [Y_DEF]: armor.defs[1] || 0,
      // スロット
      [Y_SLOT_1_OVER]: armor.slots.filter(v => v >= 1).length,
      [Y_SLOT_2_OVER]: armor.slots.filter(v => v >= 2).length,
      [Y_SLOT_3_OVER]: armor.slots.filter(v => v >= 3).length,
      // スキル
      ...Object.fromEntries(this.skillKeys.map(skill =>
        [skill, armor.skills[skill] || 0]
      )),
      // 風雷合一スキル
      ...Object.fromEntries(this.skillKeys.flatMap(skill => [
        [`Y_風雷合一_${skill}_armor`, armor.skills[skill] || 0],
        [`Y_風雷合一_${skill}_skill`, armor.skills['風雷合一'] || 0],
      ])),
    })
  }

  addCharm(charm: Charm & { name: string }) {
    this.addIntVariable(`X/charm/${charm.name}`, {
      [Y_CHARM_COUNT]: 1,
      // スロット
      [Y_SLOT_1_OVER]: charm.slots.filter(v => v >= 1).length,
      [Y_SLOT_2_OVER]: charm.slots.filter(v => v >= 2).length,
      [Y_SLOT_3_OVER]: charm.slots.filter(v => v >= 3).length,
      // スキル
      ...Object.fromEntries(this.skillKeys.map(skill =>
        [skill, charm.skills[skill] || 0]
      )),
    })
  }

  addDeco(deco: Deco) {
    this.addIntVariable(`${DECO_PREFIX}${deco.name}`, {
      // スロット
      [Y_SLOT_1_OVER]: deco.size >= 1 ? -1 : 0,
      [Y_SLOT_2_OVER]: deco.size >= 2 ? -1 : 0,
      [Y_SLOT_3_OVER]: deco.size >= 3 ? -1 : 0,
      // スキル
      ...Object.fromEntries(this.skillKeys.map(skill =>
        [skill, deco.skills[skill] || 0]
      )),
    })
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
