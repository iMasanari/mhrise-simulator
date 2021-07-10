import { copyFile } from 'fs/promises'
import { getArmorData } from './converter/armors'
import { getDecos } from './converter/deco'
import { getSkills } from './converter/skill'
import { writeJson } from './util/fileUtil'

const main = async () => {
  const skills = await getSkills()

  writeJson('generated/skills.json', skills)

  const { head, body, arm, wst, leg, series } = await getArmorData()

  writeJson('generated/details/head.json', head.armor)
  writeJson('generated/details/body.json', body.armor)
  writeJson('generated/details/arm.json', arm.armor)
  writeJson('generated/details/wst.json', wst.armor)
  writeJson('generated/details/leg.json', leg.armor)

  copyFile('scripts/types/armors.d.ts', 'generated/details/head.json.d.ts')
  copyFile('scripts/types/armors.d.ts', 'generated/details/body.json.d.ts')
  copyFile('scripts/types/armors.d.ts', 'generated/details/arm.json.d.ts')
  copyFile('scripts/types/armors.d.ts', 'generated/details/wst.json.d.ts')
  copyFile('scripts/types/armors.d.ts', 'generated/details/leg.json.d.ts')

  writeJson('generated/simulator/head.json', head.simulatorArmor)
  writeJson('generated/simulator/body.json', body.simulatorArmor)
  writeJson('generated/simulator/arm.json', arm.simulatorArmor)
  writeJson('generated/simulator/wst.json', wst.simulatorArmor)
  writeJson('generated/simulator/leg.json', leg.simulatorArmor)

  copyFile('scripts/types/simulatorArmors.d.ts', 'generated/simulator/head.json.d.ts')
  copyFile('scripts/types/simulatorArmors.d.ts', 'generated/simulator/body.json.d.ts')
  copyFile('scripts/types/simulatorArmors.d.ts', 'generated/simulator/arm.json.d.ts')
  copyFile('scripts/types/simulatorArmors.d.ts', 'generated/simulator/wst.json.d.ts')
  copyFile('scripts/types/simulatorArmors.d.ts', 'generated/simulator/leg.json.d.ts')

  writeJson('generated/details/series.json', series)

  const decos = await getDecos()

  writeJson('generated/details/deco.json', decos.deco)
  copyFile('scripts/types/decos.d.ts', 'generated/details/deco.json.d.ts')

  writeJson('generated/simulator/deco.json', decos.simulatorDeco)
  copyFile('scripts/types/decos.d.ts', 'generated/simulator/deco.json.d.ts')
}

main()
