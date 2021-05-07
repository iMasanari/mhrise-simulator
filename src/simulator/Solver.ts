// @ts-expect-error
import glpk from 'glpk.js'
import { GLP_LO, GLP_MAX, GLP_UP, GLP_NOFEAS } from '../constants/glpk'
import { Armor, Charm, Deco, Slots } from '../domain/equips'
import { Result } from '../domain/simulator'
import { ActiveSkill } from '../domain/skill'
import Subject from './Subject'

export type EquipsType = 'head' | 'body' | 'arm' | 'wst' | 'leg' | 'charm'

const Y_HEAD_COUNT = 'Y_HEAD_COUNT'
const Y_BODY_COUNT = 'Y_BODY_COUNT'
const Y_ARM_COUNT = 'Y_ARM_COUNT'
const Y_WST_COUNT = 'Y_WST_COUNT'
const Y_LEG_COUNT = 'Y_LEG_COUNT'
const Y_CHARM_COUNT = 'Y_CHARM_COUNT'

const Y_DEF_CUSTOM = 'Y_DEF_CUSTOM'

const Y_SLOT_1_OVER = 'Y_SLOT_1_OVER'
const Y_SLOT_2_OVER = 'Y_SLOT_2_OVER'
const Y_SLOT_3_OVER = 'Y_SLOT_3_OVER'
const Y_SLOT_4_OVER = 'Y_SLOT_4_OVER'

// const Z_SLOT_1 = Y_SLOT_1_OVER
const Z_SLOT_2 = 'Z_SLOT_2'
const Z_SLOT_3 = 'Z_SLOT_3'
const Z_SLOT_4 = 'Z_SLOT_4'

const DECO_PREFIX = 'X/deco/'

const typeRecord = {
  head: Y_HEAD_COUNT,
  body: Y_BODY_COUNT,
  arm: Y_ARM_COUNT,
  wst: Y_WST_COUNT,
  leg: Y_LEG_COUNT,
  charm: Y_CHARM_COUNT,
} as const

const createSubject = (data: Record<string, number>, type: number) =>
  Object.entries(data).map(([name, value]) => ({
    name,
    vars: [{ name, coef: 1 }],
    bnds: { type, ub: value, lb: value },
  }))

const createIgnoreSubject = (results: Result[]) =>
  results.map(result => {
    const equips = (['head', 'body', 'arm', 'wst', 'leg'] as const)
      .map(type => result[type] ? `X/${type}/${result[type]}` : null)
      .filter(Boolean as unknown as <T>(v: T) => v is NonNullable<T>)

    return {
      name: equips.join('-'),
      vars: equips.map(name => ({ name, coef: 1 })),
      bnds: { type: GLP_UP, ub: equips.length - 1, lb: equips.length - 1 },
    }
  })


const findEquip = (type: EquipsType, list: [string, number][]) => {
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
  private equipLimits = new Subject([
    Y_HEAD_COUNT,
    Y_BODY_COUNT,
    Y_ARM_COUNT,
    Y_WST_COUNT,
    Y_LEG_COUNT,
    Y_CHARM_COUNT,
  ])

  private defs = new Subject([Y_DEF_CUSTOM])

  private slots = new Subject([
    Y_SLOT_1_OVER,
    Y_SLOT_2_OVER,
    Y_SLOT_3_OVER,
    Y_SLOT_4_OVER,
  ])

  binaries = [
    Y_HEAD_COUNT,
    Y_BODY_COUNT,
    Y_ARM_COUNT,
    Y_WST_COUNT,
    Y_LEG_COUNT,
    Y_CHARM_COUNT,
  ]

  generals = [
    Y_DEF_CUSTOM,

    Y_SLOT_1_OVER,
    Y_SLOT_2_OVER,
    Y_SLOT_3_OVER,
    Y_SLOT_4_OVER,

    Z_SLOT_2,
    Z_SLOT_3,
    Z_SLOT_4,
  ]

  private skillKeys: string[]
  private skills: Subject<string>
  private prevs: Result[] = []
  private objectiveSkill: string | undefined

  constructor(private skillCondition: ActiveSkill, private weaponSlot: Slots) {
    const skillKeys = Object.keys(skillCondition)

    this.skillKeys = skillKeys
    this.skills = new Subject(skillKeys)
    this.generals.push(...skillKeys)

    const weaponSlotName = 'X/WeaponSlot'

    // 個数制限
    this.binaries.push(weaponSlotName)

    this.slots.add(Y_SLOT_1_OVER, weaponSlotName, weaponSlot.filter(v => v >= 1).length)
    this.slots.add(Y_SLOT_2_OVER, weaponSlotName, weaponSlot.filter(v => v >= 2).length)
    this.slots.add(Y_SLOT_3_OVER, weaponSlotName, weaponSlot.filter(v => v >= 3).length)
    this.slots.add(Y_SLOT_4_OVER, weaponSlotName, weaponSlot.filter(v => v >= 4).length)
  }

  addEquip(type: EquipsType, equip: Armor) {
    const name = `X/${type}/${equip.name}`

    // 個数制限
    this.binaries.push(name)

    this.equipLimits.add(typeRecord[type], name, 1)

    // TODO: 強化前防御力・属性耐性
    this.defs.add(Y_DEF_CUSTOM, name, equip.defs[1] || 0)

    this.slots.add(Y_SLOT_1_OVER, name, equip.slots.filter(v => v >= 1).length)
    this.slots.add(Y_SLOT_2_OVER, name, equip.slots.filter(v => v >= 2).length)
    this.slots.add(Y_SLOT_3_OVER, name, equip.slots.filter(v => v >= 3).length)
    this.slots.add(Y_SLOT_4_OVER, name, equip.slots.filter(v => v >= 4).length)

    for (const skillKey of this.skillKeys) {
      const value = equip.skills[skillKey] || 0
      this.skills.add(skillKey, name, value)
    }
  }

  addCharm(charm: Charm) {
    const type = 'charm'
    const name = `X/${type}/${charm.name}`

    // 個数制限
    this.binaries.push(name)

    this.equipLimits.add(typeRecord[type], name, 1)

    this.slots.add(Y_SLOT_1_OVER, name, charm.slots.filter(v => v >= 1).length)
    this.slots.add(Y_SLOT_2_OVER, name, charm.slots.filter(v => v >= 2).length)
    this.slots.add(Y_SLOT_3_OVER, name, charm.slots.filter(v => v >= 3).length)
    this.slots.add(Y_SLOT_4_OVER, name, charm.slots.filter(v => v >= 4).length)

    for (const skillKey of this.skillKeys) {
      const value = charm.skills[skillKey] || 0
      this.skills.add(skillKey, name, value)
    }
  }

  addDeco(deco: Deco) {
    const name = `${DECO_PREFIX}${deco.name}`

    // 個数制限 (整数)
    this.generals.push(name)

    this.slots.add(Y_SLOT_1_OVER, name, deco.size >= 1 ? -1 : 0)
    this.slots.add(Y_SLOT_2_OVER, name, deco.size >= 2 ? -1 : 0)
    this.slots.add(Y_SLOT_3_OVER, name, deco.size >= 3 ? -1 : 0)
    this.slots.add(Y_SLOT_4_OVER, name, deco.size >= 4 ? -1 : 0)

    for (const skillKey of this.skillKeys) {
      const value = deco.skills[skillKey] || 0
      this.skills.add(skillKey, name, value)
    }
  }

  sewObjectiveSkill(objectiveSkill: string | undefined) {
    this.objectiveSkill = objectiveSkill
  }

  setPrevs(prevs: Result[]) {
    this.prevs = prevs
  }

  private getLp() {
    const objective = {
      name: Y_DEF_CUSTOM,
      direction: GLP_MAX,
      vars: [
        ...this.objectiveSkill ? [{ name: this.objectiveSkill, coef: 100_000 }] : [],
        { name: Y_DEF_CUSTOM, coef: 100 },
        { name: Y_SLOT_1_OVER, coef: 1 },
      ],
    }

    const subjectTo = [
      ...this.equipLimits.toSubjectTo(),
      ...this.defs.toSubjectTo(),
      ...this.slots.toSubjectTo(),
      ...this.skills.toSubjectTo(),
      ...createSubject(this.skillCondition, GLP_LO),
      ...createIgnoreSubject(this.prevs),
    ]

    return {
      name: 'Lp',
      objective,
      subjectTo,
      binaries: this.binaries,
      generals: this.generals,
    }
  }

  solve(): Result | null {
    const { result } = glpk.solve(this.getLp())

    if (result.status === GLP_NOFEAS) {
      return null
    }

    const entries = Object.entries<number>(result.vars).filter(([key]) => result.vars[key])

    const head = findEquip('head', entries)
    const body = findEquip('body', entries)
    const arm = findEquip('arm', entries)
    const wst = findEquip('wst', entries)
    const leg = findEquip('leg', entries)
    const charm = findEquip('charm', entries)

    const deco = findDecoList(entries)

    return {
      weaponSlot: this.weaponSlot,
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
