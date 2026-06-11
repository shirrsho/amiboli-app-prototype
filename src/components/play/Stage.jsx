import { AnimatePresence, motion } from 'framer-motion'
import Character from './Character'

// ─── The Set: shadow-theatre stage for the beat player ──────────────────────
// A world ~130% × 118% of the stage viewport holds the illustrated SVG set and
// the character slots; the CAMERA pans/zooms by transforming the world inside
// the fixed, overflow-hidden viewport (the caption panel never moves).
//
// Everything is drawn in code: flat fills, layered tones, fake glows from
// stacked semi-transparent shapes. No images, no SVG filters.
//
// Sets are registered per scene via `setId` — Scene 5 ships 'lauriston-room'.
// To add a set for another book: draw a Set component, list its PROPS ellipses
// and CAMERA targets, and register both in SETS below.

// Camera targets: transforms applied to the world (px are world-space).
const CAMERAS = {
  'lauriston-room': {
    wide: { x: 0, y: 0, scale: 1 },
    holmes: { x: 46, y: 26, scale: 1.22 },
    you: { x: -74, y: 26, scale: 1.22 },
    constable: { x: 120, y: 22, scale: 1.2 },
    window: { x: -96, y: 44, scale: 1.3 },
    wallWriting: { x: 10, y: 58, scale: 1.34 },
    lamp: { x: 118, y: 48, scale: 1.3 },
    door: { x: 132, y: 16, scale: 1.18 },
  },
}

// Prop highlight zones (world SVG coords) per set.
const PROPS = {
  'lauriston-room': {
    window: { cx: 442, cy: 150, rx: 86, ry: 100 },
    wallWriting: { cx: 245, cy: 122, rx: 86, ry: 46 },
    lamp: { cx: 92, cy: 118, rx: 48, ry: 60 },
    door: { cx: 38, cy: 170, rx: 56, ry: 120 },
  },
}

// Character floor slots (percent of world width) and default facing.
const SLOTS = {
  holmes: { left: '30%', facing: 1 },
  you: { left: '63%', facing: -1 },
  constable: { left: '6%', facing: 1 },
}

// Lighting moods → overlay opacities (cool dim layer + warm layer).
const MOODS = {
  calm: { cool: 0, warm: 0.05 },
  tense: { cool: 0.4, warm: 0 },
  revelation: { cool: 0, warm: 0.2 },
}

export default function Stage({
  setId = 'lauriston-room',
  theme,
  camera = 'wide',
  lighting = 'calm',
  highlight = null, // { prop, key }
  characters = [], // [{ id, name, pose, active, talking }]
  reaction = null, // { charId, text }
  chip = null, // { text, golden, key } — floats up from `you`
}) {
  const p = theme.palette
  const cams = CAMERAS[setId] ?? {}
  const cam = cams[camera] ?? cams.wide ?? { x: 0, y: 0, scale: 1 } // unknown target → wide
  const mood = MOODS[lighting] ?? MOODS.calm // unknown mood → calm
  const props = PROPS[setId] ?? {}
  const hl = highlight && props[highlight.prop] ? highlight : null // unknown prop → no-op

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: '#0b0e1c' }}>
      {/* ── the world: set + characters, moved by the camera ── */}
      <motion.div
        className="absolute will-change-transform"
        style={{ width: '130%', height: '118%', left: '-15%', top: '-10%', transformOrigin: '50% 62%' }}
        animate={{ x: cam.x, y: cam.y, scale: cam.scale }}
        transition={{ duration: 1.5, ease: [0.33, 0.0, 0.2, 1] }}
      >
        <LauristonRoom accentGlow={p.glow} highlight={hl} />

        {/* fog — the ONE constant ambient effect */}
        <FogWisp top="34%" duration={21} delay={0} />
        <FogWisp top="64%" duration={27} delay={9} />

        {/* characters standing on the floor line; entrances/exits walk in/out */}
        <AnimatePresence initial={false}>
          {characters.map((c, i) => {
            const slot = SLOTS[c.id]
            if (!slot) return null
            return (
              <motion.div
                key={c.id}
                className="absolute"
                style={{ left: slot.left, bottom: '13.5%' }}
                initial={{ x: slot.facing === 1 ? -160 : 160, opacity: 0 }}
                animate={{ x: 0, opacity: 1, y: [0, -4, 0, -3, 0] }}
                exit={{ x: slot.facing === 1 ? -180 : 180, opacity: 0 }}
                transition={{ duration: 1.1, ease: 'easeInOut' }}
              >
                <div className="relative">
                  <Character
                    id={c.id}
                    name={c.name}
                    pose={c.pose}
                    facing={slot.facing}
                    active={c.active}
                    talking={c.talking}
                    glow={p.glow}
                    breatheDelay={i * 1.15}
                    width={104}
                  />

                  {/* score chip floating up from the user's silhouette */}
                  {c.id === 'you' && chip && (
                    <AnimatePresence>
                      <motion.div
                        key={chip.key}
                        initial={{ opacity: 0, y: 6, scale: 0.85 }}
                        animate={{ opacity: [0, 1, 1, 0], y: -64 }}
                        transition={{ duration: 1.9, times: [0, 0.15, 0.75, 1] }}
                        className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-extrabold"
                        style={
                          chip.golden
                            ? {
                                background: `linear-gradient(135deg, ${p.accent}, ${p.accentDeep})`,
                                color: p.ctaText,
                                boxShadow: `0 0 18px ${p.glow}`,
                              }
                            : { background: 'rgba(0,0,0,0.55)', color: p.textOnBg }
                        }
                      >
                        {chip.text}
                      </motion.div>
                    </AnimatePresence>
                  )}

                  {/* NPC reaction line — the primary feedback channel */}
                  <AnimatePresence>
                    {reaction && reaction.charId === c.id && (
                      <motion.p
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute -bottom-12 left-1/2 w-40 -translate-x-1/2 text-center font-serif text-[12.5px] italic leading-snug"
                        style={{ color: p.textOnBg, textShadow: '0 1px 6px rgba(0,0,0,0.9)' }}
                      >
                        {reaction.text}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>

      {/* ── lighting mood overlays (crossfade, outside the world) ── */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ background: '#0a1433' }}
        animate={{ opacity: mood.cool }}
        transition={{ duration: 0.9 }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 45%, #ffc06e, transparent 75%)' }}
        animate={{ opacity: mood.warm }}
        transition={{ duration: 0.9 }}
      />

      {/* soft vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 42%, transparent 52%, rgba(4,6,14,0.6) 100%)' }}
      />
    </div>
  )
}

// ─── Scene 5 set: the room at Lauriston Gardens ──────────────────────────────
// World SVG, 560×400, floor at y≈320. Flat fills in 3–4 tones + fake glows.
function LauristonRoom({ accentGlow, highlight }) {
  const wall = '#222a48'
  const wainscot = '#19203a'
  const dark = '#10152b'
  const moonlight = '#7d8fc4'

  return (
    <svg viewBox="0 0 560 400" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
      {/* walls: two tones + picture rail */}
      <rect x="0" y="0" width="560" height="240" fill={wall} />
      <rect x="0" y="240" width="560" height="80" fill={wainscot} />
      <rect x="0" y="236" width="560" height="5" fill={dark} />

      {/* floor with boards */}
      <rect x="0" y="320" width="560" height="80" fill="#0d1226" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x="0" y={338 + i * 22} width="560" height="1.5" fill="#1b2342" opacity="0.6" />
      ))}

      {/* ── door (left) ── */}
      <rect x="14" y="92" width="64" height="228" fill={dark} />
      <rect x="20" y="100" width="52" height="220" fill="#161d36" />
      <rect x="27" y="112" width="38" height="80" fill={dark} />
      <rect x="27" y="206" width="38" height="90" fill={dark} />
      <circle cx="66" cy="208" r="3.4" fill="#444f7a" />

      {/* ── gas lamp on the left wall ── */}
      {/* fake glow: stacked circles, no filters */}
      <circle cx="92" cy="108" r="52" fill="#ffc06e" opacity="0.07" />
      <circle cx="92" cy="108" r="32" fill="#ffc06e" opacity="0.12" />
      <circle cx="92" cy="108" r="16" fill="#ffd79a" opacity="0.28" />
      <path d="M84,128 L100,128 L96,140 L88,140 Z" fill={dark} />
      <rect x="90" y="138" width="4" height="14" fill={dark} />
      <path d="M84,128 L84,112 Q92,102 100,112 L100,128 Z" fill="#2c3354" />
      <circle cx="92" cy="118" r="5" fill="#ffd79a" opacity="0.9" />

      {/* ── the scrawled word on the wall ── */}
      <ellipse cx="245" cy="120" rx="78" ry="34" fill="#b0413e" opacity="0.1" />
      <text
        x="245"
        y="132"
        textAnchor="middle"
        fontFamily="'Crimson Text', Georgia, serif"
        fontStyle="italic"
        fontWeight="700"
        fontSize="38"
        letterSpacing="6"
        fill="#b0413e"
        opacity="0.92"
      >
        RACHE
      </text>
      <text
        x="245"
        y="132"
        textAnchor="middle"
        fontFamily="'Crimson Text', Georgia, serif"
        fontStyle="italic"
        fontWeight="700"
        fontSize="38"
        letterSpacing="6"
        fill="#e06a5e"
        opacity="0.25"
      >
        RACHE
      </text>

      {/* ── moonlit window (right) ── */}
      <circle cx="442" cy="128" r="78" fill={moonlight} opacity="0.07" />
      <rect x="388" y="58" width="108" height="180" fill={dark} />
      <rect x="394" y="64" width="96" height="168" fill="#324068" />
      {/* panes (moonlight) split by mullions */}
      <rect x="398" y="68" width="42" height="76" fill="#46598e" />
      <rect x="444" y="68" width="42" height="76" fill="#415488" />
      <rect x="398" y="150" width="42" height="76" fill="#3d4f82" />
      <rect x="444" y="150" width="42" height="76" fill="#46598e" />
      {/* moon behind the upper-right pane */}
      <circle cx="466" cy="96" r="15" fill="#e9e2c8" opacity="0.85" />
      {/* light pooling on the floor below the window */}
      <path d="M386,320 L500,320 L540,366 L350,366 Z" fill={moonlight} opacity="0.08" />
      <path d="M398,320 L488,320 L514,348 L376,348 Z" fill={moonlight} opacity="0.08" />

      {/* prop highlight pulse (~2s), one at a time */}
      <AnimatePresence>
        {highlight && (
          <PropGlow key={highlight.key} zone={PROPS['lauriston-room'][highlight.prop]} glow={accentGlow} />
        )}
      </AnimatePresence>
    </svg>
  )
}

function PropGlow({ zone, glow }) {
  // brighten + gentle pulse + slightly larger glow radius, then fade
  return (
    <motion.ellipse
      cx={zone.cx}
      cy={zone.cy}
      rx={zone.rx}
      ry={zone.ry}
      fill={glow.replace(/[\d.]+\)$/, '0.32)')}
      initial={{ opacity: 0, scale: 1 }}
      animate={{ opacity: [0, 1, 0.55, 1, 0], scale: [1, 1.06, 1.1] }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2 }}
      style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
    />
  )
}

function FogWisp({ top, duration, delay }) {
  return (
    <motion.div
      className="pointer-events-none absolute h-20 w-[150%] will-change-transform"
      style={{
        top,
        left: '-25%',
        background: 'radial-gradient(ellipse 60% 100% at 50% 50%, rgba(214,224,238,0.07), transparent 70%)',
      }}
      animate={{ x: ['-5%', '6%', '-5%'] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}
