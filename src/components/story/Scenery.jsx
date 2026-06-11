import { motion } from 'framer-motion'

// Static themed backdrop: gradient sky + layered hand-rolled SVG silhouettes.
// No parallax. At most ONE ambient effect (theme.ambient), and only when the
// `ambient` prop is true — the Home feed renders scenery without it.
export default function Scenery({ theme, ambient = false }) {
  const p = theme.palette
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ background: `linear-gradient(180deg, ${p.bg} 0%, ${p.bgDeep} 100%)` }}
      aria-hidden
    >
      {theme.scenery === 'london' && <London />}
      {theme.scenery === 'rail' && <Rail accent={p.accent} />}
      {theme.scenery === 'southern' && <Southern />}

      {ambient && theme.ambient === 'fog' && <Fog />}
      {ambient && theme.ambient === 'streaks' && <Streaks accent={p.accent} />}
      {ambient && theme.ambient === 'fireflies' && <Fireflies />}
    </div>
  )
}

// ── Foggy Victorian London: moon, rooftop bands, two gas lamps ──────────────
function London() {
  return (
    <>
      {/* moon + halo */}
      <div
        className="absolute right-4 top-12 h-36 w-36 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(245,236,215,0.16), transparent 65%)' }}
      />
      <div
        className="absolute right-14 top-[5.5rem] h-12 w-12 rounded-full"
        style={{ background: 'radial-gradient(circle at 38% 35%, #f7efdb, #ded0a8 70%)' }}
      />
      {/* distant rooftops */}
      <svg viewBox="0 0 430 110" preserveAspectRatio="none" className="absolute inset-x-0 bottom-[18%] block w-full" style={{ height: 100 }}>
        <path
          d="M0,110 L0,72 h24 l8,-18 8,18 h18 v-26 h8 v-12 h6 v12 h9 v26 h30 l14,-26 14,26 h24 v-34 h8 v-12 h6 v12 h8 v34 h34 l10,-16 10,16 h28 v-22 h26 l12,-24 12,24 h20 v-15 h7 v-10 h5 v10 h9 v15 h32 l13,-22 13,22 h26 v-30 h7 v-10 h6 v10 h8 v30 h22 L430,72 L430,110 Z"
          fill="#0a0e18"
          opacity="0.8"
        />
      </svg>
      {/* near rooftops at street level */}
      <svg viewBox="0 0 430 140" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 block w-full" style={{ height: 120 }}>
        <path
          d="M0,140 L0,66 h36 l16,-30 16,30 h20 v-36 h10 v-16 h8 v16 h12 v36 h44 l20,-40 20,40 h30 v-28 h12 v-18 h8 v18 h12 v28 h48 l14,-24 14,24 h34 v-44 h12 v-14 h8 v14 h12 v44 h34 L430,66 L430,140 Z"
          fill="#070a12"
        />
      </svg>
      {/* two gas lamps with a steady warm glow */}
      <GasLamp left="7%" bottom={96} />
      <GasLamp left="87%" bottom={110} />
    </>
  )
}

function GasLamp({ left, bottom }) {
  return (
    <div className="absolute" style={{ left, bottom }}>
      <div
        className="absolute -top-6 left-1/2 h-14 w-14 -translate-x-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,196,110,0.4), transparent 70%)' }}
      />
      <svg width="16" height="80" viewBox="0 0 16 80" className="relative block">
        <rect x="7" y="12" width="2.4" height="68" fill="#070a12" />
        <path d="M3,12 L8,3 L13,12 Z" fill="#070a12" />
        <circle cx="8" cy="9.5" r="3" fill="#d4a857" />
      </svg>
    </div>
  )
}

// ── Commuter rail at dusk: city strip, rails, signal posts ──────────────────
function Rail({ accent }) {
  return (
    <>
      {/* distant city block strip */}
      <svg viewBox="0 0 430 70" preserveAspectRatio="none" className="absolute inset-x-0 bottom-[26%] block w-full" style={{ height: 64 }}>
        <path
          d="M0,70 L0,42 h26 v-12 h18 v12 h24 v-20 h16 v20 h30 v-8 h22 v8 h28 v-26 h14 v26 h36 v-14 h20 v14 h30 v-22 h16 v22 h26 v-10 h24 v10 h28 v-18 h16 v18 h36 L430,42 L430,70 Z"
          fill="#0d1020"
          opacity="0.85"
        />
        {/* a few lit windows */}
        {[40, 96, 168, 235, 305, 372].map((x, i) => (
          <rect key={i} x={x} y={48 - (i % 3) * 6} width="3" height="4" fill={accent} opacity="0.5" />
        ))}
      </svg>
      {/* railway lines + sleepers */}
      <svg viewBox="0 0 430 90" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 block w-full" style={{ height: 90 }}>
        <rect x="0" y="0" width="430" height="90" fill="#0b0e1a" opacity="0.65" />
        <path d="M0,34 H430" stroke={accent} strokeWidth="2.5" opacity="0.5" />
        <path d="M0,52 H430" stroke={accent} strokeWidth="2.5" opacity="0.3" />
        {Array.from({ length: 14 }).map((_, i) => (
          <rect key={i} x={i * 32 + 4} y={30} width="5" height="28" rx="1" fill="#1c2138" />
        ))}
      </svg>
      {/* signal post */}
      <svg width="20" height="90" viewBox="0 0 20 90" className="absolute bottom-[88px]" style={{ left: '82%' }}>
        <rect x="9" y="10" width="2.5" height="80" fill="#0d1020" />
        <rect x="4" y="2" width="12" height="16" rx="3" fill="#0d1020" />
        <circle cx="10" cy="7" r="2.6" fill={accent} />
        <circle cx="10" cy="14" r="2.6" fill="#e25c5c" opacity="0.7" />
      </svg>
    </>
  )
}

// ── Southern summer evening: low sun, oak tree, porch railing ───────────────
function Southern() {
  return (
    <>
      {/* low evening sun */}
      <div
        className="absolute left-6 top-24 h-40 w-40 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,210,140,0.75), rgba(255,210,140,0) 70%)' }}
      />
      {/* oak tree on the right */}
      <svg viewBox="0 0 220 240" className="absolute bottom-[6%] right-[-30px]" style={{ width: 200, height: 220 }}>
        <g fill="#4a3520">
          <rect x="98" y="120" width="18" height="120" rx="6" />
          <path d="M107,130 L70,96 L78,90 L107,118 Z" />
          <path d="M107,140 L150,100 L143,93 L107,126 Z" />
        </g>
        <g fill="#3c5a33">
          <ellipse cx="108" cy="74" rx="86" ry="48" />
          <ellipse cx="56" cy="98" rx="50" ry="32" />
          <ellipse cx="160" cy="96" rx="52" ry="34" />
        </g>
      </svg>
      {/* porch railing along the bottom */}
      <svg viewBox="0 0 430 60" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 block w-full" style={{ height: 56 }}>
        <rect x="0" y="10" width="430" height="7" rx="3" fill="#5b4226" />
        {Array.from({ length: 16 }).map((_, i) => (
          <rect key={i} x={i * 28 + 6} y={17} width="6" height="36" rx="2" fill="#5b4226" />
        ))}
        <rect x="0" y="50" width="430" height="10" fill="#5b4226" />
      </svg>
    </>
  )
}

// ── Ambient effects (exactly one per theme, transform/opacity only) ─────────

function Fog() {
  return (
    <>
      {[
        { top: '30%', duration: 19, delay: 0 },
        { top: '62%', duration: 25, delay: 8 },
      ].map((w, i) => (
        <motion.div
          key={i}
          className="absolute h-24 w-[150%] will-change-transform"
          style={{
            top: w.top,
            left: '-25%',
            background: 'radial-gradient(ellipse 60% 100% at 50% 50%, rgba(214,224,238,0.09), transparent 70%)',
          }}
          animate={{ x: ['-6%', '7%', '-6%'] }}
          transition={{ duration: w.duration, delay: w.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </>
  )
}

// Passing train-light streaks gliding across the dusk.
function Streaks({ accent }) {
  return (
    <>
      {[
        { top: '34%', duration: 6, delay: 0 },
        { top: '44%', duration: 9, delay: 3 },
      ].map((s, i) => (
        <motion.div
          key={i}
          className="absolute h-[3px] w-44 rounded-full will-change-transform"
          style={{
            top: s.top,
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
            opacity: 0.3,
          }}
          initial={{ x: '-50vw' }}
          animate={{ x: '120vw' }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </>
  )
}

// Slow blinking fireflies over the lawn.
function Fireflies() {
  const flies = [
    { left: '16%', top: '58%', d: 4.5, delay: 0 },
    { left: '38%', top: '70%', d: 5.5, delay: 1.2 },
    { left: '62%', top: '62%', d: 6, delay: 2.4 },
    { left: '80%', top: '74%', d: 5, delay: 0.7 },
    { left: '28%', top: '80%', d: 6.5, delay: 3.1 },
  ]
  return (
    <>
      {flies.map((f, i) => (
        <motion.span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full will-change-transform"
          style={{ left: f.left, top: f.top, background: '#ffd56a', boxShadow: '0 0 8px 2px rgba(255,213,106,0.6)' }}
          animate={{ opacity: [0, 1, 0], y: [0, -10, 0] }}
          transition={{ duration: f.d, delay: f.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </>
  )
}
