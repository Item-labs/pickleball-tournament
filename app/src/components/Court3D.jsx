import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useMotionTemplate, animate } from 'framer-motion'
import { Bracket } from './Bracket.jsx'

const RSVP_URL = 'https://app.useitem.io/survey/883538e0-8322-4b29-86b6-8b276ca044f2'

const FAQS = [
  ['Is there a prize?', 'Yes! $2k, $1k, and $500 for 1st, 2nd, and 3rd place, in a Slash account. Plus the title of Best Startup.'],
  ['Do I need to be good at pickleball?', 'No, all levels are welcome. There will be plenty else to do at the event and plenty of cool people to meet.'],
  ['Do I have to show up on time?', "Yes, games start at 5:30 PM. You'll forfeit any games you miss, and look really bad to whoever you're playing."],
  ['Can other people from my startup come to support?', 'Yes! Bring your team members to cheer you on.'],
  ['Is there a cost to enter?', 'Nope.'],
  ['Where exactly is it and what time?', 'DinkSF, the Church of Eight Wheels, at 554 Fillmore St, San Francisco. It runs from 5:30 to 9:30 PM.'],
  ['How do we RSVP?', 'Hit "Lock In Your Team" up top, or go to app.useitem.io.'],
  ["What if my question isn't answered here?", 'Email vanessa@useitem.io with any other questions.'],
]

const RULES = [
  ['Two to a team', 'Each startup sends its best 2 players to compete on their behalf. Cheerleaders are welcome.'],
  ['Everybody plays', 'Pool play feeds into an 8 team elimination bracket, so every team is guaranteed at least three games before anyone heads home.'],
  ['Quick & lively', 'Each match runs 11 minutes or to 11 points, whichever arrives first.'],
  ['Come as you are', 'We have the equipment handled. Wear appropriate footwear. Matching uniforms are encouraged.'],
  ['Stay a while', 'Food and drinks, with and without the spirits, are served all evening long.'],
  ['All levels welcome', 'First timers and ringers alike. Tell us your level when you RSVP and we’ll seed the brackets fairly.'],
  ['Play kind', 'Trash talk encouraged, good sportsmanship required.'],
]

// each court box opens a section
const SECTIONS = [
  { id: 'rules', area: 'lt', label: 'House Rules', sub: '7 to know' },
  { id: 'sponsors', area: 'lb', label: 'Sponsors', sub: 'item × Slash' },
  { id: 'format', area: 'lk', label: 'Format', kitchen: true },
  { id: 'prizes', area: 'rk', label: 'Prizes', kitchen: true },
  { id: 'faq', area: 'rt', label: 'FAQ', sub: '8 answers' },
  { id: 'whos', area: 'rb', label: "Who's Going", sub: 'The bracket' },
]

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

function SponsorCards() {
  return (
    <div className="panel-companies">
      <article>
        <img className="panel-shot" src="/assets/item-product.jpg" alt="item" loading="lazy" />
        <img className="panel-logo" src="/assets/logo-item.png" alt="item" />
        <p className="panel-tag">The agentic CRM that does the work for you.</p>
        <p>item is a CRM with AI agents built in, fed by deep context from all the tools you use, handling inbound, outbound, and account maintenance so your team does less data entry and more selling.</p>
        <a className="company__link" href="https://item.app" target="_blank" rel="noopener">Visit item →</a>
      </article>
      <article>
        <img className="panel-shot" src="/assets/slash-product.jpg" alt="Slash" loading="lazy" />
        <img className="panel-logo" src="/assets/logo-slash.png" alt="Slash" />
        <p className="panel-tag">The financial platform for modern businesses.</p>
        <p>Slash is the fastest growing financial platform in America. Trusted by 10,000+ businesses across 100+ countries for banking, cards, treasury, payments, and automation.</p>
        <a className="company__link" href="https://www.slash.com/" target="_blank" rel="noopener">Visit Slash →</a>
      </article>
    </div>
  )
}

function PanelBody({ id }) {
  if (id === 'rules') {
    return (
      <ol className="panel-rules">
        {RULES.map(([t, d], i) => (
          <li key={i}>
            <span className="panel-rules__no">{i + 1}</span>
            <div><h3>{t}</h3><p>{d}</p></div>
          </li>
        ))}
      </ol>
    )
  }
  if (id === 'whos') return <Bracket />
  if (id === 'sponsors') return <SponsorCards />
  if (id === 'faq') {
    return (
      <div className="panel-faqs">
        {FAQS.map(([q, a], i) => (
          <details className="faq" key={i}><summary>{q}</summary><p>{a}</p></details>
        ))}
      </div>
    )
  }
  if (id === 'format') {
    return (
      <div className="panel-prose">
        <p><strong>32 teams, one champion.</strong> Each SF startup sends its best 2 players.</p>
        <p>Pool play feeds into an 8 team elimination bracket, so every team is guaranteed at least three games before anyone heads home.</p>
        <p>Each match runs 11 minutes or to 11 points, whichever arrives first. Paddles and balls are on us.</p>
      </div>
    )
  }
  // prizes
  return (
    <div className="panel-prizes">
      <div className="panel-prize"><span className="panel-prize__place">1st</span><span className="panel-prize__amt">$2,000</span></div>
      <div className="panel-prize"><span className="panel-prize__place">2nd</span><span className="panel-prize__amt">$1,000</span></div>
      <div className="panel-prize"><span className="panel-prize__place">3rd</span><span className="panel-prize__amt">$500</span></div>
      <p className="panel-prize__note">Paid into a Slash account. Plus the title of Best Startup.</p>
    </div>
  )
}

const SECTION_TITLES = {
  rules: 'House Rules', sponsors: 'The Two Startups Behind the Battle',
  format: 'The Format', prizes: 'The Prize', faq: 'FAQ', whos: "Who's Going",
}

// a paddle, seen from above (handle left, head right)
function Paddle({ color }) {
  return (
    <svg className="c3d__paddle-svg" viewBox="0 0 98 50">
      <rect x="0" y="20" width="36" height="10" rx="5" fill="#c79a5c" />
      <ellipse cx="64" cy="25" rx="33" ry="24" fill={color} stroke="rgba(0,0,0,0.25)" strokeWidth="2" />
      <ellipse cx="55" cy="17" rx="11" ry="7" fill="rgba(255,255,255,0.22)" />
    </svg>
  )
}

// a back-and-forth rally across the whole court; the ball arcs high over the net
const RALLY = 2.4
const ballX = { duration: RALLY, times: [0, 0.5, 1], repeat: Infinity, ease: 'easeInOut' }
const ballHop = { duration: RALLY, times: [0, 0.25, 0.5, 0.75, 1], repeat: Infinity, ease: 'easeInOut' }
const swingT = { duration: RALLY, repeat: Infinity, ease: 'easeInOut' }

function Rally() {
  return (
    <div className="c3d__rally" aria-hidden="true">
      <div className="c3d__paddle c3d__paddle--a">
        <motion.div className="c3d__paddle-swing" animate={{ rotate: [-20, 10, 10, 10, -20] }} transition={{ ...swingT, times: [0, 0.12, 0.5, 0.86, 1] }}>
          <div className="c3d__paddle-up"><Paddle color="#2563b0" /></div>
        </motion.div>
      </div>
      <div className="c3d__paddle c3d__paddle--b">
        <motion.div className="c3d__paddle-swing" animate={{ rotate: [10, 10, -20, 10, 10] }} transition={{ ...swingT, times: [0, 0.4, 0.5, 0.6, 1] }}>
          <div className="c3d__paddle-up"><Paddle color="#14243a" /></div>
        </motion.div>
      </div>
      <motion.div className="c3d__ball-shadow" animate={{ left: ['16%', '84%', '16%'] }} transition={ballX} />
      <motion.div className="c3d__ball" animate={{ left: ['16%', '84%', '16%'] }} transition={ballX}>
        <motion.span className="c3d__ball-dot" animate={{ z: [6, 82, 6, 82, 6] }} transition={ballHop} />
      </motion.div>
    </div>
  )
}


export default function Court3D() {
  const tilt = useMotionValue(84)
  const spin = useMotionValue(-44)
  const tiltS = useSpring(tilt, { stiffness: 80, damping: 18 })
  const spinS = useSpring(spin, { stiffness: 80, damping: 18 })
  const transform = useMotionTemplate`rotateX(${tiltS}deg) rotateZ(${spinS}deg)`
  const drag = useRef(null)
  const moved = useRef(false)
  const [open, setOpen] = useState(null)

  useEffect(() => {
    const a1 = animate(tilt, 56, { duration: 1.4, ease: [0.22, 1, 0.36, 1] })
    const a2 = animate(spin, -20, { duration: 1.4, ease: [0.22, 1, 0.36, 1] })
    return () => { a1.stop(); a2.stop() }
  }, [tilt, spin])

  // close panel on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const onDown = (e) => {
    moved.current = false
    drag.current = { x: e.clientX, y: e.clientY, t: tilt.get(), s: spin.get(), captured: false }
  }
  const onMove = (e) => {
    if (!drag.current) return
    const dx = e.clientX - drag.current.x, dy = e.clientY - drag.current.y
    if (Math.abs(dx) + Math.abs(dy) > 5) {
      moved.current = true
      // only capture the pointer once a real drag begins, so taps still click through
      if (!drag.current.captured) { try { e.currentTarget.setPointerCapture(e.pointerId) } catch {}; drag.current.captured = true }
    }
    spin.set(drag.current.s + dx * 0.4)
    tilt.set(clamp(drag.current.t - dy * 0.22, 16, 76))
  }
  const onUp = (e) => {
    if (drag.current?.captured) { try { e.currentTarget.releasePointerCapture(e.pointerId) } catch {} }
    drag.current = null
  }

  return (
    <section className="c3d">
      <header className="c3d__bar">
        <span className="logo-bos c3d__logo" role="img" aria-label="Battle of the Startups" />
        <div className="c3d__meta">
          <span className="c3d__meta-top">item <span>×</span> Slash present · Thursday, July 9, 2026</span>
          <span className="c3d__meta-bot">DinkSF · 554 Fillmore St, San Francisco · <b>5:30 – 9:30 PM</b></span>
        </div>
        <a className="btn c3d__rsvp" href={RSVP_URL} target="_blank" rel="noopener">Lock In Your Team</a>
      </header>

      <div className="c3d__scene" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}>
        <motion.div className="c3d__court" style={{ transform }}>
          <div className="c3d__floor" />
          <div className="c3d__shadow" />
          <div className="c3d__apron" />
          <div className="c3d__surface">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`c3d__zone c3d__zone--${s.area}${s.kitchen ? ' c3d__zone--kitchen' : ''}`}
                onClick={() => { if (!moved.current) setOpen(s.id) }}
              >
                <span className="c3d__face">
                  <span className="c3d__zlabel">{s.label}</span>
                  {s.sub && <span className="c3d__zsub">{s.sub}</span>}
                </span>
              </button>
            ))}
            <div className="c3d__net" aria-hidden="true"><i /></div>
            <Rally />
          </div>
        </motion.div>
      </div>

      <span className="c3d__hint">Drag to look around · tap a box to explore</span>

      <AnimatePresence>
        {open && (
          <motion.div className="c3d__panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}>
            <motion.div
              className="c3d__sheet"
              initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="c3d__sheet-head">
                <h2>{SECTION_TITLES[open]}</h2>
                <button className="c3d__close" onClick={() => setOpen(null)} aria-label="Close">×</button>
              </div>
              <div className="c3d__sheet-body"><PanelBody id={open} /></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
