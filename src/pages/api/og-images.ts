import chrome from 'chrome-aws-lambda'
import { NextApiRequest, NextApiResponse } from 'next'
import core from 'puppeteer-core'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import OgImage from '../../components/templates/OgImage'

const isDev = !process.env.AWS_REGION

const getLaunchOptions = async (isDev: boolean) => {
  if (isDev) {
    return {
      args: [],
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      headless: true,
    }
  } else {
    return {
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    }
  }
}

const getHtml = ({ equip }: { equip: any }) => {
  const element = React.createElement(OgImage, { equip })
  const markup = ReactDOMServer.renderToStaticMarkup(element)

  return `<!doctype html>${markup}`
}

const createSkills = (skills: string) =>
  skills ? Object.fromEntries(skills.split(',').map(v => v.split('Lv')).map(([key, value]) => [key, +value])) : {}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    res.status(405).json({ message: `Method ${req.method} Not Allowed` })

    return
  }

  try {
    const { weaponSlot, head, body, arm, wst, leg, charmSkills, charmSlots, decos, skills } = req.query as Record<string, string>

    const equip = {
      weaponSlot: weaponSlot.split(',').map(Number),
      head,
      body,
      arm,
      wst,
      leg,
      charm: {
        skills: createSkills(charmSkills),
        slots: charmSlots.split(',').map(Number),
      },
      decos: decos.split(','),
      skills: createSkills(skills),
    }

    const html = getHtml({ equip })
    const options = await getLaunchOptions(isDev)
    const browser = await core.launch(options)
    const page = await browser.newPage()

    await page.setViewport({ width: 1200, height: 630 })
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
