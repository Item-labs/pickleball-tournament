import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import EnvelopeIntro from './components/EnvelopeIntro.jsx'
import { AttendeesSlider } from './components/AttendeesSlider.tsx'

const FAQS = [
  ['Is there a prize?', <>Yes — in addition to earning the title of Best Startup, there will be <span className="tbd">[TBD]</span>.</>],
  ['Do I need to be good at pickleball?', 'No, all levels are welcome. There will be plenty else to do at the event and plenty of cool people to meet.'],
  ['Do I have to show up on time?', "Yes — games start at 5:30 PM. You'll forfeit any games you miss, and look really bad to whoever you're playing."],
  ['Can other people from my startup come to support?', 'Yes! We encourage you to bring your team members to cheer you on.'],
  ['Who is going?', 'See the section above for confirmed guests. There will be 32 teams competing, each representing an SF-based startup.'],
  ['Why pickleball?', "We've met countless founders who love pickleball and claim to be the best — so we're giving them a chance to put their money where their mouth is. This is the first edition of many, so stay tuned."],
  ['Is there a cost to enter?', 'Nope.'],
  ['Where exactly is it and what time?', 'The venue is DinkSF — you may know it as the Church of Eight Wheels — at 554 Fillmore St, San Francisco, CA 94117. It runs from 5:30–9:30 PM.'],
  ['How do we RSVP?', <>Hit the RSVP button anywhere on this page, or go straight to <a href="https://item.app/pickle" target="_blank" rel="noopener">item.app/pickle</a>.</>],
  ["What if my question isn't answered here?", <>Email <a href="mailto:vanessa@useitem.io">vanessa@useitem.io</a> with any other questions or concerns.</>],
]

export default function App() {
  const [opened, setOpened] = useState(false)

  return (
    <>
      {/* THE ENVELOPE — the landing moment */}
      <AnimatePresence>
        {!opened && <EnvelopeIntro key="intro" onDone={() => setOpened(true)} />}
      </AnimatePresence>

      {/* NAV */}
      <header className="nav">
        <a href="#top" className="nav__brand" aria-label="Battle of the Startups — top">
          <span className="logo-bos nav__logo" aria-hidden="true" />
        </a>
        <nav className="nav__links">
          <a href="#details">Details</a>
          <a href="#partners">Partners</a>
          <a href="#whos-going">Who's going</a>
          <a href="#faqs">FAQs</a>
        </nav>
        <a href="https://item.app/pickle" className="btn btn--small" target="_blank" rel="noopener">RSVP</a>
      </header>

      {/* THE INVITATION PAPER */}
      <div className="sheet" id="top">
        <header className="invite">
          <div className="invite__card">
            <span className="invite__corner invite__corner--tl" aria-hidden="true" />
            <span className="invite__corner invite__corner--tr" aria-hidden="true" />
            <span className="invite__corner invite__corner--bl" aria-hidden="true" />
            <span className="invite__corner invite__corner--br" aria-hidden="true" />

            <span className="invite__seal" aria-hidden="true">
              <svg viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="34" fill="#EE7230" />
                <circle cx="36" cy="36" r="28.5" fill="none" stroke="#FDFAF4" strokeWidth="1.3" strokeDasharray="1.6 4" />
                <circle cx="36" cy="36" r="13" fill="#FDFAF4" />
                <g fill="#EE7230">
                  <circle cx="36" cy="28.5" r="1.5" />
                  <circle cx="30" cy="33" r="1.5" />
                  <circle cx="42" cy="33" r="1.5" />
                  <circle cx="32.5" cy="40.5" r="1.5" />
                  <circle cx="39.5" cy="40.5" r="1.5" />
                </g>
              </svg>
            </span>

            <span className="eyebrow">You're cordially invited to</span>
            <h1 className="invite__title">
              <span className="sr-only">Battle of the Startups — Pickleball edition</span>
              <span className="logo-bos invite__logo" aria-hidden="true" />
            </h1>

            <svg className="invite__flourish" viewBox="0 0 240 18" aria-hidden="true">
              <line x1="20" y1="9" x2="104" y2="9" stroke="currentColor" strokeWidth="1.2" />
              <path d="M120 2 L126 9 L120 16 L114 9 Z" fill="#EE7230" />
              <line x1="136" y1="9" x2="220" y2="9" stroke="currentColor" strokeWidth="1.2" />
            </svg>

            <p className="invite__meta">
              Thursday, July 9, 2026 · 5:30–9 PM<br />
              DinkSF · 554 Fillmore St, San Francisco
            </p>

            <div className="invite__cta">
              <a href="https://item.app/pickle" className="btn" target="_blank" rel="noopener">RSVP your team</a>
              <a href="#details" className="btn btn--ghost">Read the details</a>
            </div>

            <p className="invite__sig">
              With love — and a little trash talk,<br />
              <strong>item × Slash</strong>
            </p>

            <div className="invite__presented">
              <span className="invite__presented-label">Presented by</span>
              <img className="invite__paddles" src="/assets/paddles.png" alt="item and Slash" />
            </div>
          </div>
        </header>

        <main>
          {/* TOURNAMENT DETAILS */}
          <section className="section" id="details">
            <div className="section__head">
              <span className="eyebrow">The basics</span>
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
                  <p>554 Fillmore St, San Francisco</p>
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

            <div className="rules">
              <h3>The house rules</h3>
              <ul className="rules__list">
                <li><strong>Two to a team.</strong> Each startup sends its two finest representatives to carry the banner.</li>
                <li><strong>Everybody plays.</strong> Pool play feeds an 8-team elimination bracket, so every team is promised at least <strong>three games</strong> before anyone heads home.</li>
                <li><strong>Quick and lively.</strong> Each match runs <strong>11 minutes</strong> or to <strong>11 points</strong> — whichever arrives first.</li>
                <li><strong>Come as you are.</strong> Paddles and balls are on us; bring your own lucky pair if you'd rather.</li>
                <li><strong>Stay a while.</strong> Food and drinks — with and without the spirits — are served all evening.</li>
                <li><strong>All levels welcome.</strong> First-timers and ringers alike; just tell us your level when you RSVP and we'll seed the brackets fairly.</li>
                <li><strong>Above all, play kind.</strong> Trash talk encouraged, good sportsmanship required.</li>
              </ul>
            </div>
          </section>

          {/* PRESENTED BY */}
          <section className="section section--panel" id="partners">
            <div className="section__head">
              <span className="eyebrow">Presented by</span>
              <h2>The two startups behind the battle</h2>
              <p className="section__sub">Get to know your hosts.</p>
            </div>

            <div className="companies">
              <article className="company">
                <div className="company__head">
                  <span className="company__logo"><img src="/assets/logo-item.png" alt="item" /></span>
                </div>
                <p className="company__tagline">The agentic CRM that does the work for you.</p>
                <p className="company__about">
                  item is a CRM with AI agents built in, fed by deep context from all the tools you use.
                  Teach the agents how you work and they handle inbound, outbound, and account maintenance
                  on your behalf — so your team does less data entry and more selling.
                </p>
                <dl className="company__facts">
                  <div><dt>Website</dt><dd><a href="https://item.app" target="_blank" rel="noopener">item.app</a></dd></div>
                  <div><dt>Founders</dt><dd>Andres Santanilla &amp; Akshay Guthal</dd></div>
                  <div><dt>Based in</dt><dd>San Francisco</dd></div>
                </dl>
                <a className="company__link" href="https://item.app" target="_blank" rel="noopener">Visit item.app →</a>
              </article>

              <article className="company">
                <div className="company__head">
                  <span className="company__logo"><img src="/assets/logo-slash.png" alt="Slash" /></span>
                </div>
                <p className="company__tagline">A higher standard in business finance.</p>
                <p className="company__about">
                  Slash is America's leading business banking platform. With deposit accounts, free wires
                  and ACH, unlimited virtual cards, stablecoin payments, and a powerful payments API,
                  Slash is available to businesses in 100+ countries.
                </p>
                <dl className="company__facts">
                  <div><dt>Website</dt><dd><span className="tbd">[link TBD]</span></dd></div>
                  <div><dt>Founders</dt><dd>Victor Cardenas &amp; Kevin Bai</dd></div>
                  <div><dt>Based in</dt><dd>San Francisco</dd></div>
                </dl>
                <a className="company__link" href="#" rel="noopener">Visit Slash →</a>
              </article>
            </div>
          </section>

          {/* WHO'S GOING */}
          <section className="section" id="whos-going">
            <div className="section__head">
              <span className="eyebrow">Attendees</span>
              <h2>Who's going?</h2>
              <p className="section__sub">Company logos appear here as teams RSVP. Will yours be on the wall?</p>
            </div>

            <AttendeesSlider />

            <div className="center" style={{ marginTop: '2rem' }}>
              <a href="https://item.app/pickle" className="btn" target="_blank" rel="noopener">Claim your spot</a>
            </div>
          </section>

          {/* FAQs */}
          <section className="section" id="faqs">
            <div className="section__head">
              <span className="eyebrow">Good to know</span>
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
          <p className="footer__tagline">Send your 2 best players. July 9 at DinkSF, San Francisco.</p>
          <a href="https://item.app/pickle" className="btn" target="_blank" rel="noopener">RSVP at item.app/pickle</a>
          <p className="footer__brand">item <span className="x">×</span> Slash · July 9, 2026</p>
        </footer>
      </div>
    </>
  )
}
