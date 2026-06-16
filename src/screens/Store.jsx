import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Screen from '../components/Screen'
import { useToast } from '../components/ToastProvider'
import { useLibrary } from '../components/LibraryProvider'
import { storeBooks } from '../data/dummyData'
import { getTheme } from '../data/bookThemes'

// Store tab: premium books you can "buy" (no real payment) to add to Home.
export default function Store() {
  const navigate = useNavigate()
  const showToast = useToast()
  const { owns, buy, ownedIds } = useLibrary()

  return (
    <Screen title="Store" subtitle="Premium stories, yours to keep">
      {/* small library status */}
      <div className="mb-4 flex items-center gap-2 rounded-2xl bg-brand-50 px-4 py-2.5">
        <span className="text-lg">📚</span>
        <p className="text-sm font-bold text-ink-soft">
          {ownedIds.size === 0
            ? 'Buy a story and it’s added to your Home instantly.'
            : `${ownedIds.size} ${ownedIds.size === 1 ? 'story' : 'stories'} added to your Home.`}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {storeBooks.map((book) => (
          <StoreCard
            key={book.id}
            book={book}
            owned={owns(book.id)}
            onBuy={() => {
              buy(book.id)
              showToast(`“${book.title}” added to your Home!`, '🎉')
            }}
            onOpen={() => navigate(`/book/${book.id}`)}
          />
        ))}
      </div>

      <p className="mt-5 text-center text-xs font-bold text-ink-soft/50">
        Demo store — no real payment is taken.
      </p>
    </Screen>
  )
}

function StoreCard({ book, owned, onBuy, onOpen }) {
  const theme = getTheme(book.themeId)
  const p = theme.palette
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-3xl bg-white shadow-soft"
    >
      {/* themed cover */}
      <div
        className="relative flex h-28 items-center gap-3 px-4"
        style={{ background: `linear-gradient(135deg, ${p.bg}, ${p.bgDeep})` }}
      >
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/15 text-4xl backdrop-blur">
          {book.coverEmoji}
        </div>
        <div className="min-w-0">
          <h3 className="font-serif text-xl font-bold leading-tight" style={{ color: p.textOnBg }}>
            {book.title}
          </h3>
          <p className="truncate text-[11px] font-bold" style={{ color: p.textMuted }}>
            {book.subtitle}
          </p>
        </div>
        {/* corner tag */}
        <span
          className="absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold"
          style={{ background: p.accent, color: p.ctaText }}
        >
          {book.tag}
        </span>
      </div>

      {/* body */}
      <div className="p-4">
        <p className="text-[13px] font-semibold text-ink-soft">{book.pitch}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[11px] font-bold text-ink-soft/70">
            {book.scenes.length} scenes
          </span>
          {owned ? (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-sm font-extrabold text-leaf-600">✓ In library</span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onOpen}
                className="rounded-xl bg-ink px-4 py-2 text-sm font-extrabold text-white"
              >
                Open
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onBuy}
              className="rounded-xl bg-brand-500 px-5 py-2 font-display text-sm font-extrabold text-white shadow-pop"
            >
              Buy {book.price}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
