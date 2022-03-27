import registerPromiseWorker from 'promise-worker/register'
import { Result } from '../domain/simulator'
import Solver from './Solver'
import { SimulatorCondition } from '.'

registerPromiseWorker<SimulatorCondition, Result | null>((condition) => {
  const solver = new Solver(condition.skills, condition.objectiveSkill)

  solver.setWeaponSlots(condition.weaponSlots)

  for (const type of ['head', 'body', 'arm', 'wst', 'leg'] as const) {
    for (const armor of Object.values(condition[type])) {
      solver.addArmor(type, armor)
    }
  }

  for (const charm of condition.charm) {
    solver.addCharm(charm)
  }

  for (const equip of condition.deco) {
    solver.addDeco(equip)
  }

  solver.addDecoLimits(condition.decoLimits)
  solver.setPrevs(condition.prevs)

  return solver.solve()
})
