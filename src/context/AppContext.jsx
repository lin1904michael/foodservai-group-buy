import { createContext, useContext, useEffect, useState, useCallback } from 'react'

// ─── Global app state: user, language, per-restaurant carts, auth modal, cart drawer.
// Persists user + carts + lang to localStorage so refreshes survive.

const AppContext = createContext(null)

const LS_KEYS = {
  user: 'foodservai.user',
  carts: 'foodservai.carts',
  lang: 'foodservai.lang',
}

const readLS = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const writeLS = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore quota / private mode */
  }
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => readLS(LS_KEYS.user, null))
  const [lang, setLang] = useState(() => readLS(LS_KEYS.lang, 'en'))
  // carts: { [restaurantId]: { [itemId]: qty } }
  const [carts, setCarts] = useState(() => readLS(LS_KEYS.carts, {}))
  // authModal: { isOpen, onSuccess }
  const [authModal, setAuthModal] = useState({ isOpen: false, onSuccess: null })
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => { writeLS(LS_KEYS.user, user) }, [user])
  useEffect(() => { writeLS(LS_KEYS.carts, carts) }, [carts])
  useEffect(() => { writeLS(LS_KEYS.lang, lang) }, [lang])

  const toggleLang = useCallback(() => {
    setLang((l) => (l === 'en' ? 'zh' : 'en'))
  }, [])

  const addItem = useCallback((restaurantId, itemId) => {
    setCarts((prev) => {
      const r = prev[restaurantId] || {}
      return { ...prev, [restaurantId]: { ...r, [itemId]: (r[itemId] || 0) + 1 } }
    })
  }, [])

  const removeItem = useCallback((restaurantId, itemId) => {
    setCarts((prev) => {
      const r = { ...(prev[restaurantId] || {}) }
      if ((r[itemId] || 0) > 1) r[itemId] -= 1
      else delete r[itemId]
      return { ...prev, [restaurantId]: r }
    })
  }, [])

  const clearCart = useCallback((restaurantId) => {
    setCarts((prev) => {
      const next = { ...prev }
      delete next[restaurantId]
      return next
    })
  }, [])

  const openAuthModal = useCallback((opts = {}) => {
    setAuthModal({ isOpen: true, onSuccess: opts.onSuccess || null })
  }, [])

  const closeAuthModal = useCallback(() => {
    setAuthModal({ isOpen: false, onSuccess: null })
  }, [])

  const requireAuth = useCallback((onSuccess) => {
    if (user) { onSuccess?.(); return }
    openAuthModal({ onSuccess })
  }, [user, openAuthModal])

  const signIn = useCallback((email) => {
    const nextUser = { email, signedInAt: new Date().toISOString() }
    setUser(nextUser)
    // Fire the queued action AFTER user state updates via the next setState batch.
    const pending = authModal.onSuccess
    setAuthModal({ isOpen: false, onSuccess: null })
    if (pending) queueMicrotask(pending)
  }, [authModal.onSuccess])

  const signOut = useCallback(() => setUser(null), [])

  const value = {
    user, signIn, signOut,
    lang, toggleLang,
    carts, addItem, removeItem, clearCart,
    authModal, openAuthModal, closeAuthModal, requireAuth,
    isCartOpen, setIsCartOpen,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
