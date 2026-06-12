import { useEffect, useRef } from 'react'

/*
 * Plays a short "pock" — like a pickleball coming off a paddle — on every
 * click anywhere on the page. Fully synthesized with the Web Audio API
 * (a fast pitch-dropping body + a filtered noise transient), so there's no
 * audio file to ship. The AudioContext is created on the first user gesture,
 * which satisfies browser autoplay rules.
 */
function playPock(ctx) {
  const now = ctx.currentTime

  // master, kept modest so repeated clicks aren't harsh
  const master = ctx.createGain()
  master.gain.value = 0.5
  master.connect(ctx.destination)

  // body — a quick tonal "pock" that snaps down in pitch
  const osc = ctx.createOscillator()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(1150, now)
  osc.frequency.exponentialRampToValueAtTime(420, now + 0.05)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, now)
  g.gain.exponentialRampToValueAtTime(0.6, now + 0.004)
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.13)
  osc.connect(g).connect(master)
  osc.start(now)
  osc.stop(now + 0.14)

  // transient — a tiny burst of filtered noise for the hard "tock" attack
  const len = Math.floor(ctx.sampleRate * 0.04)
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3)
  }
  const noise = ctx.createBufferSource()
  noise.buffer = buf
  const hp = ctx.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = 1400
  const ng = ctx.createGain()
  ng.gain.setValueAtTime(0.5, now)
  ng.gain.exponentialRampToValueAtTime(0.0001, now + 0.04)
  noise.connect(hp).connect(ng).connect(master)
  noise.start(now)
  noise.stop(now + 0.04)
}

export default function ClickSound() {
  const ctxRef = useRef(null)

  useEffect(() => {
    function onDown() {
      try {
        if (!ctxRef.current) {
          const AC = window.AudioContext || window.webkitAudioContext
          if (!AC) return
          ctxRef.current = new AC()
        }
        const ctx = ctxRef.current
        if (ctx.state === 'suspended') ctx.resume()
        playPock(ctx)
      } catch {
        /* audio not available — silently ignore */
      }
    }
    window.addEventListener('pointerdown', onDown)
    return () => window.removeEventListener('pointerdown', onDown)
  }, [])

  return null
}
