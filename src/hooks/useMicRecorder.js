import { useCallback, useEffect, useRef, useState } from 'react'

// Microphone recording with a LIVE canvas waveform from real mic amplitude
// (Web Audio analyser). If mic permission is denied or unavailable (e.g.
// non-HTTPS), switches to `fallback` ("Hold to speak") mode where holding the
// button animates a fake waveform — fully testable without a mic.
//
//   const mic = useMicRecorder({ maxSeconds: 15, onStop })
//   mic.begin() / mic.end() · mic.recording · mic.seconds · mic.fallback
//   <canvas ref={mic.canvasRef} />  — waveform is drawn here while recording
export function useMicRecorder({ maxSeconds = 15, onStop, color = '#d4a857' } = {}) {
  const [recording, setRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [fallback, setFallback] = useState(false)

  const canvasRef = useRef(null)
  const recordingRef = useRef(false)
  const fallbackRef = useRef(false)
  const streamRef = useRef(null)
  const audioCtxRef = useRef(null)
  const analyserRef = useRef(null)
  const rafRef = useRef(0)
  const timerRef = useRef(0)
  const fakeBarsRef = useRef(new Array(32).fill(0.08))
  const onStopRef = useRef(onStop)
  onStopRef.current = onStop

  // Detect "no mic possible" upfront so the UI shows Hold-to-speak immediately.
  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia || window.isSecureContext === false) {
      setFallback(true)
      fallbackRef.current = true
    }
  }, [])

  const drawLoop = useCallback(() => {
    if (!recordingRef.current) return
    const canvas = canvasRef.current
    if (!canvas) {
      // canvas mounts on the next render after recording starts — keep waiting
      rafRef.current = requestAnimationFrame(drawLoop)
      return
    }
    const ctx = canvas.getContext('2d')
    const W = canvas.width
    const H = canvas.height
    ctx.clearRect(0, 0, W, H)

    const N = 32
    let amps
    if (analyserRef.current) {
      // real mic: sample the time-domain waveform into N amplitudes
      const data = new Uint8Array(analyserRef.current.fftSize)
      analyserRef.current.getByteTimeDomainData(data)
      amps = Array.from({ length: N }, (_, i) => {
        const v = data[Math.floor((i / N) * data.length)]
        return Math.abs(v - 128) / 128
      })
    } else {
      // fake mode: gentle random walk so the bars feel alive
      amps = fakeBarsRef.current.map((v) => {
        const next = v + (Math.random() - 0.48) * 0.22
        return Math.max(0.04, Math.min(0.85, next))
      })
      fakeBarsRef.current = amps
    }

    const bw = W / N
    ctx.fillStyle = color
    amps.forEach((a, i) => {
      const h = Math.max(3, a * H * 1.6)
      ctx.fillRect(i * bw + bw * 0.25, (H - h) / 2, bw * 0.5, h)
    })
    rafRef.current = requestAnimationFrame(drawLoop)
  }, [color])

  const cleanupAudio = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    clearInterval(timerRef.current)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    audioCtxRef.current?.close().catch(() => {})
    audioCtxRef.current = null
    analyserRef.current = null
  }, [])

  const end = useCallback(() => {
    if (!recordingRef.current) return
    recordingRef.current = false
    setRecording(false)
    cleanupAudio()
    onStopRef.current?.()
  }, [cleanupAudio])

  const begin = useCallback(async () => {
    if (recordingRef.current) return false
    if (!fallbackRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        streamRef.current = stream
        const AC = window.AudioContext || window.webkitAudioContext
        const ctx = new AC()
        audioCtxRef.current = ctx
        const analyser = ctx.createAnalyser()
        analyser.fftSize = 512
        ctx.createMediaStreamSource(stream).connect(analyser)
        analyserRef.current = analyser
      } catch {
        // denied/unavailable → flip to Hold-to-speak; caller's UI updates
        setFallback(true)
        fallbackRef.current = true
        return false
      }
    } else {
      fakeBarsRef.current = new Array(32).fill(0.08)
    }
    recordingRef.current = true
    setRecording(true)
    setSeconds(0)
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    rafRef.current = requestAnimationFrame(drawLoop)
    return true
  }, [drawLoop])

  // Auto-stop at the cap (kept out of the state updater — StrictMode-safe).
  useEffect(() => {
    if (recording && seconds >= maxSeconds) end()
  }, [recording, seconds, maxSeconds, end])

  // Full cleanup if the screen unmounts mid-recording.
  useEffect(() => () => {
    recordingRef.current = false
    cleanupAudio()
  }, [cleanupAudio])

  return { recording, seconds, fallback, begin, end, canvasRef }
}
