import { motion } from 'framer-motion'
import Screen from '../components/Screen'
import { useToast } from '../components/ToastProvider'
import { plans } from '../data/dummyData'

export default function Plans() {
  const showToast = useToast()
  const { free, pro, comparison } = plans
  const usedPct = (free.booksUsed / free.booksCap) * 100

  return (
    <Screen title="Plans" subtitle="Power up your learning">
      {/* Current plan — Free */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 rounded-3xl bg-white p-5 shadow-soft"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wide text-ink-soft/60">
              Current plan
            </p>
            <h2 className="font-display text-2xl font-extrabold text-ink">{free.name}</h2>
            <p className="text-sm font-bold text-ink-soft">{free.tagline}</p>
          </div>
          <span className="rounded-full bg-leaf-400/15 px-3 py-1 text-sm font-extrabold text-leaf-600">
            Active
          </span>
        </div>

        {/* Energy */}
        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-cream p-3">
          <div className="flex gap-1">
            {Array.from({ length: free.energy.max }).map((_, i) => (
              <span key={i} className={`text-2xl ${i < free.energy.current ? '' : 'opacity-25 grayscale'}`}>
                ⚡
              </span>
            ))}
          </div>
          <div>
            <p className="font-display font-extrabold text-ink">
              {free.energy.current}/{free.energy.max} energy
            </p>
            <p className="text-xs font-bold text-ink-soft">Resets every {free.energy.resetsEvery}</p>
          </div>
        </div>

        {/* Rules */}
        <ul className="mt-3 flex flex-col gap-1.5">
          {free.rules.map((r) => (
            <li key={r} className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
              <span className="text-leaf-500">✓</span> {r}
            </li>
          ))}
        </ul>

        {/* Books usage bar */}
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-sm font-extrabold text-ink">
            <span>Books accessed</span>
            <span>
              {free.booksUsed}/{free.booksCap}
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-black/5">
            <motion.div
              className="h-full rounded-full bg-brand-500"
              initial={{ width: 0 }}
              whileInView={{ width: `${usedPct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Pro plan */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-5 overflow-hidden rounded-3xl bg-gradient-to-br from-grape-500 via-brand-500 to-brand-600 p-5 text-white shadow-pop"
      >
        {/* badge */}
        <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-extrabold text-brand-600">
          {pro.badge}
        </span>
        <div className="text-4xl">👑</div>
        <h2 className="mt-2 font-display text-3xl font-extrabold">Amiboli {pro.name}</h2>
        <div className="mt-1 flex items-end gap-1">
          <span className="font-display text-4xl font-extrabold">{pro.price}</span>
          <span className="pb-1 font-bold text-white/90">{pro.period}</span>
        </div>

        <ul className="mt-4 flex flex-col gap-2">
          {pro.perks.map((p) => (
            <li key={p} className="flex items-center gap-2 font-bold">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-white/25 text-xs">✓</span>
              {p}
            </li>
          ))}
        </ul>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => showToast('Upgrade coming soon', '👑')}
          className="mt-5 w-full rounded-2xl bg-white py-4 font-display text-lg font-extrabold text-brand-600 shadow-soft"
        >
          Upgrade to Pro
        </motion.button>
      </motion.div>

      {/* Comparison table */}
      <h3 className="mb-2 font-display text-lg font-extrabold text-ink">Free vs Pro</h3>
      <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
        <div className="grid grid-cols-3 bg-cream px-4 py-3 text-sm font-extrabold text-ink">
          <span>Feature</span>
          <span className="text-center">Free</span>
          <span className="text-center text-brand-600">Pro</span>
        </div>
        {comparison.map((row, i) => (
          <div
            key={row.feature}
            className={`grid grid-cols-3 px-4 py-3 text-sm font-semibold text-ink-soft ${
              i % 2 ? 'bg-cream/50' : ''
            }`}
          >
            <span className="font-extrabold text-ink">{row.feature}</span>
            <span className="text-center">{row.free}</span>
            <span className="text-center font-extrabold text-brand-600">{row.pro}</span>
          </div>
        ))}
      </div>
    </Screen>
  )
}
