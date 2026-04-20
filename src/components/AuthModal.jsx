import { useEffect, useRef, useState } from 'react'
import { X, Mail, KeyRound, Sparkles } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { t } from '../i18n'

// ─── Global Auth Gate Modal ───
// Two-step local state: 'email' | 'otp'. Sign-in mocked (any 4 digits accepted).

export default function AuthModal() {
  const { authModal, closeAuthModal, signIn, lang } = useApp()
  const [screen, setScreen] = useState('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState(['', '', '', ''])
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const firstOtpRef = useRef(null)
  const emailRef = useRef(null)

  // Reset every time the modal opens.
  useEffect(() => {
    if (authModal.isOpen) {
      setScreen('email')
      setCode(['', '', '', ''])
      setSending(false)
      setVerifying(false)
      // Tiny delay so the transition finishes before we focus.
      requestAnimationFrame(() => emailRef.current?.focus())
    }
  }, [authModal.isOpen])

  if (!authModal.isOpen) return null

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const isCodeComplete = code.every((c) => c.length === 1)

  const handleSendCode = () => {
    if (!isValidEmail) return
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setScreen('otp')
      requestAnimationFrame(() => firstOtpRef.current?.focus())
    }, 700)
  }

  const handleCodeChange = (idx, v) => {
    const digit = v.replace(/\D/g, '').slice(-1)
    const next = [...code]
    next[idx] = digit
    setCode(next)
    if (digit && idx < 3) {
      const siblings = firstOtpRef.current?.parentElement?.querySelectorAll('input')
      siblings?.[idx + 1]?.focus()
    }
  }

  const handleCodeKey = (idx, e) => {
    if (e.key === 'Backspace' && !code[idx] && idx > 0) {
      const siblings = firstOtpRef.current?.parentElement?.querySelectorAll('input')
      siblings?.[idx - 1]?.focus()
    }
  }

  const handleVerify = () => {
    if (!isCodeComplete) return
    setVerifying(true)
    setTimeout(() => {
      setVerifying(false)
      signIn(email.trim())
    }, 800)
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm animate-[fadeIn_200ms_ease-out]"
        onClick={closeAuthModal}
      />

      {/* Card */}
      <div
        className="relative w-full max-w-md bg-slate-900 border border-slate-700/60 rounded-3xl shadow-2xl shadow-black/40 overflow-hidden
                   origin-center animate-[scaleIn_220ms_cubic-bezier(0.2,0.9,0.3,1.2)_both]"
      >
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={16} className="text-slate-300" />
        </button>

        <div className="p-8 pt-10">
          <div className="flex items-center gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-amber-500/20">
              <Sparkles size={12} />
              FoodservAI
            </span>
          </div>

          {screen === 'email' ? (
            <>
              <h2 className="text-2xl font-bold text-white leading-tight">{t('authTitle', lang)}</h2>
              <p className="text-sm text-slate-400 mt-2 mb-6">{t('authSubtitle', lang)}</p>

              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
                {t('emailAddress', lang)}
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  ref={emailRef}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && isValidEmail) handleSendCode() }}
                  placeholder="you@email.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/70 transition-all"
                />
              </div>

              <button
                onClick={handleSendCode}
                disabled={!isValidEmail || sending}
                className="mt-5 w-full bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-bold py-3.5 rounded-2xl transition-all duration-200 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
              >
                {sending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                    {t('processing', lang)}
                  </>
                ) : (
                  <>
                    <KeyRound size={16} />
                    {t('sendLoginCode', lang)}
                  </>
                )}
              </button>

              <p className="text-[11px] text-slate-500 text-center mt-4">{t('hint', lang)}</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white leading-tight">{t('enterCode', lang)}</h2>
              <p className="text-sm text-slate-400 mt-2 mb-6">
                {t('codeSentTo', lang)} <span className="text-amber-400 font-medium">{email}</span>
              </p>

              <div className="flex justify-center gap-3 mb-5">
                {code.map((v, i) => (
                  <input
                    key={i}
                    ref={i === 0 ? firstOtpRef : undefined}
                    inputMode="numeric"
                    maxLength={1}
                    value={v}
                    onChange={(e) => handleCodeChange(i, e.target.value)}
                    onKeyDown={(e) => handleCodeKey(i, e)}
                    className="w-14 h-16 text-center text-2xl font-bold bg-slate-800 border border-slate-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/70 transition-all"
                  />
                ))}
              </div>

              <button
                onClick={handleVerify}
                disabled={!isCodeComplete || verifying}
                className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-bold py-3.5 rounded-2xl transition-all duration-200 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
              >
                {verifying ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                    {t('confirming', lang)}
                  </>
                ) : (
                  t('verifyContinue', lang)
                )}
              </button>

              <button
                onClick={() => setScreen('email')}
                className="mt-4 w-full text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              >
                ← {t('changeEmail', lang)}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
