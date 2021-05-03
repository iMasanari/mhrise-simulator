export interface SkillSystem {
  name: string
  category: string
  items: number[]
}

export type ActiveSkill = Record<string, number>
