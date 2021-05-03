import { ActiveSkill } from './skill'
import { WeaponSlot } from './weapon'

export interface Condition {
  weaponSlot: WeaponSlot
  skills: ActiveSkill
  ignore: string[]
  objectiveSkill?: string
}

export interface Result {
  weaponSlot: WeaponSlot
  head: string | undefined;
  body: string | undefined;
  arm: string | undefined;
  wst: string | undefined;
  leg: string | undefined;
  charm: string | undefined;
  deco: [string, number][];
}
