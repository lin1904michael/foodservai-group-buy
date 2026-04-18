import { useEffect, useState } from 'react'
import { t } from '../i18n'

// ─── Live countdown pill ───
// Ticks every 1s. Shows "Xd Yh" when > 1 day, "HH:MM:SS" when under.

function diff(target) {
  const ms = new Date(target).getTime() - Date.now()
  if (ms <= 0) return null
  const s = Math.floor(ms / 1000)
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  }
}

const pad = (n) => String(n).padStart(2, '0')

export default function Countdown({ target, lang, className = '' }) {
  const [c, setC] = useState(() => diff(target))

  useEffect(() => {
    setC(diff(target))
    const id = setInterval(() => setC(diff(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  if (!c) {
    return <span className={className}>{t('dropClosed', lang)}</span>
  }

  const label =
    c.d > 0
      ? `${c.d}d ${pad(c.h)}h ${pad(c.m)}m`
      : `${pad(c.h)}:${pad(c.m)}:${pad(c.s)}`

  return (
    <span className={className}>
      <span className="opacity-70 mr-1.5">⏳</span>
      <span className="tabular-nums">{label}</span>
    </span>
  )
}
