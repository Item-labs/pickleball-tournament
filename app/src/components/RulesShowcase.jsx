import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/*
 * The house rules as an interactive, expandable card deck (Mews-style):
 * one card is open and shows its rule; the rest collapse to a title + number
 * with a "+". Click a card — or use the arrows — to open it.
 */
const STEPS = [
  ['Two to a team', 'Each startup sends its best 2 players to compete on their behalf. Cheerleaders are welcome.'],
  ['Everybody plays', 'Pool play feeds into an 8 team elimination bracket, so every team is guaranteed at least three games before anyone heads home.'],
  ['Quick & lively', 'Each match runs 11 minutes or to 11 points, whichever arrives first.'],
  ['Come as you are', 'We have the equipment handled. Wear appropriate footwear. Matching uniforms are encouraged.'],
  ['Stay a while', 'Food and drinks, with and without the spirits, are served all evening long.'],
  ['All levels welcome', 'First timers and ringers alike. Tell us your level when you RSVP and we’ll seed the brackets fairly.'],
  ['Play kind', 'Trash talk encouraged, good sportsmanship required.'],
]

export default function RulesShowcase() {
  const [active, setActive] = useState(0)
  const n = STEPS.length
  const go = (d) => setActive((a) => (a + d + n) % n)

  // auto-advance to the next rule every 5s; any manual change resets the timer
  useEffect(() => {
    const t = setTimeout(() => setActive((a) => (a + 1) % n), 5000)
    return () => clearTimeout(t)
  }, [active, n])

  return (
    <section className="proc" id="house-rules">
      <div className="proc__inner">
        <div className="proc__head">
          <div>
            <h2 className="proc__title">Know the rules<br />before you pick up a paddle.</h2>
          </div>
          <div className="proc__nav">
            <button onClick={() => go(-1)} aria-label="Previous rule">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button onClick={() => go(1)} aria-label="Next rule">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>

        <div className="proc__cards">
          {STEPS.map(([title, desc], i) => {
            const isActive = i === active
            return (
              <motion.button
                key={i}
                layout
                onClick={() => setActive(i)}
                className={`proc__card${isActive ? ' is-active' : ''}`}
                style={{ flexGrow: isActive ? 3.4 : 1 }}
                transition={{ layout: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } }}
                aria-expanded={isActive}
              >
                <motion.div layout="position" className="proc__card-head">
                  <div className="proc__card-titles">
                    <span className="proc__card-title">{title}</span>
                    <span className="proc__card-no">/ {String(i + 1).padStart(2, '0')}</span>
                  </div>
                  {isActive && (
                    <span className="proc__check" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="15" height="15"><path d="M5 12.5l4.5 4.5L19 7" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                  )}
                </motion.div>

                <div className="proc__card-foot">
                  <AnimatePresence mode="wait">
                    {isActive ? (
                      <motion.p
                        key="desc"
                        className="proc__card-desc"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.18 } }}
                        exit={{ opacity: 0, transition: { duration: 0.1 } }}
                      >
                        {desc}
                      </motion.p>
                    ) : (
                      <span key="plus" className="proc__plus" aria-hidden="true">+</span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            )
          })}
        </div>

        <div className="proc__track" aria-hidden="true">
          <motion.div className="proc__track-fill" animate={{ width: `${((active + 1) / n) * 100}%` }} transition={{ duration: 0.4, ease: 'easeOut' }} />
        </div>
      </div>
    </section>
  )
}
