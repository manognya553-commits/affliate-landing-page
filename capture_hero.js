import puppeteer from 'puppeteer-core'
import path from 'path'

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const OUT_DIR = 'C:\\Users\\Sree sisters\\.gemini\\antigravity-ide\\brain\\801d1ad7-9413-42df-9894-c62d6828d2aa'

async function run() {
  console.log('Launching browser at 1440x900...')
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })

    // ==========================================
    // 1. TELUGU MODE CAPTURES
    // ==========================================
    console.log('Navigating and setting Telugu mode...')
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' })
    await page.evaluate(() => {
      localStorage.setItem('sbloom_lang', 'te')
    })
    await page.reload({ waitUntil: 'networkidle0' })
    await new Promise((r) => setTimeout(r, 1200))

    // 1a. Telugu Hero (Verified fixes)
    const teHero = path.join(OUT_DIR, 'stage2_telugu_hero_1440.png')
    await page.screenshot({ path: teHero })
    console.log('Saved:', teHero)

    // 1b. Telugu "Sound familiar?"
    await page.evaluate(() => {
      const el = document.getElementById('sound-familiar')
      if (el) window.scrollTo(0, el.offsetTop - 40)
    })
    await new Promise((r) => setTimeout(r, 800))
    const teSoundFamiliar = path.join(OUT_DIR, 'stage2_telugu_sound_familiar_1440.png')
    await page.screenshot({ path: teSoundFamiliar })
    console.log('Saved:', teSoundFamiliar)

    // 1c. Telugu "How it works"
    await page.evaluate(() => {
      const el = document.getElementById('how-it-works')
      if (el) window.scrollTo(0, el.offsetTop - 40)
    })
    await new Promise((r) => setTimeout(r, 800))
    const teHowItWorks = path.join(OUT_DIR, 'stage2_telugu_how_it_works_1440.png')
    await page.screenshot({ path: teHowItWorks })
    console.log('Saved:', teHowItWorks)

    // 1d. Telugu Promises ("You introduce. The experts advise.")
    await page.evaluate(() => {
      const el = document.getElementById('promises')
      if (el) window.scrollTo(0, el.offsetTop - 40)
    })
    await new Promise((r) => setTimeout(r, 800))
    const tePromises = path.join(OUT_DIR, 'stage2_telugu_promises_1440.png')
    await page.screenshot({ path: tePromises })
    console.log('Saved:', tePromises)

    // ==========================================
    // 2. ENGLISH MODE CAPTURES
    // ==========================================
    console.log('Switching to English mode...')
    await page.evaluate(() => {
      window.scrollTo(0, 0)
      localStorage.setItem('sbloom_lang', 'en')
    })
    await page.reload({ waitUntil: 'networkidle0' })
    await new Promise((r) => setTimeout(r, 1200))

    // 2a. English "Sound familiar?"
    await page.evaluate(() => {
      const el = document.getElementById('sound-familiar')
      if (el) window.scrollTo(0, el.offsetTop - 40)
    })
    await new Promise((r) => setTimeout(r, 800))
    const enSoundFamiliar = path.join(OUT_DIR, 'stage2_english_sound_familiar_1440.png')
    await page.screenshot({ path: enSoundFamiliar })
    console.log('Saved:', enSoundFamiliar)

    // 2b. English "How it works"
    await page.evaluate(() => {
      const el = document.getElementById('how-it-works')
      if (el) window.scrollTo(0, el.offsetTop - 40)
    })
    await new Promise((r) => setTimeout(r, 800))
    const enHowItWorks = path.join(OUT_DIR, 'stage2_english_how_it_works_1440.png')
    await page.screenshot({ path: enHowItWorks })
    console.log('Saved:', enHowItWorks)

    // 2c. English Promises ("You introduce. The experts advise.")
    await page.evaluate(() => {
      const el = document.getElementById('promises')
      if (el) window.scrollTo(0, el.offsetTop - 40)
    })
    await new Promise((r) => setTimeout(r, 800))
    const enPromises = path.join(OUT_DIR, 'stage2_english_promises_1440.png')
    await page.screenshot({ path: enPromises })
    console.log('Saved:', enPromises)

    // ==========================================
    // 3. RESTORE DEFAULT TELUGU
    // ==========================================
    await page.evaluate(() => {
      window.scrollTo(0, 0)
      localStorage.setItem('sbloom_lang', 'te')
    })
    console.log('Restored default state to Telugu.')
  } finally {
    await browser.close()
    console.log('All captures complete.')
  }
}

run().catch((err) => {
  console.error('Error during capture:', err)
  process.exit(1)
})
