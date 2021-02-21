import { readCsv, writeJson } from './util/fileUtil'

const main = async () => {
  const csv = await readCsv('./lib/skill.csv')

  const skillData = csv.map(([スキル系統, 発動スキル, 必要ポイント, カテゴリ, 効果, 系統番号, 仮番号]) =>
    ({ スキル系統, 発動スキル, 必要ポイント, カテゴリ, 効果, 系統番号, 仮番号 })
  )

  const skillNames = [...new Set(skillData.map(v => v.スキル系統))]
  const skills = skillNames.map(name => {
    const details = skillData.filter(v => v.スキル系統 === name)

    return {
      name,
      category: details[0].カテゴリ,
      details: details.map(v => ({
        name: v.発動スキル,
        point: +v.必要ポイント,
        description: v.効果,
      })),
    }
  })

  writeJson('dist/skills.json', skills)
}

main()
