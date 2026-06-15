import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import envelopeUrl from '../assets/envelope.svg'
import InviteContent from './InviteContent.jsx'

const EASE_OUT = [0.22, 1, 0.36, 1]

/*
 * The landing moment, staged like a real envelope — ONE STEP AT A TIME:
 *   1. flap  → the orange flap hinges up and back, ON TOP of the paper
 *   2. rising → only once the flap is fully open does the paper slide ALL THE
 *               WAY out (its bottom clears the envelope) IN FRONT of the flap
 *   3. growing → the fully-emerged paper grows to fill the screen
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
  const [stage, setStage] = useState('closed') // closed | flap | rising | settle | growing
  const opening = stage !== 'closed'
  const flapOpen = opening                     // flap is open from 'flap' onward
  const emerged = stage === 'rising' || stage === 'settle' || stage === 'growing'
  const onTop = stage === 'settle' || stage === 'growing' // paper resting in front
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

    const rect = paperRef.current.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    // lift the paper until its BOTTOM clears the envelope's top edge — fully out
    const stageEl = paperRef.current.closest('.intro__stage')
    const stageTop = stageEl ? stageEl.getBoundingClientRect().top : rect.top
    const riseY = -(rect.bottom - stageTop) - 8
    // grow from the settled position to fill the screen — becomes the page
    const cx = rect.x + rect.width / 2
    const cy = rect.y + rect.height / 2
    geo.current = {
      riseY,
      growX: vw / 2 - cx,
      growY: vh / 2 - cy,
      scale: Math.max(vw / rect.width, vh / rect.height) * 1.06,
      radius: 0,
    }

    // sequential, but snappy — the paper doesn't dawdle inside the envelope
    setStage('flap')                                   // 1. flap opens (on top)
    setTimeout(() => setStage('rising'), 520)           // 2. paper rises fully out (up)
    setTimeout(() => setStage('settle'), 1240)          // 3. comes back down ONTO the envelope
    setTimeout(() => setStage('growing'), 1760)         // 4. then zoom up onto the hero
    setTimeout(onDone, 2960)
  }

  return (
    <motion.div
      className="intro"
      initial={{ opacity: 1 }}
      animate={{ opacity: growing ? 0 : 1 }}
      transition={growing ? { delay: 0.78, duration: 0.32, ease: 'easeOut' } : { duration: 0 }}
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
      </motion.div>

      <button className="intro__btn" onClick={open} aria-label="Open the invitation">
        <div className="intro__stage">
          {/* the click cue sits ON the envelope so it's obvious where to tap */}
          <motion.span
            className="intro__hint"
            animate={opening ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.3 }}
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" width="15" height="15"><path d="M9 11.5V5.5a1.5 1.5 0 013 0v5m0 0V4a1.5 1.5 0 013 0v6.5m0 0V6a1.5 1.5 0 013 0v8a6 6 0 01-6 6h-1.2a4 4 0 01-2.9-1.2l-3.1-3.3a1.6 1.6 0 012.2-2.3l1.7 1.5V11.5a1.5 1.5 0 013 0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Click to open
          </motion.span>
          {/* gentle float while sealed; settles when opening */}
          <motion.div
            className="env-float"
            animate={opening ? { y: 0 } : { y: [0, -9, 0] }}
            transition={opening ? { duration: 0.3 } : { duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* inside of the envelope, revealed when the flap lifts */}
            <div className="env3d__interior" />

            {/* the orange flap — hinges open on its top edge and STAYS open
                (cream inner face showing) while the paper comes out.
                NOTE: never animate opacity on this node. It has
                transform-style: preserve-3d, and any opacity < 1 flattens the
                3D context — which hides the cream back face and flashes the
                orange front. So the flap keeps full opacity (cream) and is
                simply covered by the growing paper, then removed with the
                whole intro fade. */}
            <motion.div
              className="env3d__flap"
              /* while opening (closed→flap) the flap stays ON TOP (z5) so it
                 covers the paper that's still inside. Only once the paper
                 starts rising does the flap drop behind it (z1), so the
                 invitation emerges in front of the open flap. */
              style={{ transformPerspective: 1100, zIndex: emerged ? 1 : 5 }}
              animate={{ rotateX: flapOpen ? -168 : 0 }}
              transition={{
                rotateX: flapOpen ? { duration: 0.48, ease: 'easeInOut' } : { duration: 0 },
              }}
            >
              <img className="env3d__flap-front" src={envelopeUrl} alt="" />
              <div className="env3d__flap-back" />
            </motion.div>

            {/* the paper inside — rises straight up, then grows to fill the screen */}
            <motion.div
              ref={paperRef}
              className="intro__paper"
              /* behind the envelope body while rising out (emerges from inside),
                 then comes to the FRONT when it settles down onto the envelope
                 and stays in front through the grow. */
              style={{ zIndex: onTop ? 6 : 2 }}
              animate={
                growing
                  ? { x: geo.current.growX, y: geo.current.growY, scale: geo.current.scale, borderRadius: geo.current.radius }
                  : stage === 'settle'
                    ? { x: 0, y: 0, scale: 1 }            // back down onto the envelope
                    : stage === 'rising'
                      ? { y: geo.current.riseY, scale: 1 } // up and fully out
                      : { y: 0, scale: 1 }                 // closed / flap — inside
              }
              transition={
                growing
                  ? { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
                  : stage === 'settle'
                    ? { duration: 0.45, ease: EASE_OUT }
                    : stage === 'rising'
                      ? { duration: 0.62, ease: EASE_OUT }
                      : { duration: 0 }
              }
              aria-hidden="true"
            >
              {/* the same invitation card as the hero — zooms up to land
                  exactly on the hero card, so the handoff is seamless */}
              <div className="intro__paper-content">
                <InviteContent />
              </div>
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
