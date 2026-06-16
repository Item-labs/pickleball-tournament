import { useRef, useState, useLayoutEffect } from 'react'

/* invented startups so the field looks alive before real RSVPs land */
const TEAMS = {
  nimbus: { name: 'Nimbus', mark: 'N', color: '#5B6CF0' },
  forge:  { name: 'Forge',  mark: 'F', color: '#E8743B' },
  vertex: { name: 'Vertex', mark: 'X', color: '#16A38B' },
  loop:   { name: 'Loop',   mark: 'L', color: '#E0457B' },
  hatch:  { name: 'Hatch',  mark: 'H', color: '#3FA34D' },
  pillar: { name: 'Pillar', mark: 'P', color: '#7B61FF' },
  drift:  { name: 'Drift',  mark: 'D', color: '#2E8BC0' },
  quanta: { name: 'Quanta', mark: 'Q', color: '#C0392B' },
  atlas:  { name: 'Atlas',  mark: 'A', color: '#0E7C66' },
  reef:   { name: 'Reef',   mark: 'R', color: '#1D7AE0' },
  pulse:  { name: 'Pulse',  mark: 'U', color: '#D81B60' },
  cobalt: { name: 'Cobalt', mark: 'C', color: '#2D54C8' },
  ember:  { name: 'Ember',  mark: 'E', color: '#E2562B' },
  mosaic: { name: 'Mosaic', mark: 'M', color: '#6A4FB6' },
  nova:   { name: 'Nova',   mark: 'O', color: '#0A8F5B' },
  flux:   { name: 'Flux',   mark: 'Z', color: '#C2410C' },
}

const OPEN = { open: true }

const R32 = [
  { team: 'nimbus' }, OPEN, { team: 'forge' }, { team: 'vertex' }, OPEN, { team: 'loop' }, { team: 'hatch' }, OPEN,
  { team: 'pillar' }, OPEN, { team: 'drift' }, OPEN, { team: 'quanta' }, { team: 'atlas' }, OPEN, { team: 'reef' },
  { team: 'pulse' }, OPEN, { team: 'cobalt' }, OPEN, { team: 'ember' }, OPEN, { team: 'mosaic' }, OPEN,
  { team: 'nova' }, OPEN, { team: 'flux' }, OPEN, OPEN, OPEN, OPEN, OPEN,
]
const LEFT_R32 = R32.slice(0, 16)
const RIGHT_R32 = R32.slice(16)

/* vertical geometry is fixed; the columns spread horizontally to fill the box */
const CH = 30, INTRA = 4, INTER = 14
const PAIR_PITCH = 2 * CH + INTRA + INTER
const baseCenters = () => {
  const a = []
  for (let p = 0; p < 8; p++) { a.push(p * PAIR_PITCH + CH / 2); a.push(p * PAIR_PITCH + CH + INTRA + CH / 2) }
  return a
}
const pairAvg = (a) => { const r = []; for (let i = 0; i < a.length; i += 2) r.push((a[i] + a[i + 1]) / 2); return r }
const C16 = baseCenters(), C8 = pairAvg(C16), C4 = pairAvg(C8), C2 = pairAvg(C4), C1 = pairAvg(C2)
const TOTAL_H = 8 * (2 * CH + INTRA) + 7 * INTER

const W_NAME = 178, W_SPOT = 70, W_WIN = 60
const WIDTHS = [W_NAME, W_SPOT, W_SPOT, W_SPOT, W_SPOT, W_WIN, W_SPOT, W_SPOT, W_SPOT, W_SPOT, W_NAME]
const CENTERS = [C16, C8, C4, C2, C1, C1, C1, C2, C4, C8, C16]

// each inner slot shows a preview of who advances: "winner of <round> match n"
const SLOT_ABBR = { 1: 'RD32', 2: 'RD16', 3: 'QF', 4: 'SF', 6: 'SF', 7: 'QF', 8: 'RD16', 9: 'RD32' }
const seatAt = (slot, k) => {
  if (slot === 0) return LEFT_R32[k]
  if (slot === 10) return RIGHT_R32[k]
  if (slot === 5) return { champ: true }
  return { prev: `${SLOT_ABBR[slot]} W${k + 1}` }
}

/* mobile: one round at a time, toggled by tabs (ESPN-style) */
const ROUND_TABS = [
  { label: 'Round of 32', count: 16, r32: true },
  { label: 'Round of 16', count: 8 },
  { label: 'Quarterfinals', count: 4 },
  { label: 'Semifinals', count: 2 },
  { label: 'Final', count: 1 },
]

const ABBR = ['RD32', 'RD16', 'QF', 'SF']

const TROPHY = (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 21h8M12 17v4M6 4h12v5a6 6 0 0 1-12 0z" />
    <path d="M6 6H4a2 2 0 0 0 0 4h2M18 6h2a2 2 0 0 1 0 4h-2" />
  </svg>
)

/* ── mobile: a horizontally-scrollable connected bracket; tabs + scroll stay in sync ── */
const M_CH = 28, M_INTRA = 4
const M_CARD_H = 2 * M_CH + M_INTRA
const M_PITCH = M_CARD_H + 16
const mBase = () => Array.from({ length: 16 }, (_, i) => i * M_PITCH + M_CARD_H / 2)
const mAvg = (a) => { const r = []; for (let i = 0; i < a.length; i += 2) r.push((a[i] + a[i + 1]) / 2); return r }
const MC = [mBase()]
for (let c = 1; c < 5; c++) MC.push(mAvg(MC[c - 1]))
const M_TOTAL_H = 16 * M_CARD_H + 15 * 16
const M_CARD_W = 152, M_COL_GAP = 36, M_WIN_W = 56
const M_COLX = Array.from({ length: 6 }, (_, c) => c * (M_CARD_W + M_COL_GAP))
const M_TOTAL_W = M_COLX[5] + M_WIN_W

function mobileSegs() {
  const s = []
  const v = (x, y1, y2) => s.push({ x1: x, y1, x2: x, y2: y2 })
  const h = (x1, x2, y) => s.push({ x1, y1: y, x2, y2: y })
  for (let c = 0; c < 4; c++) {
    for (let j = 0; j < MC[c + 1].length; j++) {
      const cR = M_COLX[c] + M_CARD_W, pL = M_COLX[c + 1], mid = (cR + pL) / 2
      const y1 = MC[c][2 * j], y2 = MC[c][2 * j + 1], py = MC[c + 1][j]
      h(cR, mid, y1); h(cR, mid, y2); v(mid, y1, y2); h(mid, pL, py)
    }
  }
  h(M_COLX[4] + M_CARD_W, M_COLX[5], MC[4][0])
  return s
}

function MCardSeat({ s }) {
  if (s.team) {
    const t = TEAMS[s.team]
    return <div className="mbk2__seat"><span className="hbk__tile" style={{ background: t.color }}>{t.mark}</span><span className="mbk2__nm">{t.name}</span></div>
  }
  if (s.open) {
    return <div className="mbk2__seat mbk2__seat--open"><span className="hbk__dot hbk__dot--live" /><span className="mbk2__nm">Open</span></div>
  }
  return <div className="mbk2__seat mbk2__seat--prev" />
}

function MobileBracket() {
  const scrollRef = useRef(null)
  const [active, setActive] = useState(0)
  const segs = mobileSegs()
  const cardSeats = (c, j) => (c === 0
    ? [R32[2 * j], R32[2 * j + 1]]
    : [{ prev: `${ABBR[c - 1]} W${2 * j + 1}` }, { prev: `${ABBR[c - 1]} W${2 * j + 2}` }])
  const onScroll = () => {
    const sc = scrollRef.current
    if (!sc) return
    let n = 0, best = Infinity
    for (let i = 0; i < 5; i++) { const d = Math.abs(M_COLX[i] - sc.scrollLeft); if (d < best) { best = d; n = i } }
    setActive(n)
  }
  const goTo = (i) => { if (scrollRef.current) scrollRef.current.scrollTo({ left: M_COLX[i] - 6, behavior: 'smooth' }) }
  return (
    <div className="bkt-frame mbk-frame">
      <div className="mbk__tabs">
        {ROUND_TABS.map((t, i) => (
          <button key={i} className={`mbk__tab${i === active ? ' is-active' : ''}`} onClick={() => goTo(i)}>{t.label}</button>
        ))}
      </div>
      <div className="mbk2__scroll" ref={scrollRef} onScroll={onScroll}>
        <div className="mbk2" style={{ width: M_TOTAL_W, height: M_TOTAL_H }}>
          <svg className="mbk2__svg" width={M_TOTAL_W} height={M_TOTAL_H} aria-hidden="true">
            {segs.map((g, i) => <line key={i} x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2} />)}
          </svg>
          {[0, 1, 2, 3, 4].map((c) => (
            <div className="mbk2__col" style={{ width: M_CARD_W, height: M_TOTAL_H }} key={c}>
              {MC[c].map((cy, j) => (
                <div className="mbk2__card" style={{ top: cy - M_CARD_H / 2, height: M_CARD_H }} key={j}>
                  {cardSeats(c, j).map((s, si) => <MCardSeat s={s} key={si} />)}
                </div>
              ))}
            </div>
          ))}
          <div className="mbk2__col" style={{ width: M_WIN_W, height: M_TOTAL_H }}>
            <div className="mbk2__champ" style={{ top: MC[4][0] - 22 }}>{TROPHY}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Cell({ s, slot, top, innerRef }) {
  const style = { top, height: CH }
  if (s.champ) return <div className="hbk__champ" style={style} ref={innerRef}>{TROPHY}</div>
  if (s.prev) return <div className="hbk__cell hbk__spot" style={style} ref={innerRef} />
  const cls = `hbk__cell hbk__name${slot === 10 ? ' hbk__name--r' : ''}`
  if (s.team) {
    const t = TEAMS[s.team]
    return (
      <div className={cls} style={style} ref={innerRef} title={t.name}>
        <span className="hbk__tile" style={{ background: t.color }}>{t.mark}</span>
        <span className="hbk__nm">{t.name}</span>
      </div>
    )
  }
  return (
    <div className={cls + ' hbk__name--open'} style={style} ref={innerRef}>
      <span className="hbk__dot hbk__dot--live" />
      <span className="hbk__nm">Open</span>
    </div>
  )
}

export function Bracket() {
  const wrapRef = useRef(null)
  const refs = useRef(new Map())
  const [segs, setSegs] = useState([])
  const [w, setW] = useState(0)

  useLayoutEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const compute = () => {
      const base = wrap.getBoundingClientRect()
      const pos = {}
      refs.current.forEach((el, key) => {
        const r = el.getBoundingClientRect()
        pos[key] = { left: r.left - base.left, right: r.right - base.left, cy: r.top - base.top + r.height / 2 }
      })
      const s = []
      const v = (x, y1, y2) => s.push({ x1: x, y1, x2: x, y2: y2 })
      const h = (x1, x2, y) => s.push({ x1, y1: y, x2, y2: y })
      const get = (slot, k) => pos[`${slot}-${k}`]
      // left half: slot → slot+1, lines run rightward
      for (let c = 0; c < 4; c++) {
        for (let k = 0; k < CENTERS[c + 1].length; k++) {
          const a = get(c, 2 * k), b = get(c, 2 * k + 1), p = get(c + 1, k)
          if (!a || !b || !p) continue
          const cR = Math.max(a.right, b.right), pL = p.left, mid = (cR + pL) / 2
          h(cR, mid, a.cy); h(cR, mid, b.cy); v(mid, a.cy, b.cy); h(mid, pL, p.cy)
        }
      }
      { const a = get(4, 0), p = get(5, 0); if (a && p) h(a.right, p.left, a.cy) }
      // right half: slot → slot-1, lines run leftward
      for (let c = 10; c > 6; c--) {
        for (let k = 0; k < CENTERS[c - 1].length; k++) {
          const a = get(c, 2 * k), b = get(c, 2 * k + 1), p = get(c - 1, k)
          if (!a || !b || !p) continue
          const cL = Math.min(a.left, b.left), pR = p.right, mid = (cL + pR) / 2
          h(mid, cL, a.cy); h(mid, cL, b.cy); v(mid, a.cy, b.cy); h(pR, mid, p.cy)
        }
      }
      { const a = get(6, 0), p = get(5, 0); if (a && p) h(p.right, a.left, a.cy) }
      setSegs(s)
      setW(Math.round(base.width))
    }
    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [])

  const setRef = (key) => (el) => { if (el) refs.current.set(key, el); else refs.current.delete(key) }

  return (
    <>
    <div className="bkt-frame hbk-frame">
      <div className="hbk" ref={wrapRef} style={{ height: TOTAL_H }}>
        <svg className="hbk__svg" width={w} height={TOTAL_H} aria-hidden="true">
          {segs.map((g, i) => <line key={i} x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2} />)}
        </svg>
        <div className="hbk__cols">
          {CENTERS.map((col, slot) => (
            <div className="hbk__col" style={{ width: WIDTHS[slot] }} key={slot}>
              {col.map((cy, k) => (
                <Cell key={k} s={seatAt(slot, k)} slot={slot} top={cy - CH / 2} innerRef={setRef(`${slot}-${k}`)} />
              ))}
              {slot === 5 && <span className="hbk__wlabel" style={{ top: col[0] + CH / 2 + 8 }}>Winner</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
    <MobileBracket />
    </>
  )
}

export default Bracket
