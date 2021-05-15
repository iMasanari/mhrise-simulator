export const getSeries = async () => {
  const head = await import('../../generated/head.json').then(v => v.default)
  const body = await import('../../generated/body.json').then(v => v.default)
  const arm = await import('../../generated/arm.json').then(v => v.default)
  const wst = await import('../../generated/wst.json').then(v => v.default)
  const leg = await import('../../generated/leg.json').then(v => v.default)
  const series = await import('../../generated/series.json').then(v => v.default)

  const headMap = new Map(head.map(v => [v.name, v]))
  const bodyMap = new Map(body.map(v => [v.name, v]))
  const armMap = new Map(arm.map(v => [v.name, v]))
  const wstMap = new Map(wst.map(v => [v.name, v]))
  const legMap = new Map(leg.map(v => [v.name, v]))

  return series.map(v => {
    const [headName, bodyName, armName, wstName, legName] = v.equips
    const head = headMap.get(headName!) || null
    const body = bodyMap.get(bodyName!) || null
    const arm = armMap.get(armName!) || null
    const wst = wstMap.get(wstName!) || null
    const leg = legMap.get(legName!) || null

    return { name: v.name, head, body, arm, wst, leg }
  })
}

export const findArmor = async (skill: string) => {
  const series = await getSeries()

  const result = series.map(v => {
    const head = v.head?.skills[skill]
    const body = v.body?.skills[skill]
    const arm = v.arm?.skills[skill]
    const wst = v.wst?.skills[skill]
    const leg = v.leg?.skills[skill]

    if (!head && !body && !arm && !wst && !leg) {
      return null
    }

    return [
      v.name,
      head ? { name: v.head!.name, point: head } : null,
      body ? { name: v.body!.name, point: body } : null,
      arm ? { name: v.arm!.name, point: arm } : null,
      wst ? { name: v.wst!.name, point: wst } : null,
      leg ? { name: v.leg!.name, point: leg } : null,
    ] as const
  })

  return result.filter(<T>(v: T | null): v is NonNullable<T> => v as any)
}
