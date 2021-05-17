export const getDecos = async () => {
  const decos = await import('../../generated/deco.json').then(v => v.default)

  return decos
}

export const getDecoInfo = async (name: string) => {
  const decos = await import('../../generated/deco.json').then(v => v.default)

  return decos.find(v => v.name === name) || null
}
