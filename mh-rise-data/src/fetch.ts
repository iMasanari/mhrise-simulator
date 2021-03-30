import fs from 'fs/promises'
import fetch from 'node-fetch'

const sheets = {
  head: 'https://docs.google.com/spreadsheets/d/1YPoMg-9e2MuppqIZum5lYi5H72aOb84IpGbFMRLxM1k/export?format=csv&gid=0',
  body: 'https://docs.google.com/spreadsheets/d/1Ac8zX4wuhYK17K-IEMNAoj5W6i6ZrtOcIm6CgtKa-Vs/export?format=csv&gid=0',
  arm: 'https://docs.google.com/spreadsheets/d/1Rfh-Dn7UHrd1TJxjvF1pjn7ph7-FdypSu52163O5Fx8/export?format=csv&gid=0',
  wst: 'https://docs.google.com/spreadsheets/d/1_70PiPzkUoZKCmbnGu6z-mB5ze_uMwl18rh6yA9DnW8/export?format=csv&gid=0',
  leg: 'https://docs.google.com/spreadsheets/d/18tYyKWKpzU4yQqf39jrGQOF2wvu3V9dpNPUFLFhKgw4/export?format=csv&gid=0',
  deco: 'https://docs.google.com/spreadsheets/d/1LUl_6ujLdTBSuHGlFosIFFclLin7qUpUKpzeZ4-nmSE/export?format=csv&gid=0',
  charm: 'https://docs.google.com/spreadsheets/d/1oR-l93PaPgeSuf-FPC9LRVOkcDEuTmGrXgteqS9DHEw/export?format=csv&gid=0',
  skill: 'https://docs.google.com/spreadsheets/d/1pKiITUuHzC_vfhunstQo2QhnEGlCLMYL29iOGPrfzAY/export?format=csv&gid=0',
}

const outDir = 'lib/spreadsheets'

const main = async () => {
  await fs.mkdir(outDir, { recursive: true })

  for (const [id, url] of Object.entries(sheets)) {
    const res = await fetch(url)
    const text = await res.text()

    await fs.writeFile(`${outDir}/${id}.csv`, text)
  }
}

main()
