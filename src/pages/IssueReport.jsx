import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AlertTriangle, Camera, CheckCircle, Send, ChevronLeft, Clock } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { MOCK_ORDERS } from './OrderHistory'
import { t } from '../i18n'

// ─── /report page ───
// Client-side image compression → Base64 → simulated n8n POST.

const ISSUE_TYPES = ['missing', 'quality', 'wrong', 'other']
const ONE_DAY_MS = 24 * 60 * 60 * 1000

// Canvas-based image compression. Max width 800px, JPEG quality 0.6.
// Returns a Base64 data URL string. No external libraries.
async function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.onload = (e) => {
      const img = new Image()
      img.onerror = () => reject(new Error('Failed to decode image'))
      img.onload = () => {
        const MAX_WIDTH = 800
        const scale = Math.min(1, MAX_WIDTH / img.width)
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, w, h)
        const base64 = canvas.toDataURL('image/jpeg', 0.6)
        resolve({ base64, width: w, height: h })
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

function issueLabel(type, lang) {
  const key =
    type === 'missing' ? 'issueTypeMissing' :
    type === 'quality' ? 'issueTypeQuality' :
    type === 'wrong'   ? 'issueTypeWrong'   : 'issueTypeOther'
  return t(key, lang)
}

export default function IssueReport() {
  const { user, lang, openAuthModal } = useApp()
  const navigate = useNavigate()

  const [selectedOrderId, setSelectedOrderId] = useState('')
  const [issueType, setIssueType] = useState('')
  const [description, setDescription] = useState('')
  const [photoBase64, setPhotoBase64] = useState(null)
  const [photoMeta, setPhotoMeta] = useState(null)
  const [compressing, setCompressing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Guest gate.
  useEffect(() => { if (!user) openAuthModal() }, [user, openAuthModal])
  if (!user) return <Navigate to="/" replace />

  // 9C: Only orders within the last 24 hours are eligible.
  const eligibleOrders = useMemo(() => {
    const now = Date.now()
    return MOCK_ORDERS.filter((o) => now - new Date(o.date).getTime() <= ONE_DAY_MS)
  }, [])

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setCompressing(true)
      const { base64, width, height } = await compressImage(file)
      setPhotoBase64(base64)
      const originalKb = Math.round(file.size / 1024)
      const compressedKb = Math.round((base64.length * 0.75) / 1024)
      setPhotoMeta({ originalKb, compressedKb, width, height })
    } catch (err) {
      console.error('Image compression failed:', err)
    } finally {
      setCompressing(false)
    }
  }

  const canSubmit = selectedOrderId && issueType && description.trim() && !submitting

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    const payload = {
      userEmail: user.email,
      orderId: selectedOrderId,
      issueType,
      description: description.trim(),
      compressedImageBase64: photoBase64,
      submittedAt: new Date().toISOString(),
    }
    // TODO: Route to n8n Issue Webhook
    console.log('SENDING ISSUE REPORT TO N8N WEBHOOK:', {
      ...payload,
      compressedImageBase64: payload.compressedImageBase64
        ? `[base64 ${Math.round((payload.compressedImageBase64.length * 0.75) / 1024)}KB]`
        : null,
    })
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 900)
  }

  // Success screen
  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-slate-950 text-white flex items-center justify-center px-4">
        <div className="max-w-md text-center animate-[fadeIn_220ms_ease-out]">
          <div className="w-20 h-20 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-5 animate-[scaleIn_280ms_cubic-bezier(0.2,0.9,0.3,1.2)_both]">
            <CheckCircle size={40} className="text-emerald-400" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{t('issueSuccessTitle', lang)}</h1>
          <p className="text-slate-400 text-sm leading-relaxed">{t('issueSuccessBody', lang)}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-8 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm px-6 py-3 rounded-full transition-all cursor-pointer"
          >
            {t('issueBackToReports', lang)}
          </button>
        </div>
      </div>
    )
  }

  // 9C fallback: no eligible orders in last 24 hours
  if (eligibleOrders.length === 0) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-slate-950 text-white">
        <section className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto mb-5">
            <Clock size={28} className="text-amber-400" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">{t('reportIssueTitle', lang)}</h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
            {t('issueNoOrders', lang)}
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-8 inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-sm px-5 py-2.5 rounded-full transition-colors cursor-pointer"
          >
            <ChevronLeft size={14} />
            {t('issueBackToReports', lang)}
          </button>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-slate-950 text-white">
      <section className="border-b border-slate-800/70">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-3">
            <AlertTriangle size={12} />
            {t('reportIssue', lang)}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight">{t('reportIssueTitle', lang)}</h1>
          <p className="text-slate-400 mt-2 text-sm md:text-base">{t('reportIssueSubtitle', lang)}</p>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-4 py-10">
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-3xl p-6 md:p-7 shadow-xl space-y-5"
        >
          {/* Order Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
              {t('selectOrder', lang)} <span className="text-rose-400">*</span>
            </label>
            <select
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
            >
              <option value="">{t('selectOrderPlaceholder', lang)}</option>
              {eligibleOrders.map((o) => {
                const hoursAgo = Math.max(1, Math.round((Date.now() - new Date(o.date).getTime()) / (60 * 60 * 1000)))
                return (
                  <option key={o.orderId} value={o.orderId}>
                    {o.orderId} · {o.restaurantName} · {hoursAgo}h ago
                  </option>
                )
              })}
            </select>
          </div>

          {/* Issue Type */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
              {t('issueType', lang)} <span className="text-rose-400">*</span>
            </label>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
            >
              <option value="">{t('issueTypePlaceholder', lang)}</option>
              {ISSUE_TYPES.map((type) => (
                <option key={type} value={type}>{issueLabel(type, lang)}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
              {t('issueDescription', lang)} <span className="text-rose-400">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder={t('issueDescriptionPlaceholder', lang)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all resize-none"
            />
          </div>

          {/* Photo (one image only) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
              {t('issuePhoto', lang)}
            </label>
            <label className="flex items-center gap-3 bg-slate-950 border border-dashed border-slate-700 hover:border-amber-500/60 rounded-xl px-4 py-4 cursor-pointer transition-colors">
              <div className="w-10 h-10 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center">
                <Camera size={16} className="text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                {photoBase64 ? (
                  <p className="text-sm text-emerald-400 font-semibold truncate">
                    ✓ {photoMeta?.width}×{photoMeta?.height}px · {photoMeta?.originalKb}KB → {photoMeta?.compressedKb}KB
                  </p>
                ) : compressing ? (
                  <p className="text-sm text-amber-300 font-medium">Compressing…</p>
                ) : (
                  <p className="text-sm text-slate-400">Choose a photo</p>
                )}
                <p className="text-[11px] text-slate-500 mt-0.5">{t('issuePhotoHint', lang)}</p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple={false}
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
            {photoBase64 && (
              <div className="mt-3 inline-block">
                <img
                  src={photoBase64}
                  alt="preview"
                  className="max-h-40 rounded-xl border border-slate-700"
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-900 font-bold text-sm py-3.5 rounded-full transition-all cursor-pointer inline-flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                  {t('issueSubmitting', lang)}
                </>
              ) : (
                <>
                  <Send size={14} />
                  {t('issueSubmit', lang)}
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
