import { motion } from 'framer-motion'

// Scene states on a Book screen's path. All colors come from the book theme's
// palette so they work on dark (London, rail) and light (Southern) worlds.
//   completed → sealed wax badge stamped with the score
//   current   → glowing "You are here" / "Begin here" card (the one focus)
//   locked    → name hidden in fog (never rendered — future names are spoilers)

// ── Wax seal stamped with the score ─────────────────────────────────────────
export function WaxSeal({ score, color, size = 50 }) {
  return (
    <div
      className="relative grid shrink-0 place-items-center"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 36% 30%, ${shift(color, 26)}, ${color} 58%, ${shift(color, -24)})`,
        borderRadius: '46% 54% 50% 50% / 52% 47% 56% 48%', // pressed, not printed
        boxShadow:
          'inset 0 2px 5px rgba(255,255,255,0.3), inset 0 -3px 6px rgba(0,0,0,0.4), 0 3px 8px rgba(0,0,0,0.35)',
      }}
    >
      <div
        className="grid place-items-center rounded-full border"
        style={{ width: size - 14, height: size - 14, borderColor: 'rgba(255,235,220,0.4)' }}
      >
        <span className="font-serif text-[14px] font-bold leading-none text-[#ffe9dc]">{score}</span>
      </div>
    </div>
  )
}

// ── Sealed (completed) scene ────────────────────────────────────────────────
export function SealedScene({ scene, index, theme, onTap }) {
  const p = theme.palette
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      whileTap={{ scale: 0.97 }}
      onClick={onTap}
      className="relative z-10 flex w-full items-center gap-3.5 rounded-2xl border p-3.5 text-left backdrop-blur-sm"
      style={{ background: p.panel, borderColor: p.panelBorder }}
    >
      <div className="flex flex-col items-center gap-0.5">
        <WaxSeal score={scene.score} color={theme.sealColor} />
        <span className="text-[9px] font-extrabold uppercase tracking-[0.14em]" style={{ color: p.textMuted }}>
          sealed
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em]" style={{ color: p.textMuted }}>
          Scene {index + 1}
        </p>
        <h3 className="font-serif text-[17px] font-semibold leading-snug" style={{ color: p.textOnBg }}>
          {scene.sceneName}
        </h3>
      </div>
    </motion.button>
  )
}

// ── Current scene — the single glowing focus of the path ───────────────────
export function CurrentScene({ scene, index, theme, started, onTap }) {
  const p = theme.palette
  return (
    <div className="relative z-10 w-full">
      {/* soft pulsing halo — points at the one action on this screen */}
      <motion.div
        className="absolute -inset-1.5 rounded-[1.6rem]"
        style={{ background: `radial-gradient(ellipse at 50% 50%, ${p.glow}, transparent 72%)` }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onTap}
        className="relative w-full rounded-3xl border-2 p-5 text-left backdrop-blur-sm"
        style={{ background: p.panel, borderColor: p.accent, boxShadow: `0 12px 30px -12px ${p.glow}` }}
      >
        <p className="text-[11px] font-extrabold uppercase tracking-[0.22em]" style={{ color: p.accent }}>
          {started ? 'You are here' : 'Begin here'}
        </p>
        <h3 className="mt-1 font-serif text-[21px] font-bold leading-snug" style={{ color: p.textOnBg }}>
          {scene.sceneName}
        </h3>
        <p className="mt-1 text-[12.5px] font-bold" style={{ color: p.textMuted }}>
          Scene {index + 1} · uses 1 ⚡
        </p>
      </motion.button>
    </div>
  )
}

// ── Future scene, name hidden in static fog ─────────────────────────────────
export function FogScene({ index, theme, revealHint, onTap }) {
  const p = theme.palette
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      whileTap={{ scale: 0.98 }}
      onClick={onTap}
      className="relative z-10 w-full overflow-hidden rounded-2xl border p-4 text-left opacity-80"
      style={{ background: p.panel, borderColor: p.panelBorder }}
    >
      {/* static mist veil over the card */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 120% at 30% 50%, rgba(160,170,185,0.18), transparent 70%), radial-gradient(ellipse 60% 100% at 80% 40%, rgba(160,170,185,0.12), transparent 70%)',
        }}
      />
      <div className="relative">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em]" style={{ color: p.textMuted, opacity: 0.7 }}>
          Scene {index + 1}
        </p>
        <h3 className="font-serif text-[16px] font-semibold italic" style={{ color: p.textMuted }}>
          Hidden in the fog…
        </h3>
        <p className="mt-0.5 text-[11.5px] font-bold" style={{ color: p.textMuted, opacity: 0.7 }}>
          {revealHint}
        </p>
      </div>
    </motion.button>
  )
}

// ── One italic line of connective narration between scenes ──────────────────
export function NarrationLine({ text, theme }) {
  const p = theme.palette
  return (
    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-10px' }}
      transition={{ duration: 0.5 }}
      className="relative z-10 max-w-[85%] rounded-2xl px-4 py-1.5 text-center font-serif text-[14px] italic leading-snug backdrop-blur-sm"
      style={{ color: p.textMuted, background: p.panel, border: `1px solid ${p.panelBorder}` }}
    >
      {text}
    </motion.p>
  )
}

// tiny hex shade helper for the seals
function shift(hex, amt) {
  const n = parseInt(hex.slice(1), 16)
  const c = (v) => Math.max(0, Math.min(255, v))
  const r = c((n >> 16) + amt)
  const g = c(((n >> 8) & 0xff) + amt)
  const b = c((n & 0xff) + amt)
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}
