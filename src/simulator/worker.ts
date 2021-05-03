import registerPromiseWorker from 'promise-worker/register'
import { Result } from '../domain/simulator'
import Solver from './Solver'
import { SimulatorCondition } from '.'

registerPromiseWorker<SimulatorCondition, Result | null>((condition) => {
  const solver = new Solver(condition.skills, condition.weaponSlot)

  for (const type of ['head', 'body', 'arm', 'wst', 'leg'] as const) {
    for (const equip of Object.values(condition[type])) {
      solver.addEquip(type, equip)
    }
  }

  for (const equip of condition.deco) {
    solver.addDeco(equip)
  }

  solver.sewObjectiveSkill(condition.objectiveSkill)
  solver.setPrevs(condition.prevs)

  return solver.solve()
})

// for Webpack worker-loader
export default null! as { new(): Worker }
