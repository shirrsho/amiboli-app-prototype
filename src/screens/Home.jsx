import { useState } from 'react'
import { motion } from 'framer-motion'
import HomeTopBar from '../components/HomeTopBar'
import BookSection from '../components/BookSection'
import NotificationsSheet from '../components/NotificationsSheet'
import DownloadButton from '../components/DownloadButton'
import { useToast } from '../components/ToastProvider'
import { books } from '../data/dummyData'

// The heart of the app: a vertically scrolling, winding story map of books.
export default function Home() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const showToast = useToast()

  // Chapters are NOT playable — tapping only bounces + toasts.
  const handleChapterTap = (chapter) => {
    if (chapter.status === 'locked') {
      showToast('Locked — finish earlier chapters first', '🔒')
    } else {
      showToast('Story mode coming soon', '🎬')
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <HomeTopBar onOpenNotifications={() => setSheetOpen(true)} />

      <main className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-8 pt-2">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 px-1"
        >
          <h1 className="font-display text-2xl font-extrabold text-ink">Your Story Path</h1>
          <p className="text-sm font-semibold text-ink-soft">
            Tap the glowing chapter to keep going ✨
          </p>
        </motion.div>

        {books.map((book, i) => (
          <BookSection key={book.id} book={book} index={i} onChapterTap={handleChapterTap} />
        ))}

        <p className="mt-2 text-center text-xs font-bold text-ink-soft/50">
          More books on the way 📚
        </p>
      </main>

      {/* Floating install button */}
      <DownloadButton variant="fab" />

      <NotificationsSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </div>
  )
}
