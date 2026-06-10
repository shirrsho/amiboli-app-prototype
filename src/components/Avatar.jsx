// Initials avatar. Sizes are tailwind-friendly numbers (rem*4 px).
export default function Avatar({ initials, color = '#FF8A1F', size = 40, ring = false }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-display font-extrabold text-white ${
        ring ? 'ring-2 ring-white' : ''
      }`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}, ${shade(color, -18)})`,
        fontSize: size * 0.4,
      }}
    >
      {initials}
    </div>
  )
}

// Darken/lighten a hex color by percent (-100..100).
function shade(hex, percent) {
  const n = parseInt(hex.slice(1), 16)
  const t = percent < 0 ? 0 : 255
  const p = Math.abs(percent) / 100
  const r = Math.round((t - (n >> 16)) * p) + (n >> 16)
  const g = Math.round((t - ((n >> 8) & 0xff)) * p) + ((n >> 8) & 0xff)
  const b = Math.round((t - (n & 0xff)) * p) + (n & 0xff)
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}
