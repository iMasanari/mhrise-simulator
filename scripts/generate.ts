import { copyFile } from 'fs/promises'
import { getArmorData } from './converter/armors'
import { getDecos } from './converter/deco'
import { getSkills } from './converter/skill'
import { writeJson } from './util/fileUtil'

const main = async () => {
  const skills = await getSkills()

  writeJson('generated/skills.json', skills)

  const { head, body, arm, wst, leg, series } = await getArmorData()

  writeJson('generated/head.json', head)
  writeJson('generated/body.json', body)
  writeJson('generated/arm.json', arm)
  writeJson('generated/wst.json', wst)
  writeJson('generated/leg.json', leg)
  writeJson('generated/series.json', series)

  copyFile('scripts/types/armors.d.ts', 'generated/head.json.d.ts')
  copyFile('scripts/types/armors.d.ts', 'generated/body.json.d.ts')
  copyFile('scripts/types/armors.d.ts', 'generated/arm.json.d.ts')
  copyFile('scripts/types/armors.d.ts', 'generated/wst.json.d.ts')
  copyFile('scripts/types/armors.d.ts', 'generated/leg.json.d.ts')

  const decos = await getDecos()

  writeJson('generated/deco.json', decos)

  copyFile('scripts/types/decos.d.ts', 'generated/deco.json.d.ts')
}

main()
