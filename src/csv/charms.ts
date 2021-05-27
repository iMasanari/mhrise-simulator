import { Charm } from '../domain/equips'

const tmp = ['', ''] as const

export const toCsv = (charms: Charm[], csvDelimiter: string) => {
  const list = charms.map(v => {
    const [[skill1, point1] = tmp, [skill2, point2] = tmp] = Object.entries(v.skills)
    const [slot1, slot2, slot3] = v.slots

    const row = [skill1, point1, skill2, point2, slot1 || 0, slot2 || 0, slot3 || 0]

    return row.join(csvDelimiter)
  })

  return list.join('\n')
}

export const toCharms = (text: string): Charm[] => {
  const list = text.split('\n').map(v => {
    const [skill1, point1, skill2, point2, slot1, slot2, slot3] = v.split(/,|\t/)

    const skills = Object.fromEntries(
      [[skill1, point1], [skill2, point2]]
        .map(([skill, point]) => [skill, Math.min(Math.max(0, +point), 7)] as const)
        .filter(([skill, point]) => skill && point)
    )

    const slots = [+slot1, +slot2, +slot3].filter(Boolean)

    return { skills, slots }
  })

  return list
}
