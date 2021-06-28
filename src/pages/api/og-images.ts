import fs from 'fs/promises'
import path from 'path'
import { NextApiRequest, NextApiResponse } from 'next'
import sharp from 'sharp'

path.resolve(process.cwd(), 'src', 'assets', 'og-images', 'fonts.conf')
path.resolve(process.cwd(), 'src', 'assets', 'og-images', 'Noto_Sans_JP', 'NotoSansJP-Regular.otf')

const svgPath = path.resolve(process.cwd(), 'src', 'assets', 'og-images', 'template.svg')

const showSlots = (slots: string | null) =>
  `スロット${slots?.split(',').map(v => `【${v}】`).join('') || 'なし'}`

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    res.status(405).json({ message: `Method ${req.method} Not Allowed` })

    return
  }

  try {
    const { weaponSlots, head, body, arm, wst, leg, charmSkills, charmSlots, skills } = req.query as Record<string, string>

    const weapon = showSlots(weaponSlots)
    const charmList = [...(charmSkills?.split(',') || []), showSlots(charmSlots)]
    const skillList = skills?.split(',') || []

    const mapping = new Map<string, string>([
      ...Object.entries({ weapon, head, body, arm, wst, leg }).map(([key, value]) => [`{{${key}}}`, value] as const),
      ...[...Array(3).keys()].map(i => [`{{charm${i + 1}}}`, charmList[i]] as const),
      ...[...Array(20).keys()].map(i => [`{{skill${i + 1}}}`, skillList[i]] as const),
    ])

    const svg = await fs.readFile(svgPath, 'utf-8')
    const reg = new RegExp([...mapping.keys()].join('|'), 'g')
    const ogp = svg.replace(reg, v => mapping.get(v) || '')

    const buffer = await sharp(Buffer.from(ogp)).png().toBuffer()

    const chacheAge = 2 * 7 * 24 * 60 * 60 // 2週間

    res.setHeader('Cache-Control', `s-maxage=${chacheAge}, stale-while-revalidate`)
    res.setHeader('Content-Type', 'image/png')

    res.end(buffer)
  } catch (error) {
    console.error('[Error]: ', error)
    res.status(404).json({ message: 'Cannot render og-image' })
  }
}
