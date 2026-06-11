import { motion } from 'framer-motion'

// ─── Shadow-theatre character rig ────────────────────────────────────────────
// A layered SVG silhouette: backArm / body / head / frontArm groups, each with
// its own pivot (shoulder, neck), animated between named POSES with springs.
// Identity comes from SHAPE only (hats, coats, props) — no faces, flat fills.
//
// Reusable: add a new character by drawing four path sets in CHARACTERS below;
// poses, breathing, head-bob and glow come for free.

export const SILHOUETTE = '#0F0D2E'

// Named poses: rotations (deg) per rig group. `pointing` aims the front arm;
// when a pose carries target 'up' the arm raises further.
const POSES = {
  idle: { body: 0, head: 0, fArm: 0, bArm: 0 },
  speaking: { body: -3, head: 2, fArm: -32, bArm: 5 },
  pointing: { body: -4, head: -3, fArm: -80, bArm: 6 },
  impressed: { body: 3, head: -8, fArm: -52, bArm: 14 },
  puzzled: { body: 1, head: 9, fArm: -126, bArm: 3 },
}

// Character shape library. Each entry: body / head (group) / frontArm /
// backArm path data inside a 120×230 box, feet on the baseline (y=230).
// All shapes face RIGHT by default; the rig flips with scaleX.
const CHARACTERS = {
  // Tall, slim, long coat, deerstalker (front + back peak), pipe in hand.
  holmes: {
    body: `M60,56 L46,66 L42,86 L40,118 L30,196 L40,196 L48,132 L50,196 L44,226 L56,226 L58,156
           L62,156 L64,226 L76,226 L70,196 L72,132 L80,196 L90,196 L80,118 L78,86 L74,66 Z`,
    head: (
      <>
        {/* neck + head */}
        <rect x="55" y="44" width="10" height="14" fill={SILHOUETTE} />
        <circle cx="60" cy="34" r="13" fill={SILHOUETTE} />
        {/* deerstalker: dome + front & back peaks */}
        <path d="M46,30 Q60,12 74,30 L74,34 L46,34 Z" fill={SILHOUETTE} />
        <path d="M72,29 L82,33 L72,36.5 Z" fill={SILHOUETTE} />
        <path d="M48,29 L38,33 L48,36.5 Z" fill={SILHOUETTE} />
      </>
    ),
    frontArm: (
      <>
        <path d="M66,66 L80,70 L82,116 L72,118 Z" fill={SILHOUETTE} />
        {/* pipe held in the hand */}
        <path d="M76,116 L92,112 L92,116 L80,120 Z" fill={SILHOUETTE} />
        <circle cx="93" cy="111" r="4" fill={SILHOUETTE} />
      </>
    ),
    backArm: <path d="M54,66 L40,70 L36,116 L46,118 Z" fill={SILHOUETTE} />,
    height: 1.04, // slightly taller render scale
  },

  // You (Watson): medium build, bowler hat, shorter coat.
  you: {
    body: `M60,58 L44,68 L40,92 L38,148 L46,150 L48,128 L46,196 L48,226 L58,226 L58,160
           L62,160 L62,226 L72,226 L74,196 L72,128 L74,150 L82,148 L80,92 L76,68 Z`,
    head: (
      <>
        <rect x="55" y="46" width="10" height="13" fill={SILHOUETTE} />
        <circle cx="60" cy="36" r="13" fill={SILHOUETTE} />
        {/* bowler: brim + dome */}
        <ellipse cx="60" cy="27" rx="19" ry="3.6" fill={SILHOUETTE} />
        <path d="M49,27 Q60,12 71,27 Z" fill={SILHOUETTE} />
      </>
    ),
    frontArm: <path d="M66,68 L80,72 L80,118 L70,120 Z" fill={SILHOUETTE} />,
    backArm: <path d="M54,68 L40,72 L40,118 L50,120 Z" fill={SILHOUETTE} />,
    height: 0.97,
  },

  // Constable: custodian helmet, broad caped coat.
  constable: {
    body: `M60,56 L38,68 L30,100 L24,156 L34,158 L38,130 L38,196 L44,226 L56,226 L58,162
           L62,162 L64,226 L76,226 L82,196 L82,130 L86,158 L96,156 L90,100 L82,68 Z`,
    head: (
      <>
        <rect x="55" y="44" width="10" height="14" fill={SILHOUETTE} />
        <circle cx="60" cy="34" r="12.5" fill={SILHOUETTE} />
        {/* custodian helmet: tall dome + band + badge bump */}
        <path d="M47,30 Q49,4 60,2 Q71,4 73,30 L73,34 L47,34 Z" fill={SILHOUETTE} />
        <rect x="45" y="29" width="30" height="4.5" rx="2" fill={SILHOUETTE} />
        <circle cx="60" cy="6" r="2.6" fill={SILHOUETTE} />
      </>
    ),
    frontArm: <path d="M68,68 L82,74 L82,120 L72,122 Z" fill={SILHOUETTE} />,
    backArm: <path d="M52,68 L38,74 L38,120 L48,122 Z" fill={SILHOUETTE} />,
    height: 1.0,
  },
}

const spring = { type: 'spring', stiffness: 170, damping: 18 } // ~400ms settle

// Resolve a pose value ('speaking' or { pose: 'pointing', target: 'right' }).
function resolvePose(pose) {
  const name = typeof pose === 'object' ? pose.pose : pose
  const target = typeof pose === 'object' ? pose.target : null
  const P = POSES[name] ?? POSES.idle // unknown pose names no-op to idle
  if (name === 'pointing' && target === 'up') return { P: { ...P, fArm: -118 }, target }
  return { P, target }
}

export default function Character({
  id,
  pose = 'idle',
  facing = 1, // 1 = faces right, -1 = faces left
  active = false,
  talking = false,
  name,
  glow = 'rgba(255,196,110,0.45)',
  breatheDelay = 0,
  width = 110,
}) {
  const def = CHARACTERS[id]
  if (!def) return null // unknown character → graceful no-op

  const { P, target } = resolvePose(pose)
  // Pointing turns the whole figure toward its target.
  const face = target === 'left' ? -1 : target === 'right' ? 1 : facing
  const h = width * (230 / 120) * def.height

  return (
    <motion.div
      className="relative flex flex-col items-center"
      animate={{ opacity: active ? 1 : 0.74 }}
      transition={{ duration: 0.4 }}
      style={{ width }}
    >
      {/* rim glow for the lit character — layered radials, no SVG filters */}
      <motion.div
        className="pointer-events-none absolute"
        style={{
          width: width * 1.5,
          height: h * 1.05,
          left: -width * 0.25,
          bottom: 0,
          background: `radial-gradient(ellipse 50% 46% at 50% 52%, ${glow}, transparent 70%)`,
        }}
        animate={{ opacity: active ? 0.85 : 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* facing flip (smoothly turns when pointing across the stage) */}
      <motion.div animate={{ scaleX: face }} transition={spring} style={{ width, height: h }}>
        <svg viewBox="0 0 120 230" width={width} height={h} className="block overflow-visible">
          {/* whole-figure lean */}
          <motion.g
            animate={{ rotate: P.body }}
            transition={spring}
            style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
          >
            {/* breathing (offset per character so they never sync) */}
            <motion.g
              animate={{ scaleY: [1, 1.012, 1] }}
              transition={{ duration: 3.1, repeat: Infinity, ease: 'easeInOut', delay: breatheDelay }}
              style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
            >
              <motion.g
                animate={{ rotate: P.bArm }}
                transition={spring}
                style={{ transformBox: 'fill-box', transformOrigin: '50% 8%' }}
              >
                {def.backArm}
              </motion.g>

              <path d={def.body} fill={SILHOUETTE} />

              {/* head pivots at the neck; inner group carries idle-turn / talk-bob */}
              <motion.g
                animate={{ rotate: P.head }}
                transition={spring}
                style={{ transformBox: 'fill-box', transformOrigin: '50% 92%' }}
              >
                <motion.g
                  animate={
                    talking
                      ? { rotate: [0, -2, 1.5, -1, 2, 0] }
                      : { rotate: [0, 0, 3.5, 0, 0, -2.5, 0] }
                  }
                  transition={
                    talking
                      ? { duration: 0.9, repeat: Infinity, ease: 'easeInOut' }
                      : { duration: 9, repeat: Infinity, ease: 'easeInOut', delay: breatheDelay * 1.7 }
                  }
                  style={{ transformBox: 'fill-box', transformOrigin: '50% 92%' }}
                >
                  {def.head}
                </motion.g>
              </motion.g>

              <motion.g
                animate={{ rotate: P.fArm }}
                transition={spring}
                style={{ transformBox: 'fill-box', transformOrigin: '38% 8%' }}
              >
                {def.frontArm}
              </motion.g>
            </motion.g>
          </motion.g>
        </svg>
      </motion.div>

      {/* name tag floats above the head so it survives camera framing */}
      {name && (
        <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-extrabold text-white/90 backdrop-blur-sm">
          {name}
        </span>
      )}
    </motion.div>
  )
}
