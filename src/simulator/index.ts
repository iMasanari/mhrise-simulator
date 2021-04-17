import arm from '../../generated/arm.json'
import body from '../../generated/body.json'
import deco from '../../generated/deco.json'
import head from '../../generated/head.json'
import leg from '../../generated/leg.json'
import wst from '../../generated/wst.json'
import { Armor } from '../domain/equips'
import { Condition } from '../domain/simulator'
import Simulator, { EquipsType } from './Simulator'

const getKey = (armor: Armor, skillKeys: string[]) => {
  const slotHash = armor.slots.join('/')
  const skillHash = skillKeys.map(skillName => armor.skills[skillName] || 0).join('/')

  return `${slotHash}\n${skillHash}`
}

const normalizeEquip = (skillKeys: string[], equips: Armor[], ignore: Set<string>) =>
  Object.fromEntries(
    Object.values(equips)
      .filter(equip => !ignore.has(equip.name))
      .map((equip) => [getKey(equip, skillKeys), equip])
  )

export async function* calc({ skill, ignore, limit = 1 }: Condition) {
  const skillKeys = Object.keys(skill)
  const simulator = new Simulator(skill)
  const ignoreSet = new Set(ignore)

  for (const [type, equips] of Object.entries({ head, body, arm, wst, leg })) {
    const list = normalizeEquip(skillKeys, equips, ignoreSet)

    for (const equip of Object.values(list)) {
      simulator.addEquip(type as EquipsType, equip)
    }
  }

  for (const equip of deco) {
    simulator.addDeco(equip)
  }

  for (let i = 0; i < limit; i++) {
    const result = await simulator.solve()

    if (!result) {
      break
    }

    yield result

    simulator.ignoreResult(result)
  }
}
