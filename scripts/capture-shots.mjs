// Capture phone screenshots of the deployed prototype for the handoff PDF.
// Uses system Chrome via puppeteer-core (no bundled browser).
import puppeteer from 'puppeteer-core'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const BASE = 'https://amiboli-app-prototype.vercel.app/#'
const OUT = '/tmp/amiboli_shots'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const SHOTS = [
  { name: 'splash', path: '/', wait: 1100 },
  { name: 'onboarding', path: '/onboarding', wait: 2200 },
  { name: 'auth', path: '/auth', wait: 2200 },
  { name: 'home', path: '/home', wait: 2600, settle: true },
  { name: 'book', path: '/book/scarlet', wait: 2400, settle: true },
  { name: 'play', path: '/play/scarlet/sc5', wait: 2200, advancePlay: true },
  { name: 'score', path: '/score/scarlet/sc5', wait: 3000, settle: true },
  { name: 'store', path: '/store', wait: 2400, settle: true },
  { name: 'leaderboard', path: '/leaderboard', wait: 2400, settle: true },
  { name: 'profile', path: '/profile', wait: 2400, settle: true },
  { name: 'plans', path: '/plans', wait: 2400, settle: true },
]

// nudge every scrollable so framer's whileInView animations fire
const SETTLE = () => {
  const els = [document.scrollingElement, ...document.querySelectorAll('*')].filter(
    (e) => e && e.scrollHeight > e.clientHeight
  )
  els.forEach((e) => {
    e.scrollTop += 4
    e.dispatchEvent(new Event('scroll', { bubbles: true }))
    e.scrollTop -= 4
    e.dispatchEvent(new Event('scroll', { bubbles: true }))
  })
  window.dispatchEvent(new Event('scroll'))
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  defaultViewport: { width: 420, height: 890, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  args: ['--hide-scrollbars'],
})

for (const s of SHOTS) {
  const page = await browser.newPage()
  await page.goto(BASE + s.path, { waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {})
  await sleep(s.wait)

  if (s.advancePlay) {
    // step the scene forward until the user's turn (mic mode) appears
    for (let i = 0; i < 16; i++) {
      const atMic = await page.$('button[aria-label="Start speaking"]')
      if (atMic) break
      await page.evaluate(() => {
        const panel = [...document.querySelectorAll('div')].find((d) =>
          (d.className || '').includes('rounded-t-3xl')
        )
        panel?.click()
      })
      await sleep(280)
      await page.evaluate(() => {
        const panel = [...document.querySelectorAll('div')].find((d) =>
          (d.className || '').includes('rounded-t-3xl')
        )
        panel?.click()
      })
      await sleep(650)
    }
    await sleep(600)
  }

  if (s.settle) {
    await page.evaluate(SETTLE)
    await sleep(1100)
  }

  await page.screenshot({ path: `${OUT}/${s.name}.png` })
  console.log('✓', s.name)
  await page.close()
}

await browser.close()
console.log('done')
