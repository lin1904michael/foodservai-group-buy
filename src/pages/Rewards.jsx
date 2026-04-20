import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Gift, Sparkles, Clock, ChevronDown, Search, Star, CheckCircle,
  Store, ShieldAlert, X, AlertTriangle,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { REWARDS, USER_POINTS } from '../data/rewards'
import { getPreviouslyOrderedRestaurantIds } from './OrderHistory'
import { t } from '../i18n'

// ─── /rewards page ───
// Subtabs: Available / Past. In-store redemption requires a deliberate
// "Confirm with Staff" action and auto-expires after 15 minutes.

const SORTS = ['highest', 'lowest', 'expiring']
const REDEMPTION_WINDOW_MS = 15 * 60 * 1000 // Phase 9C: 15 minutes

function formatCountdown(ms) {
  if (ms <= 0) return '0:00'
  const s = Math.ceil(ms / 1000)
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

function RewardCard({ reward, lang, userPoints, used, onUseInStore }) {
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
    <div className={`bg-slate-900/80 backdrop-blur-sm border rounded-3xl p-5 transition-all ${used ? 'border-slate-700/40 opacity-70' : 'border-slate-700/60 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10'}`}>
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
        {used ? (
          <button
            disabled
            className="w-full bg-slate-800 text-slate-500 font-bold text-sm py-3 rounded-full border border-slate-700/60 inline-flex items-center justify-center gap-1.5 cursor-default"
          >
            <CheckCircle size={14} />
            {t('rewardUsedLabel', lang)}
          </button>
        ) : canRedeem ? (
          <button
            onClick={() => onUseInStore(reward)}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm py-3 rounded-full transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] inline-flex items-center justify-center gap-1.5"
          >
            <Store size={14} />
            {t('useInStore', lang)}
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

function UsedRewardCard({ entry, lang }) {
  const { reward, usedAt } = entry
  const title = lang === 'zh' ? reward.title_zh : reward.title_en
  const rName = lang === 'zh' ? reward.restaurantName_zh : reward.restaurantName_en
  const usedDate = new Date(usedAt).toLocaleDateString(
    lang === 'zh' ? 'zh-TW' : 'en-US',
    { month: 'short', day: 'numeric', year: 'numeric' },
  )
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 opacity-90">
      <div className="flex items-start gap-4">
        <span className="text-4xl shrink-0 grayscale">{reward.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">{rName}</p>
          <h3 className="text-base font-bold text-slate-300 leading-tight mt-0.5 line-through decoration-slate-600">{title}</h3>
          <p className="text-[11px] text-slate-500 mt-2">
            {t('rewardUsedOn', lang)} {usedDate}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">
          <CheckCircle size={10} />
          {t('rewardUsedLabel', lang)}
        </span>
      </div>
    </div>
  )
}

// ─── Anti-fraud: Confirm → Live pulsing redemption screen ───
function ConfirmModal({ reward, lang, onCancel, onConfirm }) {
  const title = lang === 'zh' ? reward.title_zh : reward.title_en
  const rName = lang === 'zh' ? reward.restaurantName_zh : reward.restaurantName_en
  return (
    <div className="fixed inset-0 z-[150] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center px-4 animate-[fadeIn_180ms_ease-out]">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/60 rounded-3xl p-6 shadow-2xl animate-[scaleIn_220ms_cubic-bezier(0.2,0.9,0.3,1.2)_both]">
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            <ShieldAlert size={11} />
            {t('confirmRedemption', lang)}
          </div>
          <button onClick={onCancel} className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center cursor-pointer" aria-label="Close">
            <X size={14} className="text-slate-400" />
          </button>
        </div>
        <div className="flex items-start gap-3 mb-4">
          <span className="text-4xl shrink-0">{reward.emoji}</span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-400/80">{rName}</p>
            <h3 className="text-lg font-bold text-white leading-tight">{title}</h3>
            <p className="text-xs text-amber-300 font-semibold mt-1 tabular-nums">-{reward.pointsRequired} {t('points', lang)}</p>
          </div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-5">
          <p className="text-xs text-amber-200 leading-relaxed">
            <span className="font-bold">{t('antiFraudTitle', lang)}</span> {t('antiFraudBody', lang)}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={onCancel} className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm py-3 rounded-full transition-colors cursor-pointer border border-slate-700">
            {t('cancel', lang)}
          </button>
          <button onClick={onConfirm} className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm py-3 rounded-full transition-all cursor-pointer inline-flex items-center justify-center gap-1.5">
            <ShieldAlert size={14} />
            {t('confirmWithStaff', lang)}
          </button>
        </div>
      </div>
    </div>
  )
}

function ActiveRedemptionScreen({ reward, lang, expiresAt, onStaffTap }) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 500)
    return () => clearInterval(id)
  }, [])
  const msLeft = expiresAt - now
  const title = lang === 'zh' ? reward.title_zh : reward.title_en
  const rName = lang === 'zh' ? reward.restaurantName_zh : reward.restaurantName_en
  return (
    <div className="fixed inset-0 z-[160] bg-gradient-to-br from-amber-500 via-amber-400 to-amber-500 flex items-center justify-center px-4 animate-[fadeIn_220ms_ease-out]">
      {/* Pulsing halo */}
      <div aria-hidden className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[28rem] h-[28rem] rounded-full bg-white/30 animate-ping" />
      </div>
      <div className="relative w-full max-w-md bg-slate-950 border-4 border-white rounded-3xl p-8 text-center shadow-2xl animate-[scaleIn_260ms_cubic-bezier(0.2,0.9,0.3,1.2)_both]">
        <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/60 text-amber-200 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
          <Sparkles size={11} className="animate-pulse" />
          {t('liveRedemption', lang)}
        </div>
        <span className="text-6xl block mb-3 animate-pulse">{reward.emoji}</span>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-400/80">{rName}</p>
        <h2 className="text-2xl font-bold text-white leading-tight mt-1">{title}</h2>
        <p className="text-sm text-amber-200 mt-4 font-semibold">{t('showCashier', lang)}</p>

        <div className="mt-6 bg-amber-500/10 border border-amber-400/40 rounded-2xl py-5 px-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-300/80">{t('expiresIn', lang)}</p>
          <p className="text-5xl font-bold text-amber-300 tabular-nums mt-1 animate-pulse">
            {formatCountdown(msLeft)}
          </p>
        </div>

        <button
          onClick={onStaffTap}
          className="mt-6 w-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-base py-4 rounded-2xl transition-all cursor-pointer inline-flex items-center justify-center gap-2 shadow-lg shadow-rose-600/40 border-2 border-rose-400/50"
        >
          <AlertTriangle size={18} />
          {t('staffTap', lang)}
        </button>
        <p className="text-[10px] text-slate-400 mt-2">{t('staffTapHelper', lang)}</p>
      </div>
    </div>
  )
}

export default function Rewards() {
  const { lang } = useApp()
  const [tab, setTab] = useState('available')
  const [sort, setSort] = useState('highest')
  const [query, setQuery] = useState('')
  const [points, setPoints] = useState(USER_POINTS)
  const [usedRewards, setUsedRewards] = useState([]) // Array<{ reward, usedAt }>
  const [pendingReward, setPendingReward] = useState(null)
  const [activeRedemption, setActiveRedemption] = useState(null) // { reward, expiresAt }
  const expireTimerRef = useRef(null)

  const previousIds = useMemo(() => new Set(getPreviouslyOrderedRestaurantIds()), [])
  const usedIds = useMemo(() => new Set(usedRewards.map((e) => e.reward.id)), [usedRewards])

  const markUsed = (reward) => {
    setUsedRewards((prev) => [{ reward, usedAt: new Date().toISOString() }, ...prev])
  }

  const handleUseInStore = (reward) => {
    if (usedIds.has(reward.id) || points < reward.pointsRequired) return
    setPendingReward(reward)
  }

  const handleConfirmWithStaff = () => {
    const reward = pendingReward
    if (!reward) return
    setPoints((p) => p - reward.pointsRequired)
    const expiresAt = Date.now() + REDEMPTION_WINDOW_MS
    setActiveRedemption({ reward, expiresAt })
    setPendingReward(null)
  }

  const handleStaffTap = () => {
    if (!activeRedemption) return
    markUsed(activeRedemption.reward)
    setActiveRedemption(null)
    if (expireTimerRef.current) {
      clearTimeout(expireTimerRef.current)
      expireTimerRef.current = null
    }
  }

  // Auto-expire 15-minute window
  useEffect(() => {
    if (!activeRedemption) return
    const ms = activeRedemption.expiresAt - Date.now()
    expireTimerRef.current = setTimeout(() => {
      markUsed(activeRedemption.reward)
      setActiveRedemption(null)
    }, Math.max(0, ms))
    return () => {
      if (expireTimerRef.current) clearTimeout(expireTimerRef.current)
    }
  }, [activeRedemption])

  const { pinned, others, empty } = useMemo(() => {
    const q = query.trim().toLowerCase()
    const base = REWARDS.filter((r) => !usedIds.has(r.id))
    const filtered = base.filter((r) => {
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
  }, [sort, query, previousIds, usedIds])

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-slate-950 text-white">
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

      {/* Subtabs */}
      <section className="max-w-4xl mx-auto px-4 pt-8">
        <div className="inline-flex items-center gap-1 bg-slate-900/70 border border-slate-800 rounded-full p-1">
          <button
            onClick={() => setTab('available')}
            className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${tab === 'available' ? 'bg-amber-500 text-slate-900 shadow' : 'text-slate-400 hover:text-white'}`}
          >
            {t('tabAvailable', lang)}
          </button>
          <button
            onClick={() => setTab('used')}
            className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer inline-flex items-center gap-1.5 ${tab === 'used' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            {t('tabUsed', lang)}
            {usedRewards.length > 0 && (
              <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full tabular-nums">
                {usedRewards.length}
              </span>
            )}
          </button>
        </div>
      </section>

      {/* Feed */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        {tab === 'available' ? (
          <>
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
                        <RewardCard key={r.id} reward={r} lang={lang} userPoints={points} used={usedIds.has(r.id)} onUseInStore={handleUseInStore} />
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
                        <RewardCard key={r.id} reward={r} lang={lang} userPoints={points} used={usedIds.has(r.id)} onUseInStore={handleUseInStore} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          // Past / Used tab
          usedRewards.length === 0 ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-12 text-center text-slate-400">
              {t('noUsedRewards', lang)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {usedRewards.map((entry, i) => (
                <UsedRewardCard key={`${entry.reward.id}-${i}`} entry={entry} lang={lang} />
              ))}
            </div>
          )
        )}
      </section>

      {/* Confirm modal */}
      {pendingReward && (
        <ConfirmModal
          reward={pendingReward}
          lang={lang}
          onCancel={() => setPendingReward(null)}
          onConfirm={handleConfirmWithStaff}
        />
      )}

      {/* Active live redemption screen */}
      {activeRedemption && (
        <ActiveRedemptionScreen
          reward={activeRedemption.reward}
          lang={lang}
          expiresAt={activeRedemption.expiresAt}
          onStaffTap={handleStaffTap}
        />
      )}
    </div>
  )
}
