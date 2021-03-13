export const getCharms = async () => {
  const charms = await import('@i-masanari/mh-rise-data/dist/charm.json').then(v => v.default)
  const groups = await import('@i-masanari/mh-rise-data/dist/charmGroup.json').then(v => v.default)

  const charmMap = new Map(charms.map(v => [v.name, v]))

  return groups.map(v => ({
    name: v.name,
    charms: v.charms.map(name => charmMap.get(name)!),
  }))
}
