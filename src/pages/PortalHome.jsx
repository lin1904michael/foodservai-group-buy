import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, MapPin, ArrowRight, AlertTriangle, ChevronRight, ChevronDown } from 'lucide-react'
import { RESTAURANTS, getRestaurant } from '../data/restaurants'
import { useApp } from '../context/AppContext'
import { t } from '../i18n'
import Countdown from '../components/Countdown'

// ─── PortalHome: Discovery engine (/) ───

function DropCard({ r, lang, index }) {
  const name = lang === 'zh' ? r.name_zh : r.name_en
  const sub = lang === 'zh' ? r.name_en : r.name_zh
  const hub = r.hubCity[lang] || r.hubCity.en

  return (
    <Link
      to={`/restaurant/${r.id}`}
      className="group block relative rounded-3xl overflow-hidden border border-slate-700/60 bg-slate-900/80 backdrop-blur-sm
                 shadow-lg shadow-slate-950/20 hover:shadow-amber-500/10 hover:border-amber-500/40
                 hover:-translate-y-1 transition-all duration-300
                 animate-[slideUp_320ms_ease-out] will-change-transform"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
    >
      {/* Cover */}
      <div className={`relative h-44 bg-gradient-to-br ${r.coverGradient} flex items-center justify-center overflow-hidden`}>
        <span className="text-7xl drop-shadow-lg group-hover:scale-110 transition-transform duration-500">
          {r.emoji}
        </span>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />

        {/* Countdown pill */}
        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-slate-900/70 backdrop-blur-md border border-slate-700/50 text-amber-300 text-[11px] font-semibold px-2.5 py-1 rounded-full">
          <Countdown target={r.dropCloseAt} lang={lang} />
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-400/80 mb-1">
          {t('nextDrop', lang)}: {hub}
        </p>
        <h3 className="text-lg font-bold text-white leading-tight">{name}</h3>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}

        <p className="text-sm text-slate-400 leading-relaxed mt-3 line-clamp-2">
          {r.tagline[lang] || r.tagline.en}
        </p>

        {/* Community goal mini-bar */}
        {r.communityGoal && (() => {
          const { current, target, reward } = r.communityGoal
          const pct = Math.min(100, Math.round((current / target) * 100))
          const reached = current >= target
          const rewardText = reward[lang] || reward.en
          return (
            <div className="mt-4 bg-slate-950/70 border border-slate-700/50 rounded-2xl p-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-400/80">
                  {t('communityGoal', lang)}
                </span>
                <span className="text-[11px] font-bold text-white tabular-nums">
                  ${current} / ${target}
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-300 mt-1.5 leading-snug line-clamp-1">
                {reached ? (
                  <span className="text-amber-300 font-semibold">{t('goalUnlocked', lang)} {rewardText}</span>
                ) : (
                  <>
                    <span className="font-bold text-amber-300">${target - current}</span>{' '}
                    {t('unlockSuffix', lang)}{' '}
                    <span className="text-slate-200">{rewardText}</span>
                  </>
                )}
              </p>
            </div>
          )
        })()}

        <div className="flex items-center justify-between mt-5">
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
            <MapPin size={11} className="text-amber-500/70" />
            {r.dropHubs.length} {lang === 'zh' ? '個取貨點' : 'pickup hubs'}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all">
            {t('viewDrop', lang)}
            <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  )
}

function AbandonedCartWidget({ carts, lang }) {
  const navigate = useNavigate()

  const pending = Object.entries(carts || {})
    .map(([restaurantId, items]) => {
      const restaurant = getRestaurant(restaurantId)
      if (!restaurant) return null
      const entries = Object.entries(items || {})
      const totalQty = entries.reduce((s, [, q]) => s + q, 0)
      if (totalQty === 0) return null
      const total = entries.reduce((sum, [itemId, qty]) => {
        const item = restaurant.menu.find((i) => i.id === Number(itemId))
        return sum + (item ? item.price * qty : 0)
      }, 0)
      return { restaurant, totalQty, total }
    })
    .filter(Boolean)

  if (pending.length === 0) return null

  const fmtDeadline = (iso) => {
    const d = new Date(iso)
    return d.toLocaleString(lang === 'zh' ? 'zh-TW' : 'en-US', {
      weekday: 'short', hour: 'numeric', minute: '2-digit',
    })
  }

  return (
    <section className="max-w-6xl mx-auto px-4 pt-10">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={16} className="text-amber-400" />
        <h2 className="text-sm font-bold uppercase tracking-widest text-amber-400">
          {t('pendingOrdersTitle', lang)}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pending.map(({ restaurant, totalQty, total }) => {
          const name = lang === 'zh' ? restaurant.name_zh : restaurant.name_en
          return (
            <button
              key={restaurant.id}
              onClick={() => navigate(`/restaurant/${restaurant.id}`)}
              className="group text-left rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 backdrop-blur-sm p-5 hover:border-amber-400/60 hover:shadow-lg hover:shadow-amber-500/10 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl shrink-0">{restaurant.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-400/80 mb-0.5">
                    {t('pendingOrdersDesc', lang)}
                  </p>
                  <h3 className="text-base font-bold text-white truncate">{name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 tabular-nums">
                    {totalQty} {lang === 'zh' ? '件' : 'items'} · ${total.toFixed(2)}
                  </p>
                  <p className="text-[11px] text-amber-300/90 mt-2 leading-snug">
                    {t('completeBefore', lang)}{' '}
                    <span className="font-semibold">{fmtDeadline(restaurant.dropCloseAt)}</span>
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 group-hover:translate-x-0.5 transition-transform shrink-0">
                  {t('resumeCheckout', lang)}
                  <ChevronRight size={14} />
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default function PortalHome() {
  const { lang, carts } = useApp()
  const [query, setQuery] = useState('')
  const [nameQuery, setNameQuery] = useState('')
  const [sort, setSort] = useState('closing')

  const filtered = useMemo(() => {
    // Outer "zip/address" search (hero) filters first.
    let list = RESTAURANTS
    const q = query.trim()
    if (q) {
      const lc = q.toLowerCase()
      list = list.filter((r) =>
        r.zipCodes.some((z) => z.startsWith(q)) ||
        r.name_en.toLowerCase().includes(lc) ||
        r.name_zh.includes(q) ||
        r.hubCity.en.toLowerCase().includes(lc) ||
        r.hubCity.zh.includes(q),
      )
    }
    // Inner "by restaurant name" search (feed) narrows further.
    const nq = nameQuery.trim()
    if (nq) {
      const lc = nq.toLowerCase()
      list = list.filter((r) =>
        r.name_en.toLowerCase().includes(lc) || r.name_zh.includes(nq),
      )
    }
    // Sort.
    const arr = [...list]
    if (sort === 'closing') {
      arr.sort((a, b) => new Date(a.dropCloseAt).getTime() - new Date(b.dropCloseAt).getTime())
    } else if (sort === 'name') {
      arr.sort((a, b) => a.name_en.localeCompare(b.name_en))
    }
    return arr
  }, [query, nameQuery, sort])

  const useCurrentLocation = () => {
    // Mock — in production, call navigator.geolocation + reverse-geocode to zip.
    setQuery('91748')
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-slate-950 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-800/70">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-slate-950 to-slate-950"
        />
        <div
          aria-hidden
          className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl"
        />
        <div className="relative max-w-6xl mx-auto px-4 py-14 md:py-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400 mb-3">
            {t('portalHeroEyebrow', lang)}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight max-w-2xl">
            {t('portalHeroTitle', lang)}
          </h1>
          <p className="text-slate-400 text-base md:text-lg mt-4 max-w-xl leading-relaxed">
            {t('portalHeroDesc', lang)}
          </p>

          {/* Search */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('portalSearchPlaceholder', lang)}
                className="w-full bg-slate-900/70 backdrop-blur-sm border border-slate-700/70 rounded-full pl-12 pr-5 py-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/70 transition-all"
              />
            </div>
            <button
              onClick={useCurrentLocation}
              className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-5 py-4 rounded-full transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
            >
              {t('useCurrentLocation', lang)}
            </button>
          </div>
        </div>
      </section>

      <AbandonedCartWidget carts={carts} lang={lang} />

      {/* Feed */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold">{t('activeDropsTitle', lang)}</h2>
          <span className="text-xs text-slate-500 tabular-nums">
            {filtered.length} / {RESTAURANTS.length}
          </span>
        </div>

        {/* Search + Sort header */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={nameQuery}
              onChange={(e) => setNameQuery(e.target.value)}
              placeholder={t('searchRestaurants', lang)}
              className="w-full bg-slate-900/70 backdrop-blur-sm border border-slate-700/70 rounded-full pl-11 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/70 transition-all"
            />
          </div>
          <div className="inline-flex items-center gap-2 bg-slate-900/70 backdrop-blur-sm border border-slate-700/70 rounded-full pl-4 pr-2 py-2 self-start sm:self-auto">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {t('sortBy', lang)}
            </span>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent text-xs font-semibold text-white focus:outline-none appearance-none pr-5 cursor-pointer"
              >
                <option value="closing" className="bg-slate-900">{t('sortDropClosing', lang)}</option>
                <option value="name" className="bg-slate-900">{t('sortNameAZ', lang)}</option>
              </select>
              <ChevronDown size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-12 text-center text-slate-400">
            {t('noResults', lang)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((r, i) => (
              <DropCard key={r.id} r={r} lang={lang} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
