import { NextApiRequest, NextApiResponse } from 'next'
import { getArm, getBody, getHead, getLeg, getWst } from '../../api/armors'
import { getDecoInfo } from '../../api/decos'
import { firestore } from '../../api/firebase'
import { Armor } from '../../domain/equips'
import { ActiveSkill } from '../../domain/skill'

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

  const skills = [head, body, arm, wst, leg, data.charm, ...decos].filter((v): v is Armor => v as any)
    .reduce((skills, v) => (
      Object.fromEntries([...Object.keys(skills), ...Object.keys(v.skills)].map(key => [key, (skills[key] || 0) + (v.skills[key] || 0)]))
    ), {} as ActiveSkill)

  const result = await firestore.collection('shares').add({
    ...req.body,
    skills,
  })

  res.status(200).json({ id: result.id })
}
