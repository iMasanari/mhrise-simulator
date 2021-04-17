import { Charm } from '../types/charms'
import { readCsv } from '../util/fileUtil'

export const getCharms = async () => {
  const csv = await readCsv('./lib/spreadsheets/charm.csv')

  const charm = csv.map((row): Charm => {
    const [名前, レア度, 入手時期, スキル系統1, スキル値1, スキル系統2, スキル値2, 生産素材A1, 個数A1, 生産素材A2, 個数A2, 生産素材A3, 個数A3, 生産素材A4, 個数A4, 前段階, 仮番号] = row

    const skillList = [
      [スキル系統1, +スキル値1],
      [スキル系統2, +スキル値2],
    ] as const

    const skills = Object.fromEntries(
      skillList.filter(([, point]) => point)
    )

    const materialList = [
      [生産素材A1, +個数A1],
      [生産素材A2, +個数A2],
      [生産素材A3, +個数A3],
      [生産素材A4, +個数A4],
    ] as const

    const materials = Object.fromEntries(
      materialList.filter(([, point]) => point)
    )

    return {
      name: 名前,
      skills,
      materials,
    }
  })

  const groups = new Set(charm.map(v => v.name.replace(/[Ⅰ-Ⅹ]/g, '')))

  const charmGroup = Array.from(groups, (name) => ({
    name,
    charms: charm.filter(v => v.name.startsWith(name)).map((v) => v.name),
  }))

  return { charm, charmGroup }
}
