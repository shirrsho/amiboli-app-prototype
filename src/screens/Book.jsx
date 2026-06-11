import { Fragment } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Scenery from '../components/story/Scenery'
import StoryCard from '../components/story/StoryCard'
import { SealedScene, CurrentScene, FogScene, NarrationLine } from '../components/story/SceneNodes'
import { useToast } from '../components/ToastProvider'
import { books } from '../data/dummyData'
import { getTheme } from '../data/bookThemes'

// Level 2: one book's own immersive screen (/book/:id).
// Fully themed world + recap/intro card + the vertical scene path.
// Scenes are NOT playable — taps answer with a toast only.
export default function Book() {
  const { id } = useParams()
  const navigate = useNavigate()
  const showToast = useToast()

  const book = books.find((b) => b.id === id)
  if (!book) return <Navigate to="/home" replace />

  const theme = getTheme(book.themeId)
  const p = theme.palette
  const scenes = book.scenes
  const started = scenes.some((s) => s.status === 'completed')
  const currentNo = scenes.findIndex((s) => s.status === 'current') + 1

  const tapScene = (status) => {
    if (status === 'completed') showToast('This scene is already sealed', '📜')
    else if (status === 'current') showToast('Story mode coming soon', '🎬')
    else showToast('The fog hasn’t lifted yet', '🌫️')
  }

  return (
    <div className="relative flex h-full flex-col" style={{ background: p.bgDeep }}>
      {/* Themed world with this book's single ambient effect */}
      <Scenery theme={theme} ambient />

      {/* Back + title */}
      <header className="relative z-20 flex shrink-0 items-center gap-3 px-4 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => navigate('/home')}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-black/35 text-lg text-white backdrop-blur-md"
          aria-label="Back to all stories"
        >
          ←
        </motion.button>
        <h1 className="truncate font-serif text-xl font-bold" style={{ color: p.textOnBg }}>
          {book.title}
        </h1>
      </header>

      <main className="no-scrollbar relative z-10 min-h-0 flex-1 overflow-y-auto px-5 pb-10 pt-1">
        {/* Recap (in progress) or intro (not started) */}
        <StoryCard
          book={book}
          theme={theme}
          started={started}
          currentSceneNo={currentNo}
          onCta={() => showToast('Story mode coming soon', '🎬')}
        />

        {/* The scene path: a single centered column on a dotted line */}
        <div className="relative mt-6 flex flex-col items-center gap-4">
          <div
            className="absolute inset-y-2 left-1/2 w-[2px] -translate-x-1/2"
            style={{
              backgroundImage: `repeating-linear-gradient(to bottom, ${p.accent} 0 4px, transparent 4px 12px)`,
              opacity: 0.3,
            }}
          />
          {scenes.map((scene, i) => (
            <Fragment key={scene.id}>
              {scene.status === 'completed' && (
                <SealedScene scene={scene} index={i} theme={theme} onTap={() => tapScene('completed')} />
              )}
              {scene.status === 'current' && (
                <CurrentScene
                  scene={scene}
                  index={i}
                  theme={theme}
                  started={started}
                  onTap={() => tapScene('current')}
                />
              )}
              {scene.status === 'locked' && (
                <FogScene
                  index={i}
                  theme={theme}
                  revealHint={`Finish Scene ${currentNo} to reveal`}
                  onTap={() => tapScene('locked')}
                />
              )}
              {scene.status === 'completed' && scene.narrationAfter && i < scenes.length - 1 && (
                <NarrationLine text={scene.narrationAfter} theme={theme} />
              )}
            </Fragment>
          ))}
        </div>
      </main>
    </div>
  )
}
