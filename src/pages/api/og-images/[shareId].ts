import fs from 'fs'
import path from 'path'
import { NextApiRequest, NextApiResponse } from 'next'
import { launchChromium } from 'playwright-aws-lambda'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { getArm, getBody, getHead, getLeg, getWst } from '../../../api/armors'
import { getDecoInfo } from '../../../api/decos'
import { firestore } from '../../../api/firebase'
import OgImage from '../../../components/templates/OgImage'
import { Deco, Equip } from '../../../domain/equips'

const isDev = !process.env.AWS_REGION

const getLaunchOptions = (isDev: boolean) => {
  if (isDev) {
    return {
      args: [],
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      headless: true,
    }
  } else {
    return {}
  }
}

const getHtml = ({ equip }: { equip: Equip }) => {
  const fontPath = path.resolve(process.cwd(), './src/assets/fonts/Noto_Sans_JP/NotoSansJP-Regular.woff')
  const font = fs.readFileSync(fontPath, { encoding: 'base64' })

  const element = React.createElement(OgImage, { equip, font })
  const markup = ReactDOMServer.renderToStaticMarkup(element)

  return `<!doctype html><html><body>${markup}</body></html>`
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    res.status(405).json({ message: `Method ${req.method} Not Allowed` })

    return
  }

  try {
    const shareId = req.query.shareId as string
    const doc = await firestore.collection('shares').doc(shareId).get()

    if (!doc.exists) {
      throw new Error(`${shareId} is not found`)
    }

    const data = doc.data()!
    const equip: Equip = {
      weaponSlot: data.weaponSlots,
      head: await getHead(data.head),
      body: await getBody(data.body),
      arm: await getArm(data.arm),
      wst: await getWst(data.wst),
      leg: await getLeg(data.leg),
      charm: data.charm,
      decos: await Promise.all(data.decos.map(getDecoInfo)) as Deco[],
      def: 0,
      skills: data.skills,
    }

    const html = getHtml({ equip })
    const viewport = { width: 1200, height: 630 }
    const launchOptions = getLaunchOptions(isDev)
    const browser = await launchChromium(launchOptions)
    const page = await browser.newPage({ viewport })

    await page.setContent(html, { waitUntil: 'domcontentloaded' })
    await page.evaluateHandle('document.fonts.ready')

    const buffer = await page.screenshot({ type: 'png' })
    await browser.close()

    const chacheAge = 2 * 7 * 24 * 60 * 60 // 2週間

    res.setHeader('Cache-Control', `s-maxage=${chacheAge}, stale-while-revalidate`)
    res.setHeader('Content-Type', 'image/png')

    res.end(buffer)
  } catch (error) {
    console.error('[Error]: ', error)
    res.status(404).json({ message: 'Cannot render og-image' })
  }
}
