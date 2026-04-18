import { useEffect, useMemo, useState } from 'react'
import { Gift, Sparkles, Clock, ChevronDown, Search, Star, CheckCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { REWARDS, USER_POINTS } from '../data/rewards'
import { getPreviouslyOrderedRestaurantIds } from './OrderHistory'
import { t } from '../i18n'

// ─── /rewards page ───
// Search by restaurant + sort + "previously ordered" pinning.

const SORTS = ['highest', 'lowest', 'expiring']

function RewardCard({ reward, lang, userPoints, claimed, onRedeem }) {
  const title = lang === 'zh' ? reward.title_zh : reward.title_en
  const desc = lang === 'zh' ? reward.description_zh : reward.description_en
  const rName = lang === 'zh' ? reward.restaurantName_zh : reward.restaurantName_en
  const canRedeem = userPoints >= reward.pointsRequired
  const deficit = reward.pointsRequired - userPoints
  const expDate = new Date(reward.expiresAt).toLocaleDateString(
    lang === 'zh' ? 'zh-TW' : 'en-US',
    { month: 'short', day: 'numeric' },
  )

  return (
    <div className={`bg-slate-900/80 backdrop-blur-sm border rounded-3xl p-5 transition-all ${claimed ? 'border-emerald-500/40' : 'border-slate-700/60 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10'}`}>
      <div className="flex items-start gap-4">
        <span className="text-4xl shrink-0">{reward.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-400/80">{rName}</p>
          <h3 className="text-base font-bold text-white leading-tight mt-0.5">{title}</h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{desc}</p>

          <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1 text-amber-300 font-semibold tabular-nums">
              <Sparkles size={11} />
              {reward.pointsRequired} {t('points', lang)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock size={11} />
              {t('expires', lang)} {expDate}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        {claimed ? (
          <button
            disabled
            className="w-full bg-emerald-500/15 text-emerald-300 font-bold text-sm py-3 rounded-full border border-emerald-500/30 inline-flex items-center justify-center gap-1.5 cursor-default"
          >
            <CheckCircle size={14} />
            {t('rewardClaimed', lang)}
          </button>
        ) : canRedeem ? (
          <button
            onClick={() => onRedeem(reward)}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm py-3 rounded-full transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
          >
            {t('redeem', lang)}
          </button>
        ) : (
          <button
            disabled
            className="w-full bg-slate-800 text-slate-500 font-semibold text-sm py-3 rounded-full cursor-not-allowed border border-slate-700/60"
          >
            {t('needMore', lang)} {deficit} {t('morePoints', lang)}
          </button>
        )}
      </div>
    </div>
  )
}

export default function Rewards() {
  const { lang } = useApp()
  const [sort, setSort] = useState('highest')
  const [query, setQuery] = useState('')
  const [points, setPoints] = useState(USER_POINTS)
  const [claimedIds, setClaimedIds] = useState(() => new Set())
  const [toast, setToast] = useState(null)

  const previousIds = useMemo(() => new Set(getPreviouslyOrderedRestaurantIds()), [])

  const handleRedeem = (reward) => {
    if (claimedIds.has(reward.id) || points < reward.pointsRequired) return
    setPoints((p) => p - reward.pointsRequired)
    setClaimedIds((prev) => {
      const next = new Set(prev)
      next.add(reward.id)
      return next
    })
    const title = lang === 'zh' ? reward.title_zh : reward.title_en
    setToast({ title, points: reward.pointsRequired })
  }

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(id)
  }, [toast])

  const { pinned, others, empty } = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = REWARDS.filter((r) => {
      if (!q) return true
      return (
        r.restaurantName_en.toLowerCase().includes(q) ||
        r.restaurantName_zh.includes(query.trim())
      )
    })
    const sortFn = (a, b) => {
      if (sort === 'highest') return b.pointsRequired - a.pointsRequired
      if (sort === 'lowest') return a.pointsRequired - b.pointsRequired
      return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()
    }
    const p = filtered.filter((r) => previousIds.has(r.restaurantId)).sort(sortFn)
    const o = filtered.filter((r) => !previousIds.has(r.restaurantId)).sort(sortFn)
    return { pinned: p, others: o, empty: filtered.length === 0 }
  }, [sort, query, previousIds])

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-slate-950 text-white">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[110] bg-emerald-500/95 backdrop-blur-md text-slate-950 font-semibold text-sm px-5 py-3 rounded-full shadow-xl shadow-emerald-500/30 border border-emerald-300/40 inline-flex items-center gap-2 animate-[fadeIn_220ms_ease-out]">
          <CheckCircle size={16} />
          <span>{t('rewardRedeemed', lang).replace('{title}', toast.title).replace('{points}', toast.points)}</span>
        </div>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-800/70">
        <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-slate-950 to-slate-950" />
        <div aria-hidden className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 py-12 md:py-16">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-4">
            <Gift size={12} />
            {t('rewards', lang)}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight">
            {t('rewardsTitle', lang)}
          </h1>
          <p className="text-slate-400 text-sm md:text-base mt-3 max-w-xl leading-relaxed">
            {t('rewardsSubtitle', lang)}
          </p>

          {/* Points balance */}
          <div className="mt-8 bg-slate-900/70 backdrop-blur-md border border-amber-500/30 rounded-3xl p-5 md:p-6 flex items-center justify-between max-w-md">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-400/80">
                {t('currentPoints', lang)}
              </p>
              <p className="text-3xl md:text-4xl font-bold text-white mt-1 tabular-nums">
                {points.toLocaleString()}
                <span className="text-sm font-medium text-slate-400 ml-2">{t('points', lang)}</span>
              </p>
            </div>
            <Sparkles size={36} className="text-amber-400 opacity-70" />
          </div>
        </div>
      </section>

      {/* Feed */}
      <section className="max-w-4xl mx-auto px-4 py-10">
        {/* Search + Sort header */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchRewards', lang)}
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
                {SORTS.map((s) => (
                  <option key={s} value={s} className="bg-slate-900">
                    {s === 'highest' ? t('sortHighest', lang) : s === 'lowest' ? t('sortLowest', lang) : t('sortExpiring', lang)}
                  </option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {empty ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-12 text-center text-slate-400">
            {t('noRewardsFound', lang)}
          </div>
        ) : (
          <>
            {pinned.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Star size={14} className="text-amber-400" />
                  <h2 className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
                    {t('previouslyOrdered', lang)}
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pinned.map((r) => (
                    <RewardCard key={r.id} reward={r} lang={lang} userPoints={points} claimed={claimedIds.has(r.id)} onRedeem={handleRedeem} />
                  ))}
                </div>
              </div>
            )}

            {others.length > 0 && (
              <div>
                {pinned.length > 0 && (
                  <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3">
                    {t('otherRewards', lang)}
                  </h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {others.map((r) => (
                    <RewardCard key={r.id} reward={r} lang={lang} userPoints={points} claimed={claimedIds.has(r.id)} onRedeem={handleRedeem} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
