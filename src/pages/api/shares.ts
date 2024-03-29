import { FieldValue } from 'firebase-admin/firestore'
import { NextApiRequest, NextApiResponse } from 'next'
import { getArm, getBody, getHead, getLeg, getWst } from '../../api/armors'
import { getDecoInfo } from '../../api/decos'
import { firestore } from '../../api/firebase'
import { toEquip } from '../../domain/equips'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    res.status(405).json({ message: `Method ${req.method} Not Allowed` })

    return
  }

  // todo: エラーチェック
  const data = req.body

  const equip = toEquip({
    weaponSlots: data.weaponSlots || [],
    head: await getHead(data.head),
    body: await getBody(data.body),
    arm: await getArm(data.arm),
    wst: await getWst(data.wst),
    leg: await getLeg(data.leg),
    charm: data.charm,
    decos: (await Promise.all((data.decos as string[]).map(getDecoInfo))).filter(Boolean as unknown as <T>(v: T) => v is NonNullable<T>),
  })

  const result = await firestore.collection('shares').add({
    weaponSlots: equip.weaponSlots,
    head: equip.head?.name || null,
    body: equip.body?.name || null,
    arm: equip.arm?.name || null,
    wst: equip.wst?.name || null,
    leg: equip.leg?.name || null,
    charm: equip.charm || null,
    decos: equip.decos.map(deco => deco.name),
    skills: equip.skills,
    skillList: Object.keys(equip.skills),
    createdAt: FieldValue.serverTimestamp(),
  })

  res.status(200).json({ id: result.id })
}
