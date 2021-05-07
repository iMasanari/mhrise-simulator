export const getDecos = async () => {
  const decos = await import('../../generated/deco.json').then(v => v.default)

  return decos
}
