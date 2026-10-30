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

    // ----------------------------------------------------
    // 1. TABLET VIEWPORT (768x1024)
    // ----------------------------------------------------
    console.log('Capturing Tablet (768x1024)...')
    await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 1 })
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' })
    await new Promise(r => setTimeout(r, 600))
    await page.screenshot({ path: path.join(OUT_DIR, 'audit_tablet_hero_768.png') })

    // Tablet Sound Familiar (Natural scroll into view)
    await page.evaluate(() => {
      document.getElementById('sound-familiar')?.scrollIntoView({ behavior: 'instant', block: 'start' })
    })
    await new Promise(r => setTimeout(r, 600))
    await page.screenshot({ path: path.join(OUT_DIR, 'audit_tablet_sound_familiar_768.png') })

    // Tablet How It Works (Natural scroll into view)
    await page.evaluate(() => {
      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'instant', block: 'start' })
    })
    await new Promise(r => setTimeout(r, 600))
    await page.screenshot({ path: path.join(OUT_DIR, 'audit_tablet_hiw_768.png') })

    // Tablet Promises (Natural scroll into view)
    await page.evaluate(() => {
      document.getElementById('promises')?.scrollIntoView({ behavior: 'instant', block: 'start' })
    })
    await new Promise(r => setTimeout(r, 600))
    await page.screenshot({ path: path.join(OUT_DIR, 'audit_tablet_promises_768.png') })

    // ----------------------------------------------------
    // 2. MOBILE VIEWPORT (375x812) - iPhone 13/14 size
    // ----------------------------------------------------
    console.log('Capturing Mobile (375x812)...')
    await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 })
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' })
    await new Promise(r => setTimeout(r, 600))
    await page.screenshot({ path: path.join(OUT_DIR, 'audit_mobile_hero_375.png') })

    // Mobile Sound Familiar
    await page.evaluate(() => {
      document.getElementById('sound-familiar')?.scrollIntoView({ behavior: 'instant', block: 'start' })
    })
    await new Promise(r => setTimeout(r, 600))
    await page.screenshot({ path: path.join(OUT_DIR, 'audit_mobile_sf_375.png') })

    // Mobile How It Works
    await page.evaluate(() => {
      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'instant', block: 'start' })
    })
    await new Promise(r => setTimeout(r, 600))
    await page.screenshot({ path: path.join(OUT_DIR, 'audit_mobile_hiw_375.png') })

    // Mobile Promises
    await page.evaluate(() => {
      document.getElementById('promises')?.scrollIntoView({ behavior: 'instant', block: 'start' })
    })
    await new Promise(r => setTimeout(r, 600))
    await page.screenshot({ path: path.join(OUT_DIR, 'audit_mobile_promises_375.png') })

    // Mobile Footer
    await page.evaluate(() => {
      document.querySelector('.site-footer')?.scrollIntoView({ behavior: 'instant', block: 'start' })
    })
    await new Promise(r => setTimeout(r, 600))
    await page.screenshot({ path: path.join(OUT_DIR, 'audit_mobile_footer_375.png') })

    console.log('All responsive screenshots updated with scrollIntoView!')
  } finally {
    await browser.close()
  }
}

run().catch(console.error)
