import { NextApiRequest, NextApiResponse } from 'next'
import { Deco } from '../../../generated/deco.json'
import { getArm, getBody, getHead, getLeg, getWst } from '../../api/armors'
import { getDecoInfo } from '../../api/decos'
import { FieldValue, firestore } from '../../api/firebase'
import { Armor, Charm } from '../../domain/equips'
import { ActiveSkill } from '../../domain/skill'

const getSkills = (armors: (Armor | null)[], charm: Charm | null, decos: (Deco | null)[]) => {
  const skills = {} as ActiveSkill

  // 防具スキル
  for (const value of armors) {
    if (!value) continue
    for (const [skill, point] of Object.entries(value.skills)) {
      skills[skill] = (skills[skill] || 0) + point
    }
  }

  // 風雷合一スキル対応
  if (skills['風雷合一'] > 4) {
    const point = skills['風雷合一'] - 3
    for (const skill of Object.keys(skills)) {
      if (skill === '風雷合一') continue
      skills[skill] = skills[skill] + point
    }
  }

  // 護石、装飾品スキル
  for (const value of [charm, ...decos]) {
    if (!value) continue
    for (const [skill, point] of Object.entries(value.skills)) {
      skills[skill] = (skills[skill] || 0) + point
    }
  }

  return skills
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    res.status(405).json({ message: `Method ${req.method} Not Allowed` })

    return
  }

  // todo: エラーチェック
  const data = req.body

  const head = await getHead(data.head)
  const body = await getBody(data.body)
  const arm = await getArm(data.arm)
  const wst = await getWst(data.wst)
  const leg = await getLeg(data.leg)
  const decos = await Promise.all((data.decos as string[]).map(getDecoInfo))

  const skills = getSkills([head, body, arm, wst, leg], data.charm, decos)
  const skillList = Object.keys(skills)

  const result = await firestore.collection('shares').add({
    ...req.body,
    charm: data.charm || { skills: {}, slots: [] },
    skills,
    skillList,
    createdAt: FieldValue.serverTimestamp(),
  })

  res.status(200).json({ id: result.id })
}
