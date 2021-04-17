import { SkillSystem } from '../domain/skill'

export const getSkillSystems = async () => {
  const skills = await import('../../generated/skills.json').then(v => v.default)

  const skillSystems = skills.map(({ name, category, details }): SkillSystem => ({
    name,
    category,
    items: details.map(v => v.point),
  }))

  return skillSystems
}

export const getSkills = async () => {
  const skills = await import('../../generated/skills.json').then(v => v.default)

  return skills
}
