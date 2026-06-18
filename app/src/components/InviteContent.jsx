const MAPS = 'https://www.google.com/maps/search/?api=1&query=DinkSF%2C%20554%20Fillmore%20St%2C%20San%20Francisco%2C%20CA%2094117'

/*
 * The invitation's content — shared so the hero card and the paper that
 * emerges from the envelope show EXACTLY the same thing.
 */
export default function InviteContent() {
  return (
    <>
      <span className="eyebrow">You're cordially invited to the</span>
      <h1 className="invite__title">
        <span className="sr-only">Battle of the Startups, Pickleball edition</span>
        <span className="logo-bos invite__logo" aria-hidden="true" />
      </h1>

      <p className="invite__meta">
        Thursday, July 9, 2026 · 5:30 to 9:30 PM<br />
        <a className="invite__address" href={MAPS} target="_blank" rel="noopener">
          DinkSF · 554 Fillmore St, San Francisco
        </a>
      </p>

      <div className="invite__cta">
        <a href="https://app.useitem.io/survey/883538e0-8322-4b29-86b6-8b276ca044f2" className="btn" target="_blank" rel="noopener">Lock In Your Team</a>
      </div>

      <div className="invite__presented">
        <span className="invite__presented-label">Presented by</span>
        <img className="invite__paddles" src={`${import.meta.env.BASE_URL}assets/paddles-itemxslash.png`} alt="item and Slash" />
      </div>
    </>
  )
}
