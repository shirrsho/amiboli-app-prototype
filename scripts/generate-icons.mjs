// Generates PNG app icons with no external deps (pure Node + zlib).
// Draws a warm gradient rounded square with a white speech bubble + "A" mark.
// Run with: npm run icons
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../public/icons')
mkdirSync(OUT, { recursive: true })

// --- tiny PNG encoder (RGBA, 8-bit) ---
function crc32(buf) {
  let c = ~0
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i]
    for (let k = 0; k < 8; k++) c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1
  }
  return ~c >>> 0
}
function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const typeBuf = Buffer.from(type, 'ascii')
  const body = Buffer.concat([typeBuf, data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body), 0)
  return Buffer.concat([len, body, crc])
}
function encodePNG(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type RGBA
  // raw scanlines with filter byte 0
  const stride = width * 4
  const raw = Buffer.alloc((stride + 1) * height)
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride)
  }
  const idat = deflateSync(raw, { level: 9 })
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// --- drawing helpers ---
function lerp(a, b, t) {
  return a + (b - a) * t
}
function drawIcon(size, { maskable = false } = {}) {
  const rgba = Buffer.alloc(size * size * 4)
  const radius = maskable ? 0 : size * 0.22 // maskable = full bleed, no corners
  const c = size / 2
  // bubble geometry
  const bx = size * 0.22,
    by = size * 0.24,
    bw = size * 0.56,
    bh = size * 0.44,
    br = size * 0.1
  const set = (x, y, r, g, b, a = 255) => {
    const i = (y * size + x) * 4
    rgba[i] = r
    rgba[i + 1] = g
    rgba[i + 2] = b
    rgba[i + 3] = a
  }
  const inRoundRect = (x, y, rx, ry, rw, rh, rr) => {
    if (x < rx || x > rx + rw || y < ry || y > ry + rh) return false
    const dx = Math.min(x - rx, rx + rw - x)
    const dy = Math.min(y - ry, ry + rh - y)
    if (dx > rr || dy > rr) return true
    return (rr - dx) ** 2 + (rr - dy) ** 2 <= rr * rr
  }
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // background gradient (transparent outside rounded square)
      if (!inRoundRect(x, y, 0, 0, size, size, radius)) {
        set(x, y, 0, 0, 0, 0)
        continue
      }
      const t = (x + y) / (2 * size)
      let r = Math.round(lerp(255, 242, t))
      let g = Math.round(lerp(154, 115, t))
      let b = Math.round(lerp(51, 10, t))
      // white speech bubble
      if (inRoundRect(x, y, bx, by, bw, bh, br)) {
        r = g = b = 251
      }
      // little bubble tail
      const tailX = bx + bw * 0.28
      const tailY = by + bh
      if (y >= tailY && y < tailY + size * 0.1 && x >= tailX && x < tailX + (size * 0.1 - (y - tailY))) {
        r = g = b = 251
      }
      // "A" wedge inside bubble (simple triangle-ish glyph in brand orange)
      const ax = c
      const aTop = by + bh * 0.18
      const aBot = by + bh * 0.78
      if (y >= aTop && y <= aBot) {
        const prog = (y - aTop) / (aBot - aTop)
        const halfW = lerp(0, bw * 0.22, prog)
        const stroke = size * 0.028
        const leftEdge = ax - halfW
        const rightEdge = ax + halfW
        const onLeg =
          (Math.abs(x - leftEdge) < stroke || Math.abs(x - rightEdge) < stroke)
        const onBar = prog > 0.55 && prog < 0.68 && x > leftEdge && x < rightEdge
        if (onLeg || onBar) {
          r = 242
          g = 115
          b = 10
        }
      }
      set(x, y, r, g, b, 255)
    }
  }
  return encodePNG(size, size, rgba)
}

writeFileSync(resolve(OUT, 'icon-192.png'), drawIcon(192))
writeFileSync(resolve(OUT, 'icon-512.png'), drawIcon(512))
writeFileSync(resolve(OUT, 'icon-maskable-512.png'), drawIcon(512, { maskable: true }))
console.log('✓ Generated icons in public/icons/')
