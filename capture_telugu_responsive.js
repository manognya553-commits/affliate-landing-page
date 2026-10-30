import puppeteer from 'puppeteer-core'
import path from 'path'

const EDGE_PATH = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const OUT_DIR = 'C:/Users/Sree sisters/.gemini/antigravity-ide/brain/801d1ad7-9413-42df-9894-c62d6828d2aa'

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  try {
    const page = await browser.newPage()

    // 1. Tablet Telugu (768x1024)
    console.log('Capturing Tablet Telugu...')
    await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 1 })
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' })
    await page.evaluate(() => localStorage.setItem('sbloom_lang', 'te'))
    await page.reload({ waitUntil: 'networkidle0' })
    await new Promise(r => setTimeout(r, 600))
    await page.screenshot({ path: path.join(OUT_DIR, 'audit_tablet_telugu_hero_768.png') })

    await page.evaluate(() => {
      document.getElementById('sound-familiar')?.scrollIntoView({ behavior: 'instant', block: 'start' })
    })
    await new Promise(r => setTimeout(r, 600))
    await page.screenshot({ path: path.join(OUT_DIR, 'audit_tablet_telugu_sf_768.png') })

    // 2. Mobile Telugu (375x812)
    console.log('Capturing Mobile Telugu...')
    await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 })
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' })
    await new Promise(r => setTimeout(r, 600))
    await page.screenshot({ path: path.join(OUT_DIR, 'audit_mobile_telugu_hero_375.png') })

    await page.evaluate(() => {
      document.getElementById('sound-familiar')?.scrollIntoView({ behavior: 'instant', block: 'start' })
    })
    await new Promise(r => setTimeout(r, 600))
    await page.screenshot({ path: path.join(OUT_DIR, 'audit_mobile_telugu_sf_375.png') })

    console.log('Telugu responsive captures complete!')
  } finally {
    await browser.close()
  }
}

run().catch(console.error)
