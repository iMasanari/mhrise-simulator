import { copyFile } from 'fs/promises'
import { getArmorData } from './converter/armors'
import { getSkills } from './converter/skill'
import { writeJson } from './util/fileUtil'

const main = async () => {
  const skills = await getSkills()

  writeJson('dist/skills.json', skills)

  const { head, body, arm, wst, leg, series } = await getArmorData()

  writeJson('dist/head.json', head)
  writeJson('dist/body.json', body)
  writeJson('dist/arm.json', arm)
  writeJson('dist/wst.json', wst)
  writeJson('dist/leg.json', leg)
  writeJson('dist/series.json', series)

  copyFile('src/types/armors.d.ts', 'dist/head.json.d.ts')
  copyFile('src/types/armors.d.ts', 'dist/body.json.d.ts')
  copyFile('src/types/armors.d.ts', 'dist/arm.json.d.ts')
  copyFile('src/types/armors.d.ts', 'dist/wst.json.d.ts')
  copyFile('src/types/armors.d.ts', 'dist/leg.json.d.ts')
}

main()
