import PromiseWorker from 'promise-worker'
import arm from '../../generated/arm.json'
import body from '../../generated/body.json'
import deco from '../../generated/deco.json'
import head from '../../generated/head.json'
import leg from '../../generated/leg.json'
import wst from '../../generated/wst.json'
import { Armor, Charm, Deco, Equip, Slots } from '../domain/equips'
import { Condition, Result } from '../domain/simulator'
import { ActiveSkill } from '../domain/skill'

export interface SimulatorCondition {
  objectiveSkill?: string
  weaponSlot: Slots
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
  private stock: Equip[] = []
  private next: Equip[] = []

  constructor(worker: Worker, condition: Condition) {
    this.pw = new PromiseWorker(worker)

    const { objectiveSkill, weaponSlot } = condition
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
      weaponSlot,
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

  async simulate() {
    if (this.next.length) {
      await new Promise(requestAnimationFrame)

      return this.next.pop()!
    }

    const result = await this.pw.postMessage<Result | null, SimulatorCondition>(this.condition)

    if (!result) {
      if (this.stock.length) {
        this.next = this.stock
        this.stock = []

        return this.next.pop()!
      }

      return null
    }

    this.condition.prevs.push(result)

    const charm = this.groups.charm.get(result.charm)

    const decos = result.deco
      .map(([v, amount]) => [this.groups.deco.get(v)!, amount, v.split('').reverse().join('')] as const)
      .sort(([, , a], [, , b]) => b > a ? 1 : -1)
      .flatMap(([deco, amount]) => [...Array(amount).keys()].map(() => deco))

    const list: Equip[] = []

    // todo: 多重forをやめる
    for (const head of this.groups.head.get(result.head)!) {
      for (const body of this.groups.body.get(result.body)!) {
        for (const arm of this.groups.arm.get(result.arm)!) {
          for (const wst of this.groups.wst.get(result.wst)!) {
            for (const leg of this.groups.leg.get(result.leg)!) {
              const equip = [head, body, arm, wst, leg]
              const def = equip.reduce((sum, v) => sum + v.defs[1], 0)

              // 発動スキルは一旦ダミーをセット
              list.push({ def, weaponSlot: result.weaponSlot, head, body, arm, wst, leg, charm, decos, skills: {} })
            }
          }
        }
      }
    }

    // TODO: 装備なしを含むときの結果を正しく返す
    if (!list.length) {
      return null
    }

    const def = list.reduce((max, equip) => Math.max(max, equip.def), 0)
    const tmp = [...this.stock, ...list].sort((a, b) => a.def - b.def)

    this.next = tmp.filter(v => v.def >= def)
    this.stock = tmp.filter(v => v.def < def)

    const equip = this.next.pop()!

    // 発動スキルの計算
    const skills = [equip.head!, equip.body!, equip.arm!, equip.wst!, equip.leg!, ...(equip.charm ? [equip.charm] : []), ...equip.decos].reduce((s, v) => (
      Object.fromEntries([...Object.keys(s), ...Object.keys(v.skills)].map(key => [key, (s[key] || 0) + (v.skills[key] || 0)]))
    ), {} as ActiveSkill)

    return { ...equip, skills }
  }
}
