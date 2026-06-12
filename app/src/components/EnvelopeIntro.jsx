import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import envelopeUrl from '../assets/envelope.svg'

const EASE_OUT = [0.22, 1, 0.36, 1]

/*
 * The landing moment, staged like a real envelope:
 *   1. click → the orange flap hinges up and back (3D, on its top edge)
 *   2. the paper slides straight up out of the open envelope
 *   3. the paper grows until it fills the screen — the page IS the paper
 *
 * The flat invitation SVG is split into live layers with clip-paths:
 * flap (top triangle, tip at 63% height), pocket (the rest), and a
 * cream interior that shows once the flap lifts.
 */
export default function EnvelopeIntro({ onDone }) {
  const reduce = useReducedMotion()
  const paperRef = useRef(null)
  // px geometry for the rise + grow-to-fullscreen, measured at click time
  const geo = useRef({ riseY: -260, x: 0, y: -380, scale: 4 })
  const [stage, setStage] = useState('closed') // closed | opening | growing
  // once the flap has swung past edge-on, the paper renders ABOVE it
  const [paperFront, setPaperFront] = useState(false)
  const opening = stage !== 'closed'
  const growing = stage === 'growing'

  // lock page scroll while the envelope is on screen
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  function open() {
    if (opening) return
    if (reduce) { onDone(); return }

    // measure the paper so the grow phase covers the viewport exactly
    const rect = paperRef.current.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    const riseY = -0.72 * rect.height
    const cx = rect.x + rect.width / 2
    const cy = rect.y + rect.height / 2 + riseY
    geo.current = {
      riseY,
      x: vw / 2 - cx,
      y: riseY + (vh / 2 - cy),
      scale: Math.max(vw / rect.width, vh / rect.height) * 1.06,
    }

    setStage('opening')
    setTimeout(() => setPaperFront(true), 430)
    setTimeout(() => setStage('growing'), 1500)
    setTimeout(onDone, 2750)
  }

  return (
    <motion.div
      className="intro"
      initial={{ opacity: 1 }}
      animate={{ opacity: growing ? 0 : 1 }}
      transition={growing ? { delay: 0.85, duration: 0.35, ease: 'easeOut' } : { duration: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
      style={{ pointerEvents: opening ? 'none' : 'auto' }}
    >
      {/* clip shapes traced from the artwork — the flap's tip is a rounded
          bezier and its edges meet the top edge inside the corners */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <clipPath id="bosFlapClip" clipPathUnits="objectBoundingBox">
            <path d="M 0.0435 0 L 0.4016 0.5371 C 0.4594 0.6238 0.5530 0.6238 0.6108 0.5371 L 0.9689 0 Z" />
          </clipPath>
          <clipPath id="bosPocketClip" clipPathUnits="objectBoundingBox">
            <path d="M 0 0 L 0.0435 0 L 0.4016 0.5371 C 0.4594 0.6238 0.5530 0.6238 0.6108 0.5371 L 0.9689 0 L 1 0 L 1 1 L 0 1 Z" />
          </clipPath>
          {/* the flap shape mirrored vertically — for the flap's back face,
              which is pre-rotated 180° so it lands exactly on the front */}
          <clipPath id="bosFlapClipMirror" clipPathUnits="objectBoundingBox">
            <path d="M 0.0435 1 L 0.4016 0.4629 C 0.4594 0.3762 0.5530 0.3762 0.6108 0.4629 L 0.9689 1 Z" />
          </clipPath>
        </defs>
      </svg>

      <motion.div
        className="intro__heading"
        animate={opening ? { opacity: 0, y: -16 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1>You've got an invitation</h1>
        <p>Click the envelope to open it</p>
      </motion.div>

      <button className="intro__btn" onClick={open} aria-label="Open the invitation">
        <div className="intro__stage">
          {/* gentle float while sealed; settles when opening */}
          <motion.div
            className="env-float"
            animate={opening ? { y: 0 } : { y: [0, -9, 0] }}
            transition={opening ? { duration: 0.3 } : { duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* inside of the envelope, revealed when the flap lifts */}
            <div className="env3d__interior" />

            {/* the orange flap — hinges open on its top edge and STAYS open
                (cream inner face showing) while the paper comes out */}
            <motion.div
              className="env3d__flap"
              style={{ transformPerspective: 1100 }}
              animate={{
                rotateX: opening ? -168 : 0,
                opacity: growing ? 0 : 1,
              }}
              transition={{
                rotateX: opening ? { duration: 0.85, ease: 'easeInOut' } : { duration: 0 },
                opacity: { duration: 0.45, delay: growing ? 0.1 : 0 },
              }}
            >
              <img className="env3d__flap-front" src={envelopeUrl} alt="" />
              <div className="env3d__flap-back" />
            </motion.div>

            {/* the paper inside — rises straight up, then grows to fill the screen */}
            <motion.div
              ref={paperRef}
              className="intro__paper"
              style={{ zIndex: paperFront ? 6 : 2 }}
              animate={
                growing
                  ? { x: geo.current.x, y: geo.current.y, scale: geo.current.scale, borderRadius: 0 }
                  : opening
                    ? { y: geo.current.riseY, scale: 1 }
                    : { y: 0, scale: 1 }
              }
              transition={
                growing
                  ? { duration: 0.85, ease: [0.4, 0, 0.2, 1] }
                  : opening
                    ? { delay: 0.6, duration: 0.9, ease: EASE_OUT }
                    : { duration: 0 }
              }
              aria-hidden="true"
            >
              <motion.div
                className="intro__paper-content"
                animate={{ opacity: growing ? 0 : 1 }}
                transition={{ duration: 0.25 }}
              >
                <svg className="intro__paper-flourish" viewBox="0 0 240 18" aria-hidden="true">
                  <line x1="6" y1="9" x2="100" y2="9" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="120" cy="9" r="6.5" fill="#EE7230" />
                  <circle cx="117" cy="6.8" r="1.2" fill="#FDFAF4" />
                  <circle cx="123" cy="6.8" r="1.2" fill="#FDFAF4" />
                  <circle cx="120" cy="11.6" r="1.2" fill="#FDFAF4" />
                  <line x1="140" y1="9" x2="234" y2="9" stroke="currentColor" strokeWidth="1.2" />
                </svg>
                <span className="eyebrow">You're cordially invited to</span>
                <span className="logo-bos intro__paper-logo" aria-hidden="true" />
                <p className="intro__paper-meta">
                  Thursday, July 9, 2026<br />DinkSF · San Francisco
                </p>
              </motion.div>
            </motion.div>

            {/* the envelope body in front — the paper emerges from behind it */}
            <motion.img
              className="env3d__pocket"
              src={envelopeUrl}
              alt=""
              animate={{ opacity: growing ? 0 : 1 }}
              transition={{ duration: 0.4, delay: growing ? 0.15 : 0 }}
            />
          </motion.div>
        </div>
      </button>

      <motion.button
        className="intro__skip"
        onClick={onDone}
        animate={{ opacity: opening ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        Skip straight to the details →
      </motion.button>
    </motion.div>
  )
}
