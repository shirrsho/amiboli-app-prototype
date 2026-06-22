import { motion } from 'framer-motion'

// ─── Book banner character ──────────────────────────────────────────────────
// A big, gently-moving flat SVG silhouette that fronts each book on the feed —
// drawn entirely in code in the same shadow-silhouette style as the play stage.
// A soft theme-coloured glow behind it keeps it readable on dark book worlds;
// the dark silhouette reads naturally on light worlds.
//
//   <BookCharacter bookId="scarlet" theme={theme} height={300} />

const FILL = '#0F0D2E' // silhouette tone (matches the scene characters)

// Which figure fronts which book.
const FIGURE_BY_BOOK = {
  scarlet: 'detective',
  holmes2: 'detective',
  train: 'commuter',
  mockingbird: 'child',
  alice: 'child',
  pride: 'lady',
  dracula: 'caped',
  frankenstein: 'reader',
  treasure: 'reader',
}

// Each figure: flat shapes in a 120×230 box, feet near y=228, facing forward.
// `a` = theme accent, `ad` = accent-deep (used for small prop highlights).
const FIGURES = {
  // Holmes — long coat, deerstalker with ear-flaps, a pipe.
  detective: (a) => (
    <>
      <rect x="48" y="150" width="11" height="78" rx="3" fill={FILL} />
      <rect x="61" y="150" width="11" height="78" rx="3" fill={FILL} />
      <path d="M60,50 C45,50 41,62 41,78 L36,158 L84,158 L79,78 C79,62 75,50 60,50 Z" fill={FILL} />
      <rect x="40" y="74" width="6" height="40" rx="3" fill={FILL} />
      <rect x="74" y="74" width="6" height="40" rx="3" fill={FILL} />
      <circle cx="60" cy="34" r="14" fill={FILL} />
      <ellipse cx="60" cy="27" rx="21" ry="9" fill={FILL} />
      <path d="M40,28 Q60,8 80,28 Z" fill={FILL} />
      <circle cx="40" cy="35" r="6" fill={FILL} />
      <circle cx="80" cy="35" r="6" fill={FILL} />
      {/* pipe */}
      <rect x="70" y="44" width="15" height="3" rx="1.5" fill={a} />
      <rect x="82" y="40" width="3" height="8" rx="1.5" fill={a} />
    </>
  ),
  // Commuter — A-line coat, bob, a handbag in the accent.
  commuter: (a) => (
    <>
      <rect x="50" y="158" width="9" height="70" rx="3" fill={FILL} />
      <rect x="61" y="158" width="9" height="70" rx="3" fill={FILL} />
      <path d="M60,52 C47,52 44,62 44,76 L38,166 L82,166 L76,76 C76,62 73,52 60,52 Z" fill={FILL} />
      <circle cx="60" cy="36" r="13" fill={FILL} />
      <path d="M46,36 Q46,18 60,18 Q74,18 74,36 L74,46 L69,46 L69,30 Q60,26 51,30 L51,46 L46,46 Z" fill={FILL} />
      <rect x="74" y="70" width="6" height="30" rx="3" fill={FILL} />
      {/* handbag */}
      <rect x="78" y="92" width="16" height="13" rx="2" fill={a} />
      <path d="M80,92 Q86,82 92,92" stroke={a} strokeWidth="2.4" fill="none" />
    </>
  ),
  // Child — bigger head, short body (reads as small).
  child: (a) => (
    <>
      <rect x="52" y="176" width="8" height="52" rx="3" fill={FILL} />
      <rect x="62" y="176" width="8" height="52" rx="3" fill={FILL} />
      <path d="M61,116 C50,116 46,126 46,138 L42,182 L80,182 L76,138 C76,126 72,116 61,116 Z" fill={FILL} />
      <rect x="44" y="124" width="6" height="32" rx="3" fill={FILL} />
      <rect x="72" y="124" width="6" height="32" rx="3" fill={FILL} />
      <circle cx="61" cy="98" r="18" fill={FILL} />
      <path d="M43,96 Q43,76 61,76 Q79,76 79,96 Q70,88 61,90 Q52,88 43,96 Z" fill={FILL} />
      {/* little kite/bookmark detail */}
      <rect x="78" y="120" width="3" height="40" fill={a} opacity="0.8" />
    </>
  ),
  // Lady — wide regency dress, updo bun.
  lady: () => (
    <>
      <path d="M60,54 C50,54 46,64 46,78 L28,200 L92,200 L74,78 C74,64 70,54 60,54 Z" fill={FILL} />
      <rect x="28" y="198" width="64" height="30" fill={FILL} />
      <rect x="42" y="74" width="6" height="40" rx="3" fill={FILL} />
      <rect x="72" y="74" width="6" height="40" rx="3" fill={FILL} />
      <circle cx="60" cy="38" r="13" fill={FILL} />
      <path d="M47,38 Q47,22 60,22 Q73,22 73,38 L73,42 L47,42 Z" fill={FILL} />
      <circle cx="60" cy="22" r="8" fill={FILL} />
    </>
  ),
  // Caped figure — high pointed collar, cloak.
  caped: () => (
    <>
      <rect x="52" y="172" width="9" height="56" rx="3" fill={FILL} />
      <rect x="62" y="172" width="9" height="56" rx="3" fill={FILL} />
      <path d="M60,60 L34,178 L86,178 L60,60 Z" fill={FILL} />
      <path d="M60,58 L38,68 L44,90 L60,72 L76,90 L82,68 Z" fill={FILL} />
      <circle cx="60" cy="44" r="13" fill={FILL} />
      <path d="M47,44 Q47,30 60,30 Q73,30 73,44 L60,38 Z" fill={FILL} />
    </>
  ),
  // Default — a reader holding an open book in the accent.
  reader: (a, ad) => (
    <>
      <rect x="50" y="158" width="9" height="70" rx="3" fill={FILL} />
      <rect x="61" y="158" width="9" height="70" rx="3" fill={FILL} />
      <path d="M60,52 C47,52 43,62 43,76 L40,166 L80,166 L77,76 C77,62 73,52 60,52 Z" fill={FILL} />
      <circle cx="60" cy="36" r="13" fill={FILL} />
      <path d="M47,36 Q47,22 60,22 Q73,22 73,36 L73,30 Q60,24 47,30 Z" fill={FILL} />
      <rect x="40" y="74" width="6" height="26" rx="3" fill={FILL} />
      <rect x="74" y="74" width="6" height="26" rx="3" fill={FILL} />
      {/* open book */}
      <path d="M40,96 L60,90 L60,120 L40,126 Z" fill={a} />
      <path d="M80,96 L60,90 L60,120 L80,126 Z" fill={ad} />
    </>
  ),
}

export default function BookCharacter({ bookId, theme, height = 300, className = '' }) {
  const p = theme.palette
  const figure = FIGURES[FIGURE_BY_BOOK[bookId] ?? 'reader'] ?? FIGURES.reader
  const width = height * (120 / 230)

  return (
    <div className={`relative flex items-end justify-center ${className}`} style={{ height }} aria-hidden>
      {/* soft glow so the silhouette separates from dark worlds */}
      <div
        className="absolute"
        style={{
          width: width * 1.7,
          height: height * 0.95,
          bottom: 0,
          background: `radial-gradient(ellipse 50% 55% at 50% 60%, ${p.glow}, transparent 70%)`,
          opacity: 0.85,
        }}
      />
      {/* the character — a slow sway + gentle breathe (transform only) */}
      <motion.svg
        width={width}
        height={height}
        viewBox="0 0 120 230"
        className="relative block overflow-visible will-change-transform"
        style={{ transformOrigin: '50% 100%' }}
        animate={{ rotate: [0, 1.4, 0, -1.4, 0], y: [0, -4, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.g
          style={{ transformOrigin: '50% 100%' }}
          animate={{ scaleY: [1, 1.015, 1] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {figure(p.accent, p.accentDeep)}
        </motion.g>
      </motion.svg>
    </div>
  )
}
