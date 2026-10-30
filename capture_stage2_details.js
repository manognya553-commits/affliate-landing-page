import puppeteer from 'puppeteer-core'
import path from 'path'

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const OUT_DIR = 'C:\\Users\\Sree sisters\\.gemini\\antigravity-ide\\brain\\801d1ad7-9413-42df-9894-c62d6828d2aa'

async function capture() {
  console.log('Launching browser...')
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })

    for (const lang of ['en', 'te']) {
      console.log(`\nCapturing in ${lang.toUpperCase()}...`)
      await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' })
      await page.evaluate((l) => {
        localStorage.setItem('sbloom_lang', l)
      }, lang)
      await page.reload({ waitUntil: 'networkidle0' })
      await new Promise(r => setTimeout(r, 1000))

      // 1. Hero
      await page.screenshot({ path: path.join(OUT_DIR, `stage2_${lang}_01_hero.png`) })

      // 2. Sound familiar - stepped scroll
      const sfOffset = await page.evaluate(() => {
        const el = document.getElementById('sound-familiar')
        return el ? el.offsetTop : 900
      })

      // Step 1 bubble
      await page.evaluate((top) => window.scrollTo(0, top + 350), sfOffset)
      await new Promise(r => setTimeout(r, 600))
      await page.screenshot({ path: path.join(OUT_DIR, `stage2_${lang}_02_sound_familiar_step1.png`) })

      // Step 2 & 3 bubbles
      await page.evaluate((top) => window.scrollTo(0, top + 900), sfOffset)
      await new Promise(r => setTimeout(r, 600))
      await page.screenshot({ path: path.join(OUT_DIR, `stage2_${lang}_03_sound_familiar_step2_3.png`) })

      // Step 4 & closing line
      await page.evaluate((top) => window.scrollTo(0, top + 1800), sfOffset)
      await new Promise(r => setTimeout(r, 600))
      await page.screenshot({ path: path.join(OUT_DIR, `stage2_${lang}_04_sound_familiar_closing.png`) })

      // 3. Stepper - How it works
      const howOffset = await page.evaluate(() => {
        const el = document.getElementById('how-it-works')
        return el ? el.offsetTop : 3000
      })

      // Stepper Step 1: Form (1 of 3)
      await page.evaluate((top) => window.scrollTo(0, top + 200), howOffset)
      await new Promise(r => setTimeout(r, 600))
      await page.screenshot({ path: path.join(OUT_DIR, `stage2_${lang}_05_stepper_step1_form.png`) })

      // Stepper Step 2: Plain-language service brief
      await page.evaluate((top) => window.scrollTo(0, top + 900), howOffset)
      await new Promise(r => setTimeout(r, 600))
      await page.screenshot({ path: path.join(OUT_DIR, `stage2_${lang}_06_stepper_step2_brief.png`) })

      // Stepper Step 3: Introduction with "They said yes" toggle
      await page.evaluate((top) => window.scrollTo(0, top + 1600), howOffset)
      await new Promise(r => setTimeout(r, 600))
      await page.screenshot({ path: path.join(OUT_DIR, `stage2_${lang}_07_stepper_step3_intro.png`) })

      // Stepper Step 4: Referral tracker with status chips
      await page.evaluate((top) => window.scrollTo(0, top + 2300), howOffset)
      await new Promise(r => setTimeout(r, 600))
      await page.screenshot({ path: path.join(OUT_DIR, `stage2_${lang}_08_stepper_step4_tracker.png`) })

      // 4. Promises cards with drawn SVG icons
      const promisesOffset = await page.evaluate(() => {
        const el = document.getElementById('promises')
        return el ? el.offsetTop : 5800
      })
      await page.evaluate((top) => window.scrollTo(0, top - 30), promisesOffset)
      await new Promise(r => setTimeout(r, 1200)) // Wait for draw animation
      await page.screenshot({ path: path.join(OUT_DIR, `stage2_${lang}_09_promises_drawn.png`) })
    }

    console.log('All detailed screenshots captured successfully!')
  } finally {
    await browser.close()
  }
}

capture().catch(console.error)
