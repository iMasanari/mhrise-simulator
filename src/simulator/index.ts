import PromiseWorker from 'promise-worker'
import arm from '../../generated/arm.json'
import body from '../../generated/body.json'
import deco from '../../generated/deco.json'
import head from '../../generated/head.json'
import leg from '../../generated/leg.json'
import wst from '../../generated/wst.json'
import { Armor, Charm, Deco, Slots, toEquip } from '../domain/equips'
import { Condition, Result } from '../domain/simulator'
import { ActiveSkill } from '../domain/skill'
import { NO_ARMOR_COEFFICIENT } from './constants'

export interface SimulatorCondition {
  objectiveSkill?: string
  weaponSlots: Slots
  head: Armor[]
  body: Armor[]
  arm: Armor[]
  wst: Armor[]
  leg: Armor[]
  charm: (Charm & { name: string })[]
  deco: Deco[]
  skills: ActiveSkill
  prevs: Result[]
  ignore?: string[]
}

interface Groups {
  head: Map<string | undefined, Armor[]>
  body: Map<string | undefined, Armor[]>
  arm: Map<string | undefined, Armor[]>
  wst: Map<string | undefined, Armor[]>
  leg: Map<string | undefined, Armor[]>
  charm: Map<string | undefined, Charm>
  deco: Map<string | undefined, Deco>
}

interface Stock {
  sortKey: number
  weaponSlots: Slots
  head: Armor | null
  body: Armor | null
  arm: Armor | null
  wst: Armor | null
  leg: Armor | null
  charm: Charm | null
  decos: Deco[]
}

const getKey = (armor: Armor | Charm, skillKeys: string[]) => {
  const slotHash = armor.slots.join('_')
  const skillHash = skillKeys.map(skillName => armor.skills[skillName] || 0).join('_')

  return `${slotHash}/${skillHash}`
}

const createEquipGroup = (skillKeys: string[], equips: Armor[], ignore: Set<string>) => {
  const list = equips.filter(equip => !ignore.has(equip.name))
    .map((equip) => [getKey(equip, skillKeys), equip] as const)

  const keys = [...new Set(list.map(([key]) => key))]

  const data = keys.map(key => {
    const armors = list.filter(([k]) => k === key)
      .map(([, v]) => v)
      .sort((a, b) => b.defs[1] - a.defs[1])

    return [{ ...armors[0], name: key }, armors] as const
  })

  return {
    armors: data.map(([data]) => data),
    map: new Map(data.map(([data, armors]) => [data.name, armors])),
  }
}

const createCharmGroup = (skillKeys: string[], charms: Charm[]) => {
  const list = charms.map((charm) => [getKey(charm, skillKeys), charm] as const)
  const keys = [...new Set(list.map(([key]) => key))]

  const data = keys.map((key) => {
    const [, charm] = list.find(([k]) => k === key)!

    return [key, charm] as const
  })

  return {
    charms: data.map(([key, charm]) => ({ ...charm, name: key })),
    map: new Map(data.map(([key, charm]) => [key, charm])),
  }
}

export default class Simulator {
  private pw: PromiseWorker
  private condition: SimulatorCondition
  private groups: Groups
  private stocks: Stock[] = []
  private next: Stock[] = []

  constructor(worker: Worker, condition: Condition) {
    this.pw = new PromiseWorker(worker)

    const { objectiveSkill, weaponSlots } = condition
    const skills = objectiveSkill ? { ...condition.skills, [objectiveSkill]: 0 } : condition.skills
    const skillKeys = Object.keys(skills)
    const ignore = new Set(condition.ignore || [])

    const headData = createEquipGroup(skillKeys, head, ignore)
    const bodyData = createEquipGroup(skillKeys, body, ignore)
    const armData = createEquipGroup(skillKeys, arm, ignore)
    const wstData = createEquipGroup(skillKeys, wst, ignore)
    const legData = createEquipGroup(skillKeys, leg, ignore)
    const charmData = createCharmGroup(skillKeys, condition.charms)

    this.condition = {
      objectiveSkill,
      skills,
      weaponSlots,
      head: headData.armors,
      body: bodyData.armors,
      arm: armData.armors,
      wst: wstData.armors,
      leg: legData.armors,
      charm: charmData.charms,
      deco: deco.filter(deco => !ignore.has(deco.name)),
      prevs: [],
    }

    this.groups = {
      head: headData.map,
      body: bodyData.map,
      arm: armData.map,
      wst: wstData.map,
      leg: legData.map,
      charm: charmData.map,
      deco: new Map(this.condition.deco.map(v => [v.name, v])),
    }
  }

  private getArmors(type: 'head' | 'body' | 'arm' | 'wst' | 'leg', key: string | undefined) {
    return this.groups[type].get(key) || [null]
  }

  private getCharm(key: string | undefined) {
    return this.groups.charm.get(key) || null
  }

  async simulate() {
    if (this.next.length) {
      await new Promise(requestAnimationFrame)

      const stock = this.next.pop()
      return stock ? toEquip(stock) : null
    }

    const result = await this.pw.postMessage<Result | null, SimulatorCondition>(this.condition)

    if (!result) {
      if (this.stocks.length) {
        this.next = this.stocks
        this.stocks = []

        const stock = this.next.pop()
        return stock ? toEquip(stock) : null
      }

      return null
    }

    this.condition.prevs.push(result)

    const charm = this.getCharm(result.charm)

    const decos = result.deco
      .map(([v, amount]) => [this.groups.deco.get(v)!, amount] as const)
      .sort(([a, aAmount], [b, bAmount]) => b.size - a.size || bAmount - aAmount)
      .flatMap(([deco, amount]) => Array<Deco>(amount).fill(deco))

    const list: Stock[] = []

    for (const head of this.getArmors('head', result.head)) {
      for (const body of this.getArmors('body', result.body)) {
        for (const arm of this.getArmors('arm', result.arm)) {
          for (const wst of this.getArmors('wst', result.wst)) {
            for (const leg of this.getArmors('leg', result.leg)) {
              const sortKey = [head, body, arm, wst, leg].reduce((sum, v) => sum + (v ? v.defs[1] : NO_ARMOR_COEFFICIENT), 0)

              list.push({ sortKey, weaponSlots: this.condition.weaponSlots, head, body, arm, wst, leg, charm, decos })
            }
          }
        }
      }
    }

    const border = list.reduce((max, equip) => Math.max(max, equip.sortKey), 0)
    const tmp = [...this.stocks, ...list]

    this.next = tmp.filter(v => v.sortKey >= border).sort((a, b) => a.sortKey - b.sortKey)
    this.stocks = tmp.filter(v => v.sortKey < border)

    const stock = this.next.pop()
    return stock ? toEquip(stock) : null
  }
}
