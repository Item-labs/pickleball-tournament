import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import envelopeUrl from '../assets/envelope.svg'
import InviteContent from './InviteContent.jsx'
import { Component as Background } from '@/components/ui/background-components'

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
  // content scale + width so the slip's content matches the hero exactly
  const [contentScale, setContentScale] = useState(0.3)
  const [contentWidth, setContentWidth] = useState(680)
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

  // match the paper-content scale + width to the real hero, so the grown slip
  // is identical to the hero card (same content size on every viewport)
  useEffect(() => {
    if (!paperRef.current) return
    const r = paperRef.current.getBoundingClientRect()
    const growScale = Math.max(window.innerWidth / r.width, window.innerHeight / r.height)
    setContentScale(1 / growScale)
    const heroCard = document.querySelector('.invite__card')
    if (heroCard) setContentWidth(heroCard.getBoundingClientRect().width)
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
    // grow from the settled position to fill the screen — becomes the page.
    // target the HERO content's real center (not the viewport center) so the
    // grown invitation lands exactly where the hero sits — no end-of-grow jump.
    const cx = rect.x + rect.width / 2
    const cy = rect.y + rect.height / 2
    const heroCard = document.querySelector('.invite__card')
    const hc = heroCard ? heroCard.getBoundingClientRect() : null
    const targetX = hc ? hc.x + hc.width / 2 : vw / 2
    // nudge the landing a few px up to sit exactly where the hero settles
    const targetY = (hc ? hc.y + hc.height / 2 : vh / 2) - 3
    geo.current = {
      riseY,
      growX: targetX - cx,
      growY: targetY - cy,
      scale: Math.max(vw / rect.width, vh / rect.height),
      radius: 0,
    }

    // sequential, but snappy — the paper doesn't dawdle inside the envelope
    setStage('flap')                                   // 1. flap opens (on top)
    setTimeout(() => setStage('rising'), 520)           // 2. paper rises fully out (up)
    setTimeout(() => setStage('settle'), 1240)          // 3. comes back down ONTO the envelope
    setTimeout(() => setStage('growing'), 1760)         // 4. zoom to the hero size, hold, hand off
    setTimeout(onDone, 3160)
  }

  return (
    <motion.div
      className="intro"
      initial={{ opacity: 1 }}
      animate={{ opacity: growing ? 0 : 1 }}
      transition={growing ? { delay: 1.05, duration: 0.25, ease: 'easeOut' } : { duration: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
      style={{ pointerEvents: opening ? 'none' : 'auto' }}
    >
      {/* subtle grid + dots + soft yellow glow behind the envelope */}
      <Background />

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
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {/* click burst above the fingertip */}
              <path d="M9.5 1.4v2M6.7 2.2l1.1 1.6M12.3 2.2l-1.1 1.6M4.8 4.6l1.9 0.5M14.2 4.6l-1.9 0.5" />
              {/* hand pointing up — index finger + curled fingers + wrist */}
              <path d="M8 13.6V7.2a1.5 1.5 0 0 1 3 0v4l1-.2a2 2 0 0 1 2.3 1.3l1.3 3.5a4.5 4.5 0 0 1-4.2 6.1H10a4 4 0 0 1-2.9-1.2l-3.2-3.4a1.6 1.6 0 0 1 2.3-2.3z" />
            </svg>
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
              {/* the same invitation content as the hero, scaled down — it
                  grows back to full size and converts into the full-screen hero */}
              <div className="intro__paper-content" style={{ width: contentWidth, '--paper-content-scale': contentScale }}>
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
