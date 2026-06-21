import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Mascot from '../components/Mascot'

// UI-only auth. No validation, no real auth — any "Continue" → Home.
export default function Auth() {
  const navigate = useNavigate()
  const enter = (e) => {
    e?.preventDefault()
    navigate('/home')
  }

  return (
    <div className="flex h-full flex-col bg-cream px-7 pt-[max(2rem,env(safe-area-inset-top))]">
      {/* Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mt-6 flex flex-col items-center"
      >
        <Mascot mood="happy" size={104} float />
        <h1 className="mt-3 font-display text-3xl font-extrabold text-ink">Welcome back</h1>
        <p className="font-body font-semibold text-ink-soft">Log in to continue your story</p>
      </motion.div>

      {/* Form (non-functional) */}
      <form onSubmit={enter} className="mt-8 flex flex-col gap-3">
        <Field label="Email" type="email" placeholder="you@email.com" />
        <Field label="Password" type="password" placeholder="••••••••" />

        <motion.button
          whileTap={{ scale: 0.96 }}
          type="submit"
          className="mt-2 w-full rounded-2xl bg-brand-500 py-4 font-display text-lg font-extrabold text-white shadow-pop"
        >
          Continue
        </motion.button>
      </form>

      {/* Divider */}
      <div className="my-5 flex items-center gap-3 text-ink-soft/60">
        <div className="h-px flex-1 bg-black/10" />
        <span className="text-sm font-bold">or</span>
        <div className="h-px flex-1 bg-black/10" />
      </div>

      {/* Google (non-functional → Home) */}
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={enter}
        className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-black/10 bg-white py-4 font-display text-lg font-extrabold text-ink"
      >
        <span className="text-xl">🇬</span> Continue with Google
      </motion.button>

      <p className="mt-auto pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 text-center text-sm font-semibold text-ink-soft">
        New here?{' '}
        <button onClick={enter} className="font-extrabold text-brand-600">
          Create account
        </button>
      </p>
    </div>
  )
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-extrabold text-ink-soft">{label}</span>
      <input
        {...props}
        className="w-full rounded-2xl border-2 border-black/10 bg-white px-4 py-3.5 font-body font-semibold text-ink outline-none transition focus:border-brand-400"
      />
    </label>
  )
}
