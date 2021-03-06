import fs from 'fs/promises'
import { Armor } from '../types/armors'
import { readCsv } from '../util/fileUtil'

export const getArmorData = async () => {
  const txt = await fs.readFile('./lib/series.txt', 'utf-8')

  const seriesList = txt.split('\n').map(name => {
    const [_, prefix, infix] = name.match(/^(.+?)・?(Ｓ|覇|$)/) || []
    const reg = new RegExp(`^${prefix}.*${infix}`)
    return { name, reg }
  })

  const [head, body, arm, wst, leg] = await Promise.all([
    getArmors('./lib/spreadsheets/head.csv', seriesList),
    getArmors('./lib/spreadsheets/body.csv', seriesList),
    getArmors('./lib/spreadsheets/arm.csv', seriesList),
    getArmors('./lib/spreadsheets/wst.csv', seriesList),
    getArmors('./lib/spreadsheets/leg.csv', seriesList),
  ])

  const armors = [head, body, arm, wst, leg]

  const series = seriesList.map(series => ({
    name: series.name,
    equips: armors.map(({ armor }) => armor.find(v => v.series === series.name)?.name || null),
  }))

  return { head, body, arm, wst, leg, series }
}

const getArmors = async (path: string, seriesList: { name: string, reg: RegExp }[]) => {
  const csv = await readCsv(path)

  const list = csv.map((row): Armor => {
    const [名前, 性別, レア度, スロット1, スロット2, スロット3, 入手時期, 初期防御力, 最終防御力, 火耐性, 水耐性, 雷耐性, 氷耐性, 龍耐性, スキル系統1, スキル値1, スキル系統2, スキル値2, スキル系統3, スキル値3, スキル系統4, スキル値4, スキル系統5, スキル値5, 生産素材1, 生産個数1, 生産素材2, 生産個数2, 生産素材3, 生産個数3, 生産素材4, 生産個数4, カスタム強化防御力, カスタム強化素材1, 個数1, カスタム強化素材2, 個数2, ワンセット防具, 仮番号] = row

    const skillList = [
      [スキル系統1, +スキル値1],
      [スキル系統2, +スキル値2],
      [スキル系統3, +スキル値3],
      [スキル系統4, +スキル値4],
      [スキル系統5, +スキル値5],
    ] as const

    const skills = Object.fromEntries(
      skillList.filter(([, point]) => point)
    )

    const materialList = [
      [生産素材1, +生産個数1],
      [生産素材2, +生産個数2],
      [生産素材3, +生産個数3],
      [生産素材4, +生産個数4],
    ] as const

    const materials = Object.fromEntries(
      materialList.filter(([, point]) => point)
    )

    const slots = [+スロット1, +スロット2, +スロット3].filter(Boolean)
    const series = seriesList.find(v => v.reg.test(名前))?.name!

    return {
      name: 名前,
      series,
      slots,
      defs: [+初期防御力, +最終防御力],
      elements: [+火耐性, +水耐性, +雷耐性, +氷耐性, +龍耐性],
      skills,
      materials,
    }
  })

  return { armor: list, simulatorArmor: list.map(({ materials, ...v }) => v) }
}
