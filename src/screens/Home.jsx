import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import HomeTopBar from '../components/HomeTopBar'
import NotificationsSheet from '../components/NotificationsSheet'
import EnergySheet from '../components/EnergySheet'
import Mascot from '../components/Mascot'
import Scenery from '../components/story/Scenery'
import { useLibrary } from '../components/LibraryProvider'
import { books } from '../data/dummyData'
import { getTheme } from '../data/bookThemes'

// Home = a vertical feed of books, one per viewport, with scroll-snap.
// The promise in 5 seconds: these are stories → tap one to enter it.
// Tapping a book (or its button) opens its own themed screen at /book/:id.
export default function Home() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [energyOpen, setEnergyOpen] = useState(false)
  const [active, setActive] = useState(0)
  const feedRef = useRef(null)
  const ticking = useRef(false)
  const navigate = useNavigate()
  const { ownedBooks } = useLibrary()

  // Free books + any stories bought from the Store (in memory).
  const feed = [...books, ...ownedBooks]

  // Track which book section is in view (for the right-edge page dots).
  const onScroll = () => {
    if (ticking.current) return
    ticking.current = true
    requestAnimationFrame(() => {
      const el = feedRef.current
      if (el) setActive(Math.round(el.scrollTop / el.clientHeight))
      ticking.current = false
    })
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col" style={{ background: '#10141f' }}>
      {/* Status bar floats over every section, consistent across themes */}
      <div className="absolute inset-x-0 top-0 z-30">
        <HomeTopBar
          onOpenNotifications={() => setSheetOpen(true)}
          onOpenEnergy={() => setEnergyOpen(true)}
        />
      </div>

      <main
        ref={feedRef}
        onScroll={onScroll}
        className="no-scrollbar min-h-0 flex-1 snap-y snap-mandatory overflow-y-auto"
      >
        {feed.map((book) => (
          <BookSection key={book.id} book={book} onOpen={() => navigate(`/book/${book.id}`)} />
        ))}

        {/* Final section: get more from the store */}
        <section className="relative flex h-full snap-start flex-col items-center justify-center gap-3 px-10 text-center">
          <Mascot mood="excited" size={150} float />
          <h2 className="font-serif text-3xl font-bold text-[#f3ead9]">Want more stories?</h2>
          <p className="text-sm font-bold text-[#f3ead9]/55">Browse premium books in the Store</p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/store')}
            className="mt-1 rounded-2xl bg-brand-500 px-6 py-3 font-display text-base font-extrabold text-white shadow-pop"
          >
            Open the Store →
          </motion.button>
        </section>
      </main>

      {/* Right-edge page indicator (one dot per section) */}
      <div className="absolute right-2.5 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-1.5">
        {[...feed, null].map((_, i) => (
          <span
            key={i}
            className="w-1.5 rounded-full bg-white transition-all duration-300"
            style={{ height: i === active ? 18 : 6, opacity: i === active ? 0.9 : 0.35 }}
          />
        ))}
      </div>

      <NotificationsSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
      <EnergySheet open={energyOpen} onClose={() => setEnergyOpen(false)} />
    </div>
  )
}

// One full-viewport, fully themed book section: title → progress → action.
function BookSection({ book, onOpen }) {
  const theme = getTheme(book.themeId)
  const p = theme.palette
  const total = book.scenes.length
  const done = book.scenes.filter((s) => s.status === 'completed')
  const started = done.length > 0
  const avg = started ? Math.round(done.reduce((a, s) => a + s.score, 0) / done.length) : null

  return (
    <section className="relative h-full cursor-pointer snap-start overflow-hidden" onClick={onOpen}>
      <Scenery theme={theme} ambient={false} />

      {/* Content cluster, bottom-anchored on a frosted panel */}
      <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-9">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          className="rounded-3xl border p-5 backdrop-blur-md"
          style={{ background: p.panel, borderColor: p.panelBorder }}
        >
          {/* 1 · Title */}
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em]" style={{ color: p.accent }}>
            {book.subtitle}
          </p>
          <h2 className="mt-1 font-serif text-[32px] font-bold leading-tight" style={{ color: p.textOnBg }}>
            {book.title}
          </h2>
          <p className="mt-1.5 text-[14px] font-semibold leading-snug" style={{ color: p.textMuted }}>
            {book.pitch}
          </p>

          {/* 2 · Progress */}
          <p className="mt-4 text-[12.5px] font-extrabold" style={{ color: p.textOnBg }}>
            {started ? `${done.length}/${total} scenes completed · Avg ${avg}` : 'Not started yet'}
          </p>
          <div className="mt-2">
            <SceneDots scenes={book.scenes} theme={theme} />
          </div>

          {/* 3 · Action */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={(e) => {
              e.stopPropagation()
              onOpen()
            }}
            className="mt-4 w-full rounded-2xl py-4 font-display text-base font-extrabold"
            style={{
              background: `linear-gradient(135deg, ${p.accent}, ${p.accentDeep})`,
              color: p.ctaText,
              boxShadow: `0 10px 24px -10px ${p.glow}`,
            }}
          >
            {started ? 'Continue this story →' : 'Start this story →'}
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

// Tiny preview row: completed = filled with score, current = glowing ring,
// future = dimmed dot. No names here — it's a preview, not the map.
function SceneDots({ scenes, theme }) {
  const p = theme.palette
  return (
    <div className="flex items-center gap-2">
      {scenes.map((s) => {
        if (s.status === 'completed')
          return (
            <span
              key={s.id}
              className="grid h-7 w-7 place-items-center rounded-full text-[10px] font-extrabold"
              style={{ background: p.accent, color: p.ctaText }}
            >
              {s.score}
            </span>
          )
        if (s.status === 'current')
          return (
            <span
              key={s.id}
              className="grid h-7 w-7 place-items-center rounded-full border-2"
              style={{ borderColor: p.accent, boxShadow: `0 0 10px 1px ${p.glow}` }}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: p.accent }} />
            </span>
          )
        return (
          <span key={s.id} className="h-2.5 w-2.5 rounded-full" style={{ background: p.textMuted, opacity: 0.4 }} />
        )
      })}
    </div>
  )
}
