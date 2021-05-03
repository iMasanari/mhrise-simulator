import { Slots } from './equips'
import { ActiveSkill } from './skill'

export interface Condition {
  weaponSlot: Slots
  skills: ActiveSkill
  ignore: string[]
  objectiveSkill?: string
}

export interface Result {
  weaponSlot: Slots
  head: string | undefined;
  body: string | undefined;
  arm: string | undefined;
  wst: string | undefined;
  leg: string | undefined;
  charm: string | undefined;
  deco: [string, number][];
}
