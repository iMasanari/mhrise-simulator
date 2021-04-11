import { GLP_FX } from './constants/glpk'

export default class Subject<T extends string> {
  private map: Map<string, Map<string, number>>

  constructor(types: T[]) {
    this.map = new Map(types.map(type => [type, new Map()]))
  }

  add(type: T, name: string, coef: number) {
    if (!coef) return

    this.map.get(type)!.set(name, coef)
  }

  toSubjectTo() {
    return [...this.map].map(([type, data]) => ({
      name: type,
      vars: [
        { name: type, coef: -1 },
        ...[...data].map(([name, coef]) => ({ name, coef })),
      ],
      bnds: { type: GLP_FX, ub: 0, lb: 0 },
    }))
  }
}
