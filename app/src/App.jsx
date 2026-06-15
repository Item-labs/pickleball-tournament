import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import EnvelopeIntro from './components/EnvelopeIntro.jsx'
import { Bracket } from './components/Bracket.jsx'
import InviteContent from './components/InviteContent.jsx'
import RulesShowcase from './components/RulesShowcase.jsx'

const FAQS = [
  ['Is there a prize?', <>Yes — in addition to earning the title of Best Startup, there will be <span className="tbd">[TBD]</span>.</>],
  ['Do I need to be good at pickleball?', 'No, all levels are welcome. There will be plenty else to do at the event and plenty of cool people to meet.'],
  ['Do I have to show up on time?', "Yes — games start at 5:30 PM. You'll forfeit any games you miss, and look really bad to whoever you're playing."],
  ['Can other people from my startup come to support?', 'Yes! We encourage you to bring your team members to cheer you on.'],
  ['Who is going?', 'See the section above for confirmed guests. There will be 32 teams competing, each representing an SF-based startup.'],
  ['Why pickleball?', "We've met countless founders who love pickleball and claim to be the best — so we're giving them a chance to put their money where their mouth is. This is the first edition of many, so stay tuned."],
  ['Is there a cost to enter?', 'Nope.'],
  ['Where exactly is it and what time?', 'The venue is DinkSF — you may know it as the Church of Eight Wheels — at 554 Fillmore St, San Francisco, CA 94117. It runs from 5:30–9:30 PM.'],
  ['How do we RSVP?', <>Hit the RSVP button anywhere on this page, or go straight to <a href="https://app.useitem.io/survey/883538e0-8322-4b29-86b6-8b276ca044f2" target="_blank" rel="noopener">the RSVP form</a>.</>],
  ["What if my question isn't answered here?", <>Email <a href="mailto:vanessa@useitem.io">vanessa@useitem.io</a> with any other questions or concerns.</>],
]

export default function App() {
  const [opened, setOpened] = useState(false)
  const [showNav, setShowNav] = useState(false)

  // the floating-island nav drifts in ~2s after the invitation has landed
  useEffect(() => {
    if (!opened) return
    const t = setTimeout(() => setShowNav(true), 2000)
    return () => clearTimeout(t)
  }, [opened])

  return (
    <>
      {/* THE ENVELOPE — the landing moment */}
      <AnimatePresence>
        {!opened && <EnvelopeIntro key="intro" onDone={() => setOpened(true)} />}
      </AnimatePresence>

      {/* NAV — a floating island that appears a beat after the hero lands */}
      <AnimatePresence>
        {showNav && (
          <motion.header
            className="nav nav--float"
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <a href="#top" className="nav__brand" aria-label="Battle of the Startups — top">
              <span className="logo-bos nav__logo" aria-hidden="true" />
            </a>
            <nav className="nav__links">
              <a href="#details">Details</a>
              <a href="#house-rules">House rules</a>
              <a href="#partners">Partners</a>
              <a href="#whos-going">Who's going</a>
              <a href="#faqs">FAQs</a>
            </nav>
            <a href="https://app.useitem.io/survey/883538e0-8322-4b29-86b6-8b276ca044f2" className="btn btn--small" target="_blank" rel="noopener">RSVP your team</a>
          </motion.header>
        )}
      </AnimatePresence>

      {/* THE HERO — the invitation card */}
      <div className="sheet" id="top">
        <header className="invite">
          <div className="invite__card">
            <InviteContent />
          </div>
        </header>

        <main>
          {/* TOURNAMENT DETAILS */}
          <section className="section" id="details">
            <div className="section__head">
              <h2>Tournament details</h2>
            </div>

            {/* the details laid out as a top-down pickleball court */}
            <div className="court">
              <div className="court__half court__half--left">
                <div className="court__box court__service">
                  <h3>When</h3>
                  <p className="court__big">July 9, 2026</p>
                  <p>Doors 5:15 PM · games 5:30–9 PM</p>
                </div>
                <div className="court__box court__service">
                  <h3>Where</h3>
                  <p className="court__big">DinkSF</p>
                  <p>
                    <a
                      className="invite__address"
                      href="https://www.google.com/maps/search/?api=1&query=DinkSF%2C%20554%20Fillmore%20St%2C%20San%20Francisco%2C%20CA%2094117"
                      target="_blank"
                      rel="noopener"
                    >
                      554 Fillmore St, San Francisco
                    </a>
                  </p>
                </div>
                <div className="court__box court__kitchen" aria-hidden="true"><span>32 teams</span></div>
              </div>
              <div className="court__net" aria-hidden="true" />
              <div className="court__half court__half--right">
                <div className="court__box court__kitchen" aria-hidden="true"><span>1 champion</span></div>
                <div className="court__box court__service">
                  <h3>Who plays</h3>
                  <p className="court__big">2 per startup</p>
                  <p>Send your 2 best players to represent.</p>
                </div>
                <div className="court__box court__service">
                  <h3>The prize</h3>
                  <p className="court__big"><span className="court__tbd">[TBD]</span></p>
                  <p>Plus the title of Best Startup.</p>
                </div>
              </div>
            </div>
          </section>

          {/* HOUSE RULES — interactive card deck */}
          <RulesShowcase />

          {/* PRESENTED BY */}
          <section className="section section--panel" id="partners">
            <div className="section__head">
              <h2>The two startups behind the battle</h2>
              <p className="section__sub">Get to know your hosts.</p>
            </div>

            <div className="companies">
              <article className="company">
                <div className="company__media company__media--shot">
                  <img src="/assets/item-product.jpg" alt="item — the agentic CRM" loading="lazy" />
                </div>
                <div className="company__head">
                  <span className="company__logo"><img src="/assets/logo-item.png" alt="item" /></span>
                </div>
                <p className="company__tagline">The agentic CRM that does the work for you.</p>
                <p className="company__about">
                  item is a CRM with AI agents built in, fed by deep context from all the tools you use.
                  Teach the agents how you work and they handle inbound, outbound, and account maintenance
                  on your behalf — so your team does less data entry and more selling.
                </p>
                <a className="company__link" href="https://item.app" target="_blank" rel="noopener">Visit item →</a>
              </article>

              <article className="company">
                <div className="company__media company__media--shot">
                  <img src="/assets/slash-product.jpg" alt="Slash — business banking platform" loading="lazy" />
                </div>
                <div className="company__head">
                  <span className="company__logo"><img src="/assets/logo-slash.png" alt="Slash" /></span>
                </div>
                <p className="company__tagline">A higher standard in business finance.</p>
                <p className="company__about">
                  Slash is America's leading business banking platform. With deposit accounts, free wires
                  and ACH, unlimited virtual cards, stablecoin payments, and a powerful payments API,
                  Slash is available to businesses in 100+ countries.
                </p>
                <a className="company__link" href="https://www.slash.com/" target="_blank" rel="noopener">Visit Slash →</a>
              </article>
            </div>
          </section>

          {/* WHO'S GOING */}
          <section className="section" id="whos-going">
            <div className="section__head">
              <h2>Who's going?</h2>
              <p className="section__sub">The bracket fills up as teams claim their spots. Will yours be in it?</p>
            </div>

            <Bracket />

            <div className="center" style={{ marginTop: '2rem' }}>
              <a href="https://app.useitem.io/survey/883538e0-8322-4b29-86b6-8b276ca044f2" className="btn" target="_blank" rel="noopener">Claim your spot</a>
            </div>
          </section>

          {/* FAQs */}
          <section className="section" id="faqs">
            <div className="section__head">
              <h2>FAQs</h2>
            </div>
            <div className="faqs">
              {FAQS.map(([q, a], i) => (
                <details className="faq" key={i}>
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </section>
        </main>

        {/* FOOTER */}
        <footer className="footer" id="rsvp">
          <span className="logo-bos footer__logo" role="img" aria-label="Battle of the Startups — Pickleball edition" />
          <h2 className="footer__title">Ready to play?</h2>
          <a href="https://app.useitem.io/survey/883538e0-8322-4b29-86b6-8b276ca044f2" className="btn" target="_blank" rel="noopener">RSVP your team</a>
          <p className="footer__brand">
            <span className="footer__brand-line">item <span className="x">×</span> Slash</span>
            <span className="footer__brand-line">July 9, 2026</span>
            <a
              className="footer__loc"
              href="https://www.google.com/maps/search/?api=1&query=DinkSF%2C%20554%20Fillmore%20St%2C%20San%20Francisco%2C%20CA%2094117"
              target="_blank"
              rel="noopener"
            >
              DinkSF, San Francisco, SF
            </a>
          </p>
        </footer>
      </div>
    </>
  )
}
