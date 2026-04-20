import { useEffect, useRef, useState } from 'react'
import { Link, useMatch, useNavigate, useLocation } from 'react-router-dom'
import { Globe, ShoppingCart, User, LogOut, History, Home, Gift, AlertTriangle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { t } from '../i18n'

// ─── Unified Global Header ───
// Logo → /, language toggle, profile dropdown, cart badge (only on drop pages).

export default function GlobalHeader() {
  const { user, signOut, lang, toggleLang, carts, openAuthModal, setIsCartOpen } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const isRoot = location.pathname === '/'
  const dropMatch = useMatch('/restaurant/:id')
  const restaurantId = dropMatch?.params.id
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const restaurantCart = restaurantId ? carts[restaurantId] || {} : {}
  const cartCount = Object.values(restaurantCart).reduce((s, q) => s + q, 0)

  const handleProfileClick = () => {
    if (!user) { openAuthModal(); return }
    setMenuOpen((v) => !v)
  }

  return (
    <header className="bg-slate-900 sticky top-0 z-[90] shadow-lg shadow-slate-950/30 border-b border-slate-800/70">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {isRoot ? (
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-2 cursor-default select-none">
              <span className="text-amber-400">✦</span>
              FoodservAI
            </span>
          ) : (
            <Link
              to="/"
              className="text-lg font-bold tracking-tight text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <span className="text-amber-400">✦</span>
              FoodservAI
            </Link>
          )}
          {!isRoot && (
            <Link
              to="/"
              className="ml-2 inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-amber-300 bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 rounded-full transition-all cursor-pointer border border-slate-700/50"
              aria-label="Home"
            >
              <Home size={13} />
              <span className="hidden sm:inline">{t('home', lang)}</span>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 text-xs font-medium text-amber-400/90 hover:text-amber-300 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-full transition-all cursor-pointer border border-slate-700/50"
          >
            <Globe size={13} />
            {lang === 'en' ? '中文' : 'EN'}
          </button>

          {dropMatch && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-full transition-all cursor-pointer border border-slate-700/50"
            >
              <ShoppingCart size={15} />
              <span className="hidden sm:inline">{t('cart', lang)}</span>
              <span className="tabular-nums">({cartCount})</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-900 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-slate-900">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          <div className="relative" ref={menuRef}>
            <button
              onClick={handleProfileClick}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700/50 flex items-center justify-center transition-all cursor-pointer group"
              aria-label={user ? 'Profile' : 'Sign in'}
            >
              <User size={16} className="text-slate-300 group-hover:text-white" />
              {user && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-amber-400 rounded-full ring-2 ring-slate-900" />
              )}
            </button>

            {user && menuOpen && (
              <div
                className="absolute right-0 top-11 w-56 bg-slate-900 border border-slate-700/60 rounded-2xl shadow-xl shadow-black/40 overflow-hidden animate-[slideUp_160ms_ease-out] z-[95]"
              >
                <div className="px-4 py-3 border-b border-slate-800">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{t('profile', lang)}</p>
                  <p className="text-sm font-medium text-white truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => { setMenuOpen(false); navigate('/history') }}
                  className="w-full text-left px-4 py-3 text-sm text-slate-200 hover:bg-slate-800 transition-colors flex items-center gap-2.5 cursor-pointer"
                >
                  <History size={15} className="text-amber-400" />
                  {t('orderHistoryTitle', lang)}
                </button>
                <button
                  onClick={() => { setMenuOpen(false); navigate('/rewards') }}
                  className="w-full text-left px-4 py-3 text-sm text-slate-200 hover:bg-slate-800 transition-colors flex items-center gap-2.5 cursor-pointer border-t border-slate-800"
                >
                  <Gift size={15} className="text-amber-400" />
                  {t('rewards', lang)}
                </button>
                <button
                  onClick={() => { setMenuOpen(false); navigate('/report') }}
                  className="w-full text-left px-4 py-3 text-sm text-slate-200 hover:bg-slate-800 transition-colors flex items-center gap-2.5 cursor-pointer border-t border-slate-800"
                >
                  <AlertTriangle size={15} className="text-amber-400" />
                  {t('reportIssue', lang)}
                </button>
                <button
                  onClick={() => { setMenuOpen(false); signOut() }}
                  className="w-full text-left px-4 py-3 text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2.5 cursor-pointer border-t border-slate-800"
                >
                  <LogOut size={15} />
                  {t('signOut', lang)}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
