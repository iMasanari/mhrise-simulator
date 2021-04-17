import { readCsv } from '../util/fileUtil'

export const getDecos = async () => {
  const csv = await readCsv('./lib/spreadsheets/deco.csv')

  const result = csv.map((row) => {
    const [名前, レア度, スロットサイズ, 入手時期, スキル系統1, スキル値1, スキル系統2, スキル値2, 生産素材1, 個数1, 生産素材2, 個数2, 生産素材3, 個数3, 生産素材4, 個数4, 仮番号] = row

    const skillList = [
      [スキル系統1, +スキル値1],
      [スキル系統2, +スキル値2],
    ] as const

    const skills = Object.fromEntries(
      skillList.filter(([, point]) => point)
    )

    const materialList = [
      [生産素材1, +個数1],
      [生産素材2, +個数2],
      [生産素材3, +個数3],
      [生産素材4, +個数4],
    ] as const

    const materials = Object.fromEntries(
      materialList.filter(([, point]) => point)
    )

    return {
      name: 名前,
      skills,
      size: +スロットサイズ,
      materials,
    }
  })

  return result
}
