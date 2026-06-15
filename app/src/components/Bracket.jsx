/* ── geometry (fixed px so the bracket lays out deterministically; the wrapper
      scrolls horizontally on smaller screens) ───────────────────────────── */
const SEAT_W = 160
const SEAT_H = 36
const SEAT_GAP = 8
const MATCH_H = SEAT_H * 2 + SEAT_GAP // 80
const BASE_GAP = 30                   // breathing room between first-round matches
const P0 = MATCH_H + BASE_GAP         // round-0 vertical pitch
const COL_GAP = 50
const COL_PITCH = SEAT_W + COL_GAP
const LABEL_H = 34

const SIDE_ROUNDS = [8, 4, 2, 1]      // match counts per side: R32 → R16 → QF → SF
const N_COLS = 9                      // 4 left + champion + 4 right
const TOTAL_W = (N_COLS - 1) * COL_PITCH + SEAT_W
const TOTAL_H = LABEL_H + SIDE_ROUNDS[0] * MATCH_H + (SIDE_ROUNDS[0] - 1) * BASE_GAP
const MID_Y = (TOTAL_H - LABEL_H) / 2

// centre Y for each match, by round — later rounds sit at the midpoint of their feeders
const CENTERS = (() => {
  const rows = [Array.from({ length: SIDE_ROUNDS[0] }, (_, i) => MATCH_H / 2 + i * P0)]
  for (let r = 1; r < SIDE_ROUNDS.length; r++) {
    const prev = rows[r - 1]
    rows[r] = Array.from({ length: prev.length / 2 }, (_, i) => (prev[2 * i] + prev[2 * i + 1]) / 2)
  }
  return rows
})()

const colX = (c) => c * COL_PITCH
const leftCol = (r) => r            // round r on the left lives in column r
const rightCol = (r) => N_COLS - 1 - r // mirrored on the right
const CHAMP_COL = 4

/* ── invented startups so the field looks alive before real RSVPs land ──── */
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

const OPEN = { open: true } // an unclaimed seat — pulsing dot + "Open"

// the 16 first-round seats on each side — a mix of confirmed teams, loud open
// slots (FOMO), and quiet empty seats still waiting to be filled
const LEFT_R32 = [
  { team: 'nimbus' }, OPEN,
  { team: 'forge' }, { team: 'vertex' },
  OPEN, { team: 'loop' },
  { team: 'hatch' }, OPEN,
  { team: 'pillar' }, OPEN,
  { team: 'drift' }, OPEN,
  { team: 'quanta' }, { team: 'atlas' },
  OPEN, { team: 'reef' },
]
const RIGHT_R32 = [
  { team: 'pulse' }, OPEN,
  { team: 'cobalt' }, OPEN,
  { team: 'ember' }, OPEN,
  { team: 'mosaic' }, OPEN,
  { team: 'nova' }, OPEN,
  { team: 'flux' }, OPEN,
  OPEN, OPEN,
  OPEN, OPEN,
]

function Seat({ s }) {
  if (s.team) {
    const t = TEAMS[s.team]
    return (
      <div className="bkt__seat bkt__seat--team">
        <span className="bkt__logo" style={{ background: t.color }}>{t.mark}</span>
        <span className="bkt__name">{t.name}</span>
      </div>
    )
  }
  if (s.champ) {
    return (
      <div className="bkt__seat bkt__seat--champ">
        <span className="bkt__trophy" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 21h8M12 17v4M6 4h12v5a6 6 0 0 1-12 0z" />
            <path d="M6 6H4a2 2 0 0 0 0 4h2M18 6h2a2 2 0 0 1 0 4h-2" />
          </svg>
        </span>
        <span className="bkt__name">Your startup?</span>
      </div>
    )
  }
  if (s.tbd) {
    return (
      <div className="bkt__seat bkt__seat--tbd">
        <span className="bkt__dot" />
        <span className="bkt__name">TBD</span>
      </div>
    )
  }
  // an unclaimed seat — no box, gray label, little pulsing orange dot
  return (
    <div className="bkt__seat bkt__seat--open">
      <span className="bkt__dot bkt__dot--live" />
      <span className="bkt__name">Open</span>
    </div>
  )
}

function Match({ x, top, seats }) {
  return (
    <div className="brk__match" style={{ left: x, top }}>
      {seats.map((s, i) => <Seat s={s} key={i} />)}
    </div>
  )
}

// build the seat list for a given side + round
function seatsFor(side, r, matchIndex) {
  if (r === 0) {
    const src = side === 'left' ? LEFT_R32 : RIGHT_R32
    return [src[matchIndex * 2], src[matchIndex * 2 + 1]]
  }
  return [{ tbd: true }, { tbd: true }]
}

export function Bracket() {
  const matches = []
  const paths = []

  for (const side of ['left', 'right']) {
    SIDE_ROUNDS.forEach((count, r) => {
      const col = side === 'left' ? leftCol(r) : rightCol(r)
      for (let i = 0; i < count; i++) {
        const top = LABEL_H + CENTERS[r][i] - MATCH_H / 2
        matches.push({ key: `${side}-${r}-${i}`, x: colX(col), top, seats: seatsFor(side, r, i) })

        // connector from this match to its parent (or to the champion)
        const y = LABEL_H + CENTERS[r][i]
        if (r < SIDE_ROUNDS.length - 1) {
          const py = LABEL_H + CENTERS[r + 1][Math.floor(i / 2)]
          if (side === 'left') {
            const sx = colX(col) + SEAT_W, px = colX(col + 1), mx = (sx + px) / 2
            paths.push(`M${sx},${y} H${mx} V${py} H${px}`)
          } else {
            const sx = colX(col), px = colX(col - 1) + SEAT_W, mx = (sx + px) / 2
            paths.push(`M${sx},${y} H${mx} V${py} H${px}`)
          }
        } else {
          // semifinal → champion (both at mid height, so a straight line)
          if (side === 'left') paths.push(`M${colX(col) + SEAT_W},${y} H${colX(CHAMP_COL)}`)
          else paths.push(`M${colX(col)},${y} H${colX(CHAMP_COL) + SEAT_W}`)
        }
      }
    })
  }

  const champTop = LABEL_H + MID_Y - 22

  const labels = [
    [leftCol(0), 'Round of 32'], [leftCol(1), 'Round of 16'], [leftCol(2), 'Quarterfinals'], [leftCol(3), 'Semifinals'],
    [CHAMP_COL, 'Champion'],
    [rightCol(3), 'Semifinals'], [rightCol(2), 'Quarterfinals'], [rightCol(1), 'Round of 16'], [rightCol(0), 'Round of 32'],
  ]

  return (
    <div className="bkt-frame">
      <div className="bkt-wrap">
      <div className="brk" style={{ width: TOTAL_W, height: TOTAL_H }}>
        <svg className="brk__svg" width={TOTAL_W} height={TOTAL_H} aria-hidden="true">
          {paths.map((d, i) => <path key={i} d={d} />)}
        </svg>

        {labels.map(([c, text]) => (
          <span className="brk__label" style={{ left: colX(c) }} key={`${c}-${text}`}>{text}</span>
        ))}

        {matches.map((m) => <Match key={m.key} x={m.x} top={m.top} seats={m.seats} />)}

        <div className="brk__match" style={{ left: colX(CHAMP_COL), top: champTop }}>
          <Seat s={{ champ: true }} />
        </div>
      </div>
      </div>
      <span className="bkt-frame__hint" aria-hidden="true">Slide to explore the full bracket →</span>
    </div>
  )
}

export default Bracket
