import puppeteer from 'puppeteer-core'
import path from 'path'

const EDGE_PATH = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const OUT_DIR = 'C:/Users/Sree sisters/.gemini/antigravity-ide/brain/801d1ad7-9413-42df-9894-c62d6828d2aa'

async function run() {
  console.log('Launching Edge at 1440x900...')
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })

    // ----------------------------------------------------
    // FIX 1: LANGUAGE TOGGLE (EN & తె with active highlight and persistence)
    // ----------------------------------------------------
    console.log('Testing Fix 1: Language Toggle...')
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' })
    await page.evaluate(() => localStorage.setItem('sbloom_lang', 'en'))
    await page.reload({ waitUntil: 'networkidle0' })
    await new Promise(r => setTimeout(r, 600))

    // Screenshot Navbar in EN
    await page.screenshot({
      path: path.join(OUT_DIR, 'fix1_lang_toggle_en.png'),
      clip: { x: 0, y: 0, width: 1440, height: 120 }
    })

    // Click 'తె' button
    await page.evaluate(() => {
      const teBtn = document.querySelector('.lang-seg-btn.lang-seg-te')
      if (teBtn) teBtn.click()
    })
    await new Promise(r => setTimeout(r, 600))

    // Screenshot Navbar in తె
    await page.screenshot({
      path: path.join(OUT_DIR, 'fix1_lang_toggle_te.png'),
      clip: { x: 0, y: 0, width: 1440, height: 120 }
    })

    // Reload page to verify persistence of 'te' choice
    await page.reload({ waitUntil: 'networkidle0' })
    await new Promise(r => setTimeout(r, 600))
    await page.screenshot({
      path: path.join(OUT_DIR, 'fix1_lang_toggle_persisted_te.png'),
      clip: { x: 0, y: 0, width: 1440, height: 120 }
    })

    // Switch back to EN for English captures
    await page.evaluate(() => {
      const enBtn = document.querySelector('.lang-seg-btn:not(.lang-seg-te)')
      if (enBtn) enBtn.click()
    })
    await new Promise(r => setTimeout(r, 600))

    // ----------------------------------------------------
    // FIX 3: "SOUND FAMILIAR?" ENLARGED PHONE, ALTERNATING BUBBLES WITH AVATARS, AND REPLY BUBBLE
    // ----------------------------------------------------
    console.log('Testing Fix 3: Sound Familiar Chat...')
    const sfTop = await page.evaluate(() => {
      const el = document.getElementById('sound-familiar')
      return el ? el.offsetTop : 900
    })

    // Scroll down to reveal all 4 questions + reply bubble + closing line
    await page.evaluate((top) => window.scrollTo(0, top + 2150), sfTop)
    await new Promise(r => setTimeout(r, 800))
    await page.screenshot({ path: path.join(OUT_DIR, 'fix3_sound_familiar_chat_en.png') })

    // ----------------------------------------------------
    // FIX 2: HOW-IT-WORKS STEPPER (Step number on active step, ✓ on completed steps)
    // ----------------------------------------------------
    console.log('Testing Fix 2: How It Works Stepper...')
    const hiwTop = await page.evaluate(() => {
      const el = document.getElementById('how-it-works')
      return el ? el.offsetTop : 3200
    })

    // Step 1 Active (no completed steps: 1 active, 2, 3, 4 upcoming)
    await page.evaluate((top) => window.scrollTo(0, top + 150), hiwTop)
    await new Promise(r => setTimeout(r, 700))
    await page.screenshot({ path: path.join(OUT_DIR, 'fix2_stepper_step1_active.png') })

    // Step 2 Active (step 1 has ✓, step 2 has "2", 3 and 4 upcoming)
    await page.evaluate((top) => window.scrollTo(0, top + 850), hiwTop)
    await new Promise(r => setTimeout(r, 700))
    await page.screenshot({ path: path.join(OUT_DIR, 'fix2_stepper_step2_active.png') })

    // Step 3 Active (step 1 and 2 have ✓, step 3 has "3", 4 upcoming)
    await page.evaluate((top) => window.scrollTo(0, top + 1550), hiwTop)
    await new Promise(r => setTimeout(r, 700))
    await page.screenshot({ path: path.join(OUT_DIR, 'fix2_stepper_step3_active.png') })

    // Step 4 Active (step 1, 2, 3 have ✓, step 4 has "4")
    await page.evaluate((top) => window.scrollTo(0, top + 2300), hiwTop)
    await new Promise(r => setTimeout(r, 700))
    await page.screenshot({ path: path.join(OUT_DIR, 'fix2_stepper_step4_active.png') })

    // ----------------------------------------------------
    // TELUGU VERSIONS OF FIX 3 & FIX 2
    // ----------------------------------------------------
    console.log('Testing Telugu versions...')
    await page.evaluate(() => {
      const teBtn = document.querySelector('.lang-seg-btn.lang-seg-te')
      if (teBtn) teBtn.click()
    })
    await new Promise(r => setTimeout(r, 700))

    // Telugu Sound Familiar
    await page.evaluate((top) => window.scrollTo(0, top + 2150), sfTop)
    await new Promise(r => setTimeout(r, 800))
    await page.screenshot({ path: path.join(OUT_DIR, 'fix3_sound_familiar_chat_te.png') })

    // Telugu Stepper Step 3 Active
    await page.evaluate((top) => window.scrollTo(0, top + 1550), hiwTop)
    await new Promise(r => setTimeout(r, 800))
    await page.screenshot({ path: path.join(OUT_DIR, 'fix2_stepper_te_step3_active.png') })

    console.log('All screenshots captured successfully!')
  } finally {
    await browser.close()
  }
}

run().catch(console.error)
