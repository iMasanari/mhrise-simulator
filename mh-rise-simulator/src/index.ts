import arm, { Armor } from '@i-masanari/mh-rise-data/dist/arm.json'
import body from '@i-masanari/mh-rise-data/dist/body.json'
import charm, { Charm } from '@i-masanari/mh-rise-data/dist/charm.json'
import deco from '@i-masanari/mh-rise-data/dist/deco.json'
import head from '@i-masanari/mh-rise-data/dist/head.json'
import leg from '@i-masanari/mh-rise-data/dist/leg.json'
import wst from '@i-masanari/mh-rise-data/dist/wst.json'
import Simulator, { EquipsType, Result } from './Simulator'

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

export interface Options {
  skill: Record<string, number>
  ignore: string[]
  limit?: number
}

export { Result }

export async function* calc({ skill, ignore, limit = 1 }: Options) {
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
