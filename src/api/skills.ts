export const getSkills = async () => {
  const skills = await import('../../generated/skills.json').then(v => v.default)

  return skills
}
