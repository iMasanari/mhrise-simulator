import fs from 'fs/promises'
import fetch from 'node-fetch'

const sheets = {
  skill: 'https://docs.google.com/spreadsheets/d/1FRATMC5CrzTKPMsBKuruR0Q6e6YvRyIJE092jDPuJjk/export?format=csv&gid=0',
}

const outDir = 'lib'

const main = async () => {
  await fs.mkdir(outDir, { recursive: true })

  for (const [id, url] of Object.entries(sheets)) {
    const res = await fetch(url)
    const text = await res.text()

    await fs.writeFile(`${outDir}/${id}.csv`, text)
  }
}

main()
