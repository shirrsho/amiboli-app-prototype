import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Stage from '../components/play/Stage'
import { WaxSeal } from '../components/story/SceneNodes'
import { useTypewriter } from '../hooks/useTypewriter'
import { useSpeech } from '../hooks/useSpeech'
import { useMicRecorder } from '../hooks/useMicRecorder'
import { getPlayableScene } from '../data/scenes'
import { books, user, skills } from '../data/dummyData'
import { getTheme } from '../data/bookThemes'

// ─── The Stage: a generic beat player (/play/:bookId/:sceneId) ──────────────
// One fixed layout — header / stage / caption panel — that never changes.
// Beats drive everything, including the shadow-theatre stage (camera, poses,
// lighting, highlights) via their optional `stage` object. Zero scene-specific
// code lives here. Scoring is simulated; the mic is real.

const FEEDBACK_MS = 2500
const AUTO_ADVANCE_MS = 1500
const LISTENING_MS = 1000
const PANEL_H = 310 // fixed → the panel morph never moves the stage above it

const charIdOf = (speaker) => (speaker || '').toLowerCase()
const moodPose = (mood) =>
  mood === 'impressed' ? 'impressed' : mood === 'puzzled' ? 'puzzled' : 'speaking'

export default function Play() {
  const { bookId, sceneId } = useParams()
  const [runKey, setRunKey] = useState(0) // bump → full clean replay
  const scene = getPlayableScene(bookId, sceneId)
  const book = books.find((b) => b.id === bookId)
  if (!scene || !book) return <Navigate to="/home" replace />
  return <Player key={runKey} scene={scene} book={book} onReplay={() => setRunKey((k) => k + 1)} />
}

function Player({ scene, book, onReplay }) {
  const navigate = useNavigate()
  const theme = getTheme(book.themeId)
  const p = theme.palette
  const npcId = charIdOf(scene.npc.name)

  // ── core state ──
  const [beatIndex, setBeatIndex] = useState(0)
  const [turnPhase, setTurnPhase] = useState('prompt') // prompt|recording|listening|feedback
  const [results, setResults] = useState([])
  const [finished, setFinished] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [muted, setMuted] = useState(false)
  const startRef = useRef(Date.now())
  const [elapsed, setElapsed] = useState(0)
  const timersRef = useRef([])
  const mutedRef = useRef(false)
  mutedRef.current = muted

  // ── stage direction state (camera/lighting persist; highlight is one-shot) ──
  const [stageState, setStageState] = useState({
    camera: 'wide',
    lighting: 'calm',
    poses: { [npcId]: 'idle', you: 'idle' },
    present: [npcId, 'you'],
  })
  const [highlight, setHighlight] = useState(null) // { prop, key }
  useEffect(() => {
    if (!highlight) return
    const t = setTimeout(() => setHighlight(null), 2200)
    return () => clearTimeout(t)
  }, [highlight])

  const beat = scene.beats[beatIndex]
  const isUserTurn = beat?.type === 'user_turn'
  const isStoryBeat = beat?.type === 'narration' || beat?.type === 'npc_line'
  const sim = beat?.simulated

  const { speak, stop: stopSpeech } = useSpeech()
  const later = useCallback((fn, ms) => {
    timersRef.current.push(setTimeout(fn, ms))
  }, [])
  useEffect(() => () => timersRef.current.forEach(clearTimeout), [])

  // ── beat sequencing ──
  const finish = useCallback(() => {
    setElapsed(Math.round((Date.now() - startRef.current) / 1000))
    setFinished(true)
    stopSpeech()
    // curtain: settle the stage
    setStageState((prev) => ({
      ...prev,
      camera: 'wide',
      lighting: 'calm',
      poses: Object.fromEntries(Object.keys(prev.poses).map((k) => [k, 'idle'])),
    }))
  }, [stopSpeech])

  const advance = useCallback(() => {
    stopSpeech()
    setBeatIndex((i) => {
      if (i >= scene.beats.length - 1) {
        finish()
        return i
      }
      return i + 1
    })
  }, [scene.beats.length, finish, stopSpeech])

  // On beat enter: apply stage directions (+ auto-direction), voice story lines.
  useEffect(() => {
    if (finished) return
    const b = scene.beats[beatIndex]
    const st = b.stage || {}

    setStageState((prev) => {
      const next = { ...prev }
      // camera: explicit target wins; the user's turn auto-drifts to them
      if (st.camera) next.camera = st.camera
      else if (b.type === 'user_turn') next.camera = 'you'
      if (st.lighting) next.lighting = st.lighting
      // poses: auto 'speaking' for the speaker, then explicit overrides
      const poses = { ...prev.poses }
      if (b.type === 'npc_line') poses[charIdOf(b.speaker) || npcId] = 'speaking'
      if (b.type === 'user_turn') poses.you = 'speaking'
      if (st.poses) Object.entries(st.poses).forEach(([id, pose]) => (poses[id] = pose))
      next.poses = poses
      // entrances / exits
      let present = prev.present
      if (st.enter && !present.includes(st.enter)) present = [...present, st.enter]
      if (st.exit) present = present.filter((c) => c !== st.exit)
      next.present = present
      return next
    })
    if (st.highlight) setHighlight({ prop: st.highlight, key: beatIndex })

    if (b.type === 'user_turn') setTurnPhase('prompt')
    else if (!mutedRef.current) speak(b.text)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beatIndex, finished])

  // ── story mode: typewriter + tap/auto advance ──
  const tw = useTypewriter(isStoryBeat ? beat.text : '', isStoryBeat && !finished)
  useEffect(() => {
    if (!isStoryBeat || !tw.done || finished) return
    const t = setTimeout(advance, AUTO_ADVANCE_MS)
    return () => clearTimeout(t)
  }, [tw.done, isStoryBeat, beatIndex, finished, advance])

  const onCaptionTap = () => {
    if (finished || !isStoryBeat) return
    if (tw.done) advance()
    else tw.finish()
  }

  // ── user turn: record → listening → feedback → advance ──
  const handleRecordingStop = useCallback(() => {
    setTurnPhase('listening')
    later(() => {
      setTurnPhase('feedback')
      const s = scene.beats[beatIndex]?.simulated
      if (s) {
        setResults((r) => [...r, s.scores])
        const big = s.isBigMoment || Object.values(s.scores).some((v) => v >= 90)
        // the NPC's reaction directs the stage: mood pose (+ revelation on big)
        setStageState((prev) => ({
          ...prev,
          lighting: big ? 'revelation' : prev.lighting,
          poses: { ...prev.poses, [npcId]: moodPose(s.mood), you: 'idle' },
        }))
        if (big) chime()
      }
      later(advance, FEEDBACK_MS)
    }, LISTENING_MS)
  }, [beatIndex, scene.beats, advance, later, npcId])

  const mic = useMicRecorder({ maxSeconds: 15, onStop: handleRecordingStop, color: p.accent })

  // ── derived display ──
  const averages = {}
  skills.forEach((s) => {
    averages[s.key] = results.length
      ? Math.round(results.reduce((a, r) => a + r[s.key], 0) / results.length)
      : 0
  })
  const sceneAvg = results.length
    ? Math.round(
        results.reduce((a, r) => a + Object.values(r).reduce((x, y) => x + y, 0) / 4, 0) /
          results.length
      )
    : 0

  const activeChar = finished
    ? null
    : beat?.type === 'npc_line'
    ? charIdOf(beat.speaker) || npcId
    : isUserTurn
    ? turnPhase === 'feedback'
      ? npcId
      : 'you'
    : null
  const chip = isUserTurn && turnPhase === 'feedback' ? { ...chipFor(sim.scores), key: beatIndex } : null

  const characters = stageState.present.map((id) => ({
    id,
    name: id === 'you' ? 'You' : id === npcId ? scene.npc.name : id[0].toUpperCase() + id.slice(1),
    pose: stageState.poses[id] ?? 'idle',
    active: id === activeChar,
    talking:
      id === activeChar && (isStoryBeat ? !tw.done : isUserTurn && turnPhase === 'recording'),
  }))

  return (
    <div className="relative flex h-full flex-col" style={{ background: '#0b0e1c' }}>
      {/* ── 1 · Header ── */}
      <header className="relative z-30 flex h-16 shrink-0 items-center gap-3 px-4 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <AnimatePresence mode="wait" initial={false}>
          {leaving ? (
            <motion.div
              key="confirm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex w-full items-center gap-2"
            >
              <span className="flex-1 font-serif text-[15px] font-semibold" style={{ color: p.textOnBg }}>
                Leave the scene?
              </span>
              <button
                onClick={() =>
                  navigate(`/ad/${book.id}/${scene.id}`, { state: { next: `/book/${book.id}` } })
                }
                className="rounded-full bg-red-500/90 px-4 py-1.5 text-sm font-extrabold text-white"
              >
                Leave
              </button>
              <button
                onClick={() => setLeaving(false)}
                className="rounded-full px-4 py-1.5 text-sm font-extrabold"
                style={{ background: p.accent, color: p.ctaText }}
              >
                Stay
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="bar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex w-full items-center gap-3"
            >
              <button
                onClick={() => setLeaving(true)}
                aria-label="Leave scene"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black/35 text-white backdrop-blur-md"
              >
                ✕
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex gap-1">
                  {scene.beats.map((_, i) => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full transition-colors duration-300"
                      style={{
                        background:
                          i < beatIndex || finished
                            ? p.accent
                            : i === beatIndex
                            ? `${p.accent}88`
                            : 'rgba(255,255,255,0.15)',
                      }}
                    />
                  ))}
                </div>
                <p
                  className="mt-1 truncate text-center text-[10px] font-extrabold uppercase tracking-[0.16em]"
                  style={{ color: p.textMuted }}
                >
                  Scene {scene.sceneNumber} · {scene.title}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-0.5 rounded-full bg-black/35 px-2 py-1 backdrop-blur-md">
                <motion.span
                  animate={finished ? { opacity: 0.25, scale: 0.8, filter: 'grayscale(1)' } : {}}
                  transition={{ duration: 0.6 }}
                  className="text-sm"
                >
                  ⚡
                </motion.span>
                <span className="text-xs font-extrabold text-white">
                  {finished ? user.energy.current - 1 : user.energy.current}/{user.energy.max}
                </span>
              </div>
              <button
                onClick={() =>
                  setMuted((m) => {
                    if (!m) stopSpeech()
                    return !m
                  })
                }
                aria-label={muted ? 'Unmute' : 'Mute'}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black/35 text-base backdrop-blur-md"
              >
                {muted ? '🔇' : '🔊'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── 2 · The shadow-theatre stage (fixed viewport; camera moves inside) ── */}
      <div className="relative z-10 min-h-0 flex-1">
        <Stage
          setId={scene.setId}
          theme={theme}
          camera={stageState.camera}
          lighting={stageState.lighting}
          highlight={highlight}
          characters={characters}
          reaction={
            isUserTurn && turnPhase === 'feedback' ? { charId: npcId, text: sim.npcReaction } : null
          }
          chip={chip}
        />
      </div>

      {/* ── 3 · The caption panel (fixed height — morphs, never moves) ── */}
      <div
        className="relative z-20 flex shrink-0 flex-col rounded-t-3xl border-t backdrop-blur-md"
        style={{ height: PANEL_H, background: p.panel, borderColor: p.panelBorder }}
        onClick={onCaptionTap}
      >
        <div className="min-h-0 flex-1 overflow-hidden px-5 pt-4">
          <AnimatePresence mode="wait" initial={false}>
            {finished ? (
              <PanelSummary
                key="summary"
                scene={scene}
                theme={theme}
                averages={averages}
                sceneAvg={sceneAvg}
                elapsed={elapsed}
                onResults={() => navigate(`/score/${book.id}/${scene.id}`, { state: { elapsed } })}
                onReplay={onReplay}
              />
            ) : isStoryBeat ? (
              <PanelStory key={`story-${beatIndex}`} beat={beat} tw={tw} theme={theme} npcName={scene.npc.name} />
            ) : turnPhase === 'feedback' ? (
              <PanelFeedback key={`fb-${beatIndex}`} sim={sim} theme={theme} />
            ) : (
              <PanelMic key={`mic-${beatIndex}`} beat={beat} theme={theme} mic={mic} phase={turnPhase} />
            )}
          </AnimatePresence>
        </div>

        {/* persistent skill meters — running averages, no numbers */}
        <div className="flex shrink-0 gap-3 px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
          {skills.map((s) => (
            <div key={s.key} className="flex-1">
              <p className="mb-0.5 text-[8px] font-extrabold uppercase tracking-wider" style={{ color: p.textMuted }}>
                {s.label}
              </p>
              <div className="h-[3px] overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: s.color }}
                  animate={{ width: `${averages[s.key]}%` }}
                  transition={{ type: 'spring', stiffness: 80, damping: 20 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Caption panel modes (fade in/out ~220ms; the panel itself never unmounts) ─
const modeAnim = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.22, ease: 'easeOut' },
}

function PanelStory({ beat, tw, theme, npcName }) {
  const p = theme.palette
  const speaker = beat.type === 'npc_line' ? beat.speaker || npcName : 'Narrator'
  return (
    <motion.div {...modeAnim} className="flex h-full flex-col">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.2em]" style={{ color: p.accent }}>
        {speaker}
      </p>
      <p className="mt-2 font-serif text-[18px] leading-relaxed" style={{ color: p.textOnBg }}>
        {tw.display}
        {!tw.done && <span className="opacity-60">▍</span>}
      </p>
      {tw.done && (
        <motion.span
          className="mt-auto self-end pb-1 text-sm font-extrabold"
          style={{ color: p.textMuted }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        >
          tap ▸
        </motion.span>
      )}
    </motion.div>
  )
}

function PanelMic({ beat, theme, mic, phase }) {
  const p = theme.palette
  const listening = phase === 'listening'
  return (
    <motion.div {...modeAnim} className="flex h-full flex-col" onClick={(e) => e.stopPropagation()}>
      <p className="text-[12px] font-extrabold" style={{ color: p.accent }}>
        🎙 Your turn — {beat.intent}
      </p>
      <p className="mt-1.5 font-serif text-[16px] italic leading-snug" style={{ color: p.textOnBg, opacity: 0.55 }}>
        “{beat.suggestedLine}”
      </p>
      <p className="mt-0.5 text-[10px] font-bold" style={{ color: p.textMuted }}>
        say it like this — or in your own words
      </p>

      {listening ? (
        <div className="mt-auto flex flex-col items-center gap-2 pb-2">
          <motion.div className="h-1.5 w-40 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }}>
            <motion.div
              className="h-full w-1/3 rounded-full"
              style={{ background: p.accent }}
              animate={{ x: ['-100%', '320%'] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
          <p className="text-sm font-extrabold" style={{ color: p.textMuted }}>
            listening…
          </p>
        </div>
      ) : (
        <div className="mt-auto flex items-center gap-4 pb-2">
          <div className="relative shrink-0">
            {!mic.recording && (
              <motion.span
                className="absolute -inset-2 rounded-full"
                style={{ background: `radial-gradient(circle, ${p.glow}, transparent 70%)` }}
                animate={{ scale: [1, 1.25, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
            )}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => !mic.fallback && (mic.recording ? mic.end() : mic.begin())}
              onPointerDown={() => mic.fallback && mic.begin()}
              onPointerUp={() => mic.fallback && mic.end()}
              onPointerCancel={() => mic.fallback && mic.end()}
              onPointerLeave={() => mic.fallback && mic.recording && mic.end()}
              className="relative grid h-16 w-16 place-items-center rounded-full text-2xl"
              style={{
                background: mic.recording ? '#d94f4f' : `linear-gradient(135deg, ${p.accent}, ${p.accentDeep})`,
                boxShadow: `0 8px 20px -8px ${p.glow}`,
              }}
              aria-label={mic.recording ? 'Stop recording' : 'Start speaking'}
            >
              {mic.recording ? '⏹' : '🎙'}
            </motion.button>
          </div>
          <div className="min-w-0 flex-1">
            {mic.recording ? (
              <>
                <canvas ref={mic.canvasRef} width={300} height={44} className="h-11 w-full" />
                <p className="text-right text-[11px] font-extrabold tabular-nums" style={{ color: p.textMuted }}>
                  0:{String(mic.seconds).padStart(2, '0')} / 0:15
                </p>
              </>
            ) : (
              <p className="text-[13px] font-extrabold" style={{ color: p.textMuted }}>
                {mic.fallback ? 'Hold to speak' : 'Tap to speak'}
              </p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}

function PanelFeedback({ sim, theme }) {
  const p = theme.palette
  return (
    <motion.div {...modeAnim} className="flex h-full flex-col">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.2em]" style={{ color: p.accent }}>
        You said
      </p>
      <p className="mt-2 font-serif text-[17px] leading-relaxed" style={{ color: p.textOnBg }}>
        “{sim.transcript}”
      </p>
    </motion.div>
  )
}

// End-of-scene summary, morphing inside the same panel.
function PanelSummary({ scene, theme, averages, sceneAvg, elapsed, onResults, onReplay }) {
  const p = theme.palette
  const weakest = skills.reduce((a, b) => (averages[a.key] <= averages[b.key] ? a : b))
  const COACH = {
    relevance: 'Keep each line tied to what is happening — you drifted once or twice.',
    smoothness: 'Your pauses got shorter as the scene went on — keep it up.',
    clarity: 'Shape the long words a little more — your clarity will jump.',
    grammar: 'Watch your tenses in the fast moments — slow down half a beat.',
  }
  const mins = Math.floor(elapsed / 60)
  const secs = String(elapsed % 60).padStart(2, '0')
  return (
    <motion.div {...modeAnim} className="flex h-full flex-col">
      <div className="flex items-center gap-3">
        <motion.div
          initial={{ scale: 2.2, opacity: 0, rotate: -14 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 16, delay: 0.15 }}
        >
          <WaxSeal score={sceneAvg} color={theme.sealColor} size={56} />
        </motion.div>
        <div className="min-w-0">
          <h2 className="font-serif text-[20px] font-bold leading-tight" style={{ color: p.textOnBg }}>
            Scene sealed
          </h2>
          <p className="text-[11px] font-bold" style={{ color: p.textMuted }}>
            Scene {scene.sceneNumber} · {scene.title} · {mins}:{secs}
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
        {skills.map((s) => (
          <div key={s.key}>
            <div className="flex justify-between text-[10px] font-extrabold" style={{ color: p.textMuted }}>
              <span>{s.label}</span>
              <span style={{ color: p.textOnBg }}>{averages[s.key]}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full"
                style={{ background: s.color }}
                initial={{ width: 0 }}
                animate={{ width: `${averages[s.key]}%` }}
                transition={{ duration: 0.7, delay: 0.3 }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-2.5 font-serif text-[13px] italic leading-snug" style={{ color: p.textMuted }}>
        {COACH[weakest.key]}
      </p>

      <div className="mt-auto flex gap-2 pb-1">
        <button
          onClick={onReplay}
          className="flex-1 rounded-xl border py-2.5 text-sm font-extrabold"
          style={{ borderColor: p.panelBorder, color: p.textOnBg }}
        >
          Replay scene
        </button>
        <button
          onClick={onResults}
          className="flex-1 rounded-xl py-2.5 text-sm font-extrabold"
          style={{ background: `linear-gradient(135deg, ${p.accent}, ${p.accentDeep})`, color: p.ctaText }}
        >
          See your results →
        </button>
      </div>
    </motion.div>
  )
}

// ─── helpers ─────────────────────────────────────────────────────────────────
function chipFor(scores) {
  const label = (k) => skills.find((s) => s.key === k)?.label.toLowerCase() ?? k
  const entries = Object.entries(scores)
  const [maxK, maxV] = entries.reduce((a, b) => (b[1] > a[1] ? b : a))
  const [minK, minV] = entries.reduce((a, b) => (b[1] < a[1] ? b : a))
  return maxV >= 85
    ? { text: `+${maxV} ${label(maxK)}`, golden: maxV >= 90 }
    : { text: `${label(minK)} ${minV}`, golden: false }
}

// Soft two-note chime via Web Audio — no audio files.
function chime() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext
    const ctx = new AC()
    const note = (freq, at) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'sine'
      o.frequency.value = freq
      o.connect(g)
      g.connect(ctx.destination)
      const t = ctx.currentTime + at
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(0.1, t + 0.03)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4)
      o.start(t)
      o.stop(t + 0.45)
    }
    note(659.25, 0) // E5
    note(987.77, 0.12) // B5
    setTimeout(() => ctx.close().catch(() => {}), 1200)
  } catch {
    /* silent */
  }
}
