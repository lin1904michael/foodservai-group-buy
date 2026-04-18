import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ShoppingCart, Plus, Minus, ChevronRight, ChevronLeft, MapPin, Clock,
  CreditCard, Smartphone, CheckCircle, QrCode, X, Lock, Sparkles, FileText, Banknote, ArrowLeft,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { getRestaurant } from '../data/restaurants'
import { REWARDS, USER_POINTS } from '../data/rewards'
import { t, itemName, itemSub } from '../i18n'
import Countdown from '../components/Countdown'

const TAX_RATE = 0.09

// ─── Item card ───
function ItemCard({ item, quantity, onAdd, onRemove, lang }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5 transition-all duration-300">
      <div className={`relative ${item.image_placeholder_color} h-44 flex items-center justify-center`}>
        <span className="text-5xl opacity-60">
          {item.category.toLowerCase().includes('hot') || item.category.toLowerCase().includes('dumpling') ? '🍲' : item.category.toLowerCase().includes('kit') || item.category.toLowerCase().includes('concentrate') ? '🧋' : '🧊'}
        </span>
        {item.is_hot_seller && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {t('hotSeller', lang)}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 text-[15px] leading-tight">{itemName(item, lang)}</h3>
        <p className="text-slate-400 text-sm mt-0.5">{itemSub(item, lang)}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-slate-900">${item.price.toFixed(2)}</span>
          {quantity === 0 ? (
            <button onClick={onAdd} className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 cursor-pointer hover:scale-[1.03] active:scale-95">
              {t('add', lang)}
            </button>
          ) : (
            <div className="flex items-center gap-3 bg-slate-100 rounded-full px-1 py-1">
              <button onClick={onRemove} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer">
                <Minus size={14} className="text-slate-700" />
              </button>
              <span className="text-sm font-semibold text-slate-900 w-5 text-center tabular-nums">{quantity}</span>
              <button onClick={onAdd} className="w-8 h-8 rounded-full bg-amber-500 shadow-sm flex items-center justify-center hover:bg-amber-600 transition-colors cursor-pointer">
                <Plus size={14} className="text-white" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Invoice modal ───
function InvoiceModal({ form, cartItems, subtotal, paymentMethod, onClose, restaurantName, lang }) {
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax
  const isPaid = paymentMethod === 'stripe'

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 animate-[fadeIn_180ms_ease-out]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto animate-[scaleIn_220ms_cubic-bezier(0.2,0.9,0.3,1.2)_both]">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <FileText size={20} className="text-amber-500" />
              <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">{t('invoicePreview', lang)}</span>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer">
              <X size={16} className="text-slate-500" />
            </button>
          </div>
          <div className="text-center border-b border-dashed border-slate-200 pb-5 mb-5">
            <h3 className="text-xl font-bold text-slate-900">{restaurantName}</h3>
            <p className="text-xs text-slate-400 mt-1">Powered by FoodservAI</p>
          </div>
          <div className="mb-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{t('billTo', lang)}</p>
            <p className="text-sm font-medium text-slate-900">{form.name}</p>
            {form.company && <p className="text-sm text-slate-500">{form.company}</p>}
            <p className="text-sm text-slate-500">{form.email}</p>
            <p className="text-sm text-slate-500">{form.phone}</p>
          </div>
          <div className="border border-slate-200 rounded-2xl overflow-hidden mb-5">
            <div className="bg-slate-50 px-4 py-2.5 grid grid-cols-12 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <span className="col-span-6">{t('item', lang)}</span>
              <span className="col-span-2 text-center">{t('qty', lang)}</span>
              <span className="col-span-4 text-right">{t('amount', lang)}</span>
            </div>
            {cartItems.map(({ item, qty }) => (
              <div key={item.id} className="px-4 py-3 grid grid-cols-12 text-sm border-t border-slate-100 items-center">
                <div className="col-span-6">
                  <p className="font-medium text-slate-900 text-xs">{itemName(item, lang)}</p>
                  <p className="text-xs text-slate-400">{itemSub(item, lang)}</p>
                </div>
                <span className="col-span-2 text-center text-slate-600">{qty}</span>
                <span className="col-span-4 text-right font-medium text-slate-900">${(item.price * qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 mb-5">
            <div className="flex justify-between text-sm text-slate-500"><span>{t('subtotal', lang)}</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm text-slate-500"><span>{t('tax', lang)}</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200"><span>{t('total', lang)}</span><span>${total.toFixed(2)}</span></div>
          </div>
          <div className={`rounded-2xl p-4 text-center ${isPaid ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
            <span className={`text-sm font-bold ${isPaid ? 'text-green-700' : 'text-amber-700'}`}>
              Status: {isPaid ? 'PAID (Stripe)' : `PENDING (${paymentMethod === 'zelle' ? 'Zelle' : 'Cash'})`}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Checkout view ───
function CheckoutView({ restaurant, cartItems, subtotal, onBack, onComplete, referralCode, onAdd, onRemove, lang, user }) {
  const lockedEmail = user?.email || ''
  const [form, setForm] = useState({ name: '', phone: '', email: lockedEmail, pickup: '', company: '' })
  const [screen, setScreen] = useState('form')
  const [processing, setProcessing] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [showStripeForm, setShowStripeForm] = useState(false)
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvc: '' })
  const [paymentMethodUsed, setPaymentMethodUsed] = useState(null)
  const [showInvoice, setShowInvoice] = useState(false)
  const [zelleAccountName, setZelleAccountName] = useState('')
  const [zelleContactInfo, setZelleContactInfo] = useState('')
  const [orderId] = useState(() => Math.floor(1000 + Math.random() * 9000))
  const [selectedRewardId, setSelectedRewardId] = useState('')
  const [promoInput, setPromoInput] = useState('')
  const [appliedPromo, setAppliedPromo] = useState('')

  const restaurantRewards = useMemo(
    () => REWARDS.filter((r) => r.restaurantId === restaurant.id),
    [restaurant.id],
  )
  const selectedReward = restaurantRewards.find((r) => r.id === selectedRewardId) || null
  const rewardNeedsRedemption = selectedReward && USER_POINTS >= selectedReward.pointsRequired && selectedReward.pointsRequired > 0

  const tax = subtotal * TAX_RATE
  const total = subtotal + tax

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setValidationError('')
  }

  const isFormValid = () => form.name.trim() && form.phone.trim() && form.email.trim() && form.pickup

  const buildPayload = (paymentMethod) => {
    const selectedHub = restaurant.dropHubs.find((h) => h.id === form.pickup)
    const payload = {
      order_id: orderId,
      restaurant_id: restaurant.id,
      restaurant_name: restaurant.name_en,
      customer: { name: form.name, phone: form.phone, email: form.email, company: form.company || null },
      drop_hub: selectedHub
        ? { id: selectedHub.id, label_en: selectedHub.label.en, city_en: selectedHub.city.en }
        : null,
      // Keep legacy pickup_location (kitchen-readable label) for backward compat with n8n.
      pickup_location: selectedHub ? selectedHub.label.en : '',
      items: cartItems.map(({ item, qty }) => ({ id: item.id, name_en: item.name_en, name_zh: item.name_zh, price: item.price, quantity: qty, line_total: item.price * qty })),
      total_amount: parseFloat(total.toFixed(2)),
      payment_method: paymentMethod,
      referral_code: referralCode,
    }
    if (paymentMethod === 'zelle') {
      payload.zelle_account_name = zelleAccountName
      payload.zelle_contact_info = zelleContactInfo
    }
    return payload
  }

  const sendWebhook = (paymentMethod) => {
    const payload = buildPayload(paymentMethod)
    // TODO: TECH TEAM - Replace this with an actual n8n Webhook POST. n8n will catch this and trigger the Zelle/Stripe email invoice.
    console.log('SENDING TO N8N WEBHOOK:', payload)
  }

  const validateForm = () => {
    if (!isFormValid()) { setValidationError(t('validationError', lang)); return false }
    return true
  }

  const handleApplePay = () => {
    if (!validateForm()) return
    setPaymentMethodUsed('stripe')
    setProcessing(true)
    setTimeout(() => { sendWebhook('stripe'); setProcessing(false); setScreen('success') }, 1500)
  }
  const handleStripe = () => { if (!validateForm()) return; setShowStripeForm((p) => !p) }
  const handleStripePay = () => {
    setPaymentMethodUsed('stripe'); setProcessing(true)
    setTimeout(() => { sendWebhook('stripe'); setProcessing(false); setScreen('success') }, 1500)
  }
  const handleZelle = () => { if (!validateForm()) return; setScreen('zelle') }
  const handleCashPickup = () => {
    if (!validateForm()) return
    setPaymentMethodUsed('cash'); setProcessing(true)
    setTimeout(() => { sendWebhook('cash'); setProcessing(false); setScreen('success') }, 1200)
  }
  const handleZelleSent = () => {
    setPaymentMethodUsed('zelle'); setProcessing(true)
    setTimeout(() => { sendWebhook('zelle'); setProcessing(false); setScreen('success') }, 1200)
  }

  // Success screen
  if (screen === 'success') {
    const isPaid = paymentMethodUsed === 'stripe'
    const selectedHub = restaurant.dropHubs.find((h) => h.id === form.pickup)
    const hubLabel = selectedHub ? (selectedHub.label[lang] || selectedHub.label.en) : form.pickup
    return (
      <div className="fixed inset-0 z-[50] bg-gradient-to-b from-slate-50 to-white flex items-center justify-center pt-14 animate-[fadeIn_200ms_ease-out]">
        <div className="text-center px-6 max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-[scaleIn_260ms_cubic-bezier(0.2,0.9,0.3,1.2)_both]">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('orderReserved', lang)}</h2>
          <p className="text-slate-500 mb-1">
            {t('invoiceEmailed', lang)} <span className="font-medium text-slate-700">{form.email}</span>.
          </p>
          <p className="text-slate-400 text-sm mb-4">{t('pickup', lang)}: {hubLabel}</p>

          {paymentMethodUsed === 'cash' && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 text-sm text-amber-800">
              {t('cashReserved', lang)}
            </div>
          )}

          {!isPaid && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 mb-6 flex items-center justify-center gap-2">
              <Sparkles size={14} className="text-amber-500" />
              <span className="text-xs font-medium text-slate-600">{t('awaitingAI', lang)}</span>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button onClick={() => setShowInvoice(true)} className="bg-white border-2 border-slate-200 hover:border-amber-400 text-slate-900 font-semibold px-8 py-3 rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer">
              <FileText size={16} className="text-amber-500" />
              {t('previewInvoice', lang)}
            </button>
            <button onClick={onComplete} className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-8 py-3 rounded-full transition-colors cursor-pointer">
              {t('backToMenu', lang)}
            </button>
          </div>
        </div>
        {showInvoice && (
          <InvoiceModal
            form={form} cartItems={cartItems} subtotal={subtotal}
            paymentMethod={paymentMethodUsed}
            restaurantName={`${restaurant.name_en} ${restaurant.name_zh}`}
            onClose={() => setShowInvoice(false)} lang={lang}
          />
        )}
      </div>
    )
  }

  // Zelle screen
  const isZelleFieldsValid = zelleAccountName.trim() && zelleContactInfo.trim()

  if (screen === 'zelle') {
    return (
      <div className="fixed inset-0 z-[50] bg-gradient-to-b from-slate-50 to-white overflow-y-auto animate-[fadeIn_180ms_ease-out]">
        <div className="max-w-lg mx-auto px-4 pt-[max(5rem,calc(3.5rem+env(safe-area-inset-top)+1rem))] pb-6">
          <button onClick={() => setScreen('form')} className="sticky top-16 z-10 self-start inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 bg-white/90 backdrop-blur-sm border border-slate-200 hover:border-amber-400 hover:text-slate-900 transition-colors mb-6 px-3.5 py-2 rounded-full shadow-sm cursor-pointer">
            <ChevronLeft size={16} />
            {t('backToCheckout', lang)}
          </button>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-2">
              <Smartphone size={14} />
              {t('zellePayment', lang)}
            </div>
            <p className="text-xs text-slate-400 mb-6">Order #{orderId}</p>
          </div>

          <div className="text-center">
            <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-3xl w-52 h-52 mx-auto flex flex-col items-center justify-center mb-6">
              <QrCode size={48} className="text-slate-400 mb-2" />
              <span className="text-xs text-slate-400 font-medium">{t('scanToPay', lang)}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/60 p-5 mb-4 shadow-sm">
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">{t('zelleAccountDetails', lang)}</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('zelleAccountName', lang)} <span className="text-red-400">*</span></label>
                <input type="text" value={zelleAccountName} onChange={(e) => setZelleAccountName(e.target.value)} placeholder="Jane Chen" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all" />
                <p className="text-xs text-slate-400 mt-1.5">{t('zelleAccountHelper', lang)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('zelleContact', lang)} <span className="text-red-400">*</span></label>
                <input type="text" value={zelleContactInfo} onChange={(e) => setZelleContactInfo(e.target.value)} placeholder="jane@email.com or (626) 555-1234" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all" />
                <p className="text-xs text-slate-400 mt-1.5">{t('zelleContactHelper', lang)}</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 mb-4">
            <p className="text-sm text-amber-900 leading-relaxed">
              {t('zelleSendExactly', lang)} <span className="font-bold text-lg">${total.toFixed(2)}</span> {t('zelleTo', lang)} <span className="font-bold">tofuking@gmail.com</span>.
            </p>
            <div className="mt-3 bg-amber-100/60 rounded-xl p-3 border border-amber-300/50">
              <p className="text-sm font-bold text-amber-900">
                {t('zelleCritical', lang)} <span className="text-amber-700 bg-amber-200 px-1.5 py-0.5 rounded-md font-mono">#{orderId}</span> {t('zelleMemoField', lang)}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 text-sm text-slate-600 text-center">
            {t('zelleNotPrepared', lang)}
          </div>

          <button onClick={handleZelleSent} disabled={processing || !isZelleFieldsValid} className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl transition-colors cursor-pointer">
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t('confirming', lang)}
              </span>
            ) : t('iHaveSent', lang)}
          </button>
          {!isZelleFieldsValid && <p className="text-xs text-slate-400 text-center mt-2">{t('zelleFieldsHelper', lang)}</p>}
        </div>
      </div>
    )
  }

  // Checkout form
  return (
    <div className="fixed inset-0 z-[50] bg-gradient-to-b from-slate-50 to-white overflow-y-auto animate-[fadeIn_180ms_ease-out]">
      <div className="max-w-lg mx-auto px-4 pt-[max(5rem,calc(3.5rem+env(safe-area-inset-top)+1rem))] pb-12">
        <button onClick={onBack} className="sticky top-16 z-10 self-start inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 bg-white/90 backdrop-blur-sm border border-slate-200 hover:border-amber-400 hover:text-slate-900 transition-colors mb-6 px-3.5 py-2 rounded-full shadow-sm cursor-pointer">
          <ChevronLeft size={16} />
          {t('backToRestaurant', lang)}
        </button>

        <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('checkout', lang)}</h2>

        <div className="bg-white rounded-3xl border border-slate-200/60 p-5 mb-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">{t('contactInfo', lang)}</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('fullName', lang)} <span className="text-red-400">*</span></label>
              <input type="text" value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="John Doe" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('phoneNumber', lang)} <span className="text-red-400">*</span></label>
              <input type="tel" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="(626) 555-1234" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('emailAddress', lang)} <span className="text-red-400">*</span></label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="john@email.com"
                readOnly={!!lockedEmail}
                className={`w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all ${lockedEmail ? 'bg-slate-100 text-slate-500 cursor-not-allowed opacity-70' : ''}`}
              />
              <p className="text-xs text-slate-400 mt-1.5">
                {lockedEmail ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Lock size={11} className="text-slate-400" />
                    {t('emailLocked', lang)}
                  </span>
                ) : (
                  t('emailHelper', lang)
                )}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('companyName', lang)}</label>
              <input type="text" value={form.company} onChange={(e) => updateField('company', e.target.value)} placeholder={t('companyPlaceholder', lang)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/60 p-5 mb-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">{t('selectDropHub', lang)} <span className="text-red-400">*</span></h3>
          <select value={form.pickup} onChange={(e) => updateField('pickup', e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all appearance-none cursor-pointer">
            <option value="">{t('selectHubPlaceholder', lang)}</option>
            {restaurant.dropHubs.map((h) => (
              <option key={h.id} value={h.id}>{h.label[lang] || h.label.en}</option>
            ))}
          </select>
        </div>

        {/* Apply Rewards */}
        <div className="bg-gradient-to-br from-amber-50 via-white to-white rounded-3xl border border-amber-200/70 p-5 mb-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-amber-500" />
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">{t('applyRewards', lang)}</h3>
            </div>
            <span className="inline-flex items-center gap-1.5 bg-amber-500/15 border border-amber-400/40 text-amber-800 text-xs font-bold px-3 py-1 rounded-full tabular-nums">
              <Sparkles size={11} className="text-amber-600" />
              {USER_POINTS.toLocaleString()} {t('points', lang)}
            </span>
          </div>
          {restaurantRewards.length === 0 ? (
            <p className="text-xs text-slate-500 italic">{t('noRewardsForDrop', lang)}</p>
          ) : (
            <>
              <select
                value={selectedRewardId}
                onChange={(e) => setSelectedRewardId(e.target.value)}
                className="w-full border border-amber-300/70 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all appearance-none cursor-pointer"
              >
                <option value="">{t('selectRewardPlaceholder', lang)}</option>
                {restaurantRewards.map((r) => {
                  const label = lang === 'zh' ? r.title_zh : r.title_en
                  const affordable = USER_POINTS >= r.pointsRequired
                  const suffix = r.pointsRequired === 0
                    ? ` — ${t('rewardUnlocked', lang)}`
                    : affordable
                      ? ` — ${t('rewardRedeemCost', lang).replace('{points}', r.pointsRequired)}`
                      : ` — ${t('rewardNeedMore', lang).replace('{points}', r.pointsRequired - USER_POINTS)}`
                  return (
                    <option key={r.id} value={r.id} disabled={!affordable}>
                      {r.emoji} {label}{suffix}
                    </option>
                  )
                })}
              </select>
              {rewardNeedsRedemption && (
                <p className="text-xs text-amber-700 mt-2 font-medium">
                  {t('rewardDeductionNote', lang).replace('{points}', selectedReward.pointsRequired)}
                </p>
              )}
              {selectedReward && selectedReward.pointsRequired === 0 && (
                <p className="text-xs text-emerald-700 mt-2 font-medium">
                  {t('rewardAlreadyUnlocked', lang)}
                </p>
              )}
            </>
          )}
        </div>

        {/* Promo Code */}
        <div className="bg-white rounded-3xl border border-slate-200/60 p-5 mb-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">{t('promoCode', lang)}</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              placeholder={t('promoPlaceholder', lang)}
              className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all uppercase tracking-wide"
            />
            <button
              onClick={() => {
                if (promoInput.trim()) setAppliedPromo(promoInput.trim().toUpperCase())
              }}
              disabled={!promoInput.trim()}
              className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold text-sm px-5 rounded-xl transition-colors cursor-pointer"
            >
              {t('apply', lang)}
            </button>
          </div>
          {appliedPromo && (
            <div className="mt-3 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5 flex items-center gap-2 animate-[fadeIn_220ms_ease-out]">
              <CheckCircle size={14} className="text-green-600 shrink-0" />
              <p className="text-xs font-semibold text-green-700">
                {t('promoApplied', lang)}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/60 p-5 mb-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">{t('orderSummary', lang)}</h3>
          <div className="divide-y divide-slate-100">
            {cartItems.map(({ item, qty }) => (
              <div key={item.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="flex-1 min-w-0 mr-3">
                  <p className="text-sm font-medium text-slate-900">{itemName(item, lang)}</p>
                  <p className="text-xs text-slate-400">{itemSub(item, lang)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-slate-100 rounded-full px-1 py-1">
                    <button onClick={() => onRemove(item.id)} className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"><Minus size={12} className="text-slate-700" /></button>
                    <span className="text-xs font-semibold text-slate-900 w-4 text-center tabular-nums">{qty}</span>
                    <button onClick={() => onAdd(item.id)} className="w-7 h-7 rounded-full bg-amber-500 shadow-sm flex items-center justify-center hover:bg-amber-600 transition-colors cursor-pointer"><Plus size={12} className="text-white" /></button>
                  </div>
                  <span className="text-sm font-semibold text-slate-900 w-16 text-right tabular-nums">${(item.price * qty).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-slate-500"><span>{t('subtotal', lang)}</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm text-slate-500"><span>{t('tax', lang)}</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-100"><span>{t('total', lang)}</span><span>${total.toFixed(2)}</span></div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/60 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">{t('selectPayment', lang)}</h3>
          {validationError && <div className="bg-red-50 border border-red-200 rounded-2xl p-3 mb-4 text-sm text-red-700 font-medium">{validationError}</div>}
          <div className="space-y-3">
            <button onClick={handleApplePay} disabled={processing} className="w-full bg-black hover:bg-gray-900 disabled:bg-gray-400 text-white font-semibold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2 cursor-pointer">
              {processing && paymentMethodUsed === 'stripe' && !showStripeForm ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t('processing', lang)}</span>
              ) : (
                <><svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" /></svg><span>{t('pay', lang)}</span></>
              )}
            </button>

            <button onClick={handleStripe} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2.5 cursor-pointer">
              <CreditCard size={18} />{t('payWithCard', lang)}
            </button>

            {showStripeForm && (
              <div className="bg-slate-50 rounded-3xl border border-slate-200 p-5 space-y-3 animate-[slideUp_200ms_ease-out]">
                <div className="flex items-center gap-2 mb-1"><Lock size={14} className="text-slate-400" /><span className="text-xs font-medium text-slate-500">{t('securePayment', lang)}</span></div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{t('cardNumber', lang)}</label>
                  <input type="text" value={cardForm.number} onChange={(e) => setCardForm((p) => ({ ...p, number: e.target.value }))} placeholder="4242 4242 4242 4242" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">MM/YY</label>
                    <input type="text" value={cardForm.expiry} onChange={(e) => setCardForm((p) => ({ ...p, expiry: e.target.value }))} placeholder="12/28" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">CVC</label>
                    <input type="text" value={cardForm.cvc} onChange={(e) => setCardForm((p) => ({ ...p, cvc: e.target.value }))} placeholder="123" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all" />
                  </div>
                </div>
                <button onClick={handleStripePay} disabled={processing} className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2.5 cursor-pointer mt-2">
                  {processing ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t('processing', lang)}</span> : <><Lock size={16} />{t('pay', lang)} ${total.toFixed(2)}</>}
                </button>
              </div>
            )}

            <button onClick={handleCashPickup} disabled={processing} className="w-full bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300 text-slate-900 font-semibold py-4 rounded-2xl transition-all flex items-center justify-center gap-2.5 cursor-pointer">
              <Banknote size={18} className="text-slate-500" />{t('payAtPickup', lang)}
            </button>

            <button onClick={handleZelle} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2.5 cursor-pointer">
              <Smartphone size={18} />{t('payWithZelle', lang)}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main page ───
export default function RestaurantDrop() {
  const { id } = useParams()
  const navigate = useNavigate()
  const restaurant = getRestaurant(id)

  const {
    user, lang, carts, addItem, removeItem, clearCart,
    requireAuth, isCartOpen, setIsCartOpen,
  } = useApp()

  const quantities = useMemo(() => (restaurant ? carts[restaurant.id] || {} : {}), [carts, restaurant])

  const [activeCategory, setActiveCategory] = useState(() => restaurant?.categories[0])
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [referralCode, setReferralCode] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    if (ref) setReferralCode(ref)
  }, [])

  // If the restaurant id is invalid, bounce back to portal.
  if (!restaurant) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-slate-50 flex items-center justify-center p-6 text-center">
        <div>
          <p className="text-slate-500 mb-4">We couldn't find that drop.</p>
          <button onClick={() => navigate('/')} className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-full transition-colors cursor-pointer">
            Back to Portal
          </button>
        </div>
      </div>
    )
  }

  const filteredItems = restaurant.menu.filter((item) => item.category === activeCategory)
  const totalItems = Object.values(quantities).reduce((sum, q) => sum + q, 0)
  const totalPrice = Object.entries(quantities).reduce((sum, [itemId, qty]) => {
    const item = restaurant.menu.find((i) => i.id === Number(itemId))
    return sum + (item ? item.price * qty : 0)
  }, 0)

  const cartItems = Object.entries(quantities).map(([itemId, qty]) => ({
    item: restaurant.menu.find((i) => i.id === Number(itemId)),
    qty,
  })).filter((c) => c.item)

  const suggestionItem = restaurant.menu.find((i) => i.id === restaurant.suggestionItemId)
  const hasSuggestion = suggestionItem ? (quantities[suggestionItem.id] || 0) > 0 : true

  // ─── Auth-gated add ───
  const handleAdd = (itemId) => {
    requireAuth(() => addItem(restaurant.id, itemId))
  }
  const handleRemove = (itemId) => removeItem(restaurant.id, itemId)

  const handleProceedToCheckout = () => {
    requireAuth(() => {
      setIsCartOpen(false)
      setIsCheckoutOpen(true)
    })
  }

  const handleComplete = () => {
    setIsCheckoutOpen(false)
    clearCart(restaurant.id)
  }

  const perk = [
    'You earned a ', 'Free Chicken Cutlet (Dine-In)', ' & ', 'Side Kimchi (泡菜)',
    '. Rewards will be added to your FoodservAI Wallet after checkout.',
  ]
  const perkZh = [
    '您獲得了', '免費雞排（內用）', '和', '泡菜小菜',
    '。獎勵將在結帳後加入您的 FoodservAI 錢包。',
  ]
  const activePerk = lang === 'zh' ? perkZh : perk

  const title = lang === 'zh' ? restaurant.name_zh : restaurant.name_en
  const subtitle = lang === 'zh' ? restaurant.name_en : restaurant.name_zh

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-slate-50">
      {/* Hero */}
      <section className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-amber-400 transition-colors mb-4">
            <ArrowLeft size={14} />
            All Drops
          </Link>
          <div className={`bg-gradient-to-br ${restaurant.coverGradient} rounded-3xl p-6 md:p-8 border border-slate-700/50`}>
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">
              {t('communityGroupOrder', lang)}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              {title} {subtitle && <span className="text-slate-400 font-normal">{subtitle}</span>}
            </h2>
            <p className="text-slate-400 mt-2 text-sm md:text-base max-w-lg">
              {restaurant.tagline[lang] || restaurant.tagline.en}
            </p>
            <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-amber-500/70" />
                {restaurant.dropHubs.map((h) => h.city[lang] || h.city.en).join(', ')}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-amber-500/70" />
                {t('orderByThu', lang)}
              </span>
            </div>

            {/* FOMO Engine: countdown + community goal */}
            <div className="mt-5 flex flex-col gap-3">
              <div className="inline-flex items-center self-start gap-2 bg-slate-950/60 backdrop-blur-md border border-amber-400/30 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full">
                <span className="opacity-80">{t('dropClosesInLabel', lang)}:</span>
                <Countdown target={restaurant.dropCloseAt} lang={lang} className="font-bold" />
              </div>

              {restaurant.communityGoal && (() => {
                const { current, target: goal, reward, minimumSpend } = restaurant.communityGoal
                const pct = Math.min(100, Math.round((current / goal) * 100))
                const reached = current >= goal
                const rewardText = reward[lang] || reward.en
                const remaining = goal - current
                return (
                  <div className="bg-slate-950/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-400/90">
                        {t('communityGoal', lang)}
                      </span>
                      <span className="text-xs font-bold text-white tabular-nums">
                        ${current} / ${goal}
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-[width] duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                      {reached ? (
                        <span className="text-amber-300 font-semibold">{t('goalReached', lang)}</span>
                      ) : (
                        <>
                          {t('minSpendOnlyMore', lang).replace('{amount}', `$${remaining}`)}{' '}
                          <span className="font-semibold text-white">{rewardText}</span>!
                        </>
                      )}
                    </p>
                    {minimumSpend != null && (
                      <p className="text-[11px] text-slate-500 italic mt-1.5 leading-relaxed">
                        {t('minSpendNote', lang).replace('{amount}', `$${minimumSpend}`)}
                      </p>
                    )}
                    <p className="text-[10px] text-slate-500 mt-2 leading-relaxed border-t border-slate-800 pt-2">
                      {t('gmDashboardNote', lang)}
                    </p>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* Referral */}
      {referralCode && (
        <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 border-b border-emerald-200 animate-[slideUp_260ms_ease-out]">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-lg">🎁</span>
              <div>
                <p className="text-sm font-bold text-emerald-900">{t('perkUnlocked', lang)}</p>
                <p className="text-sm text-emerald-700 mt-0.5 leading-relaxed">
                  {activePerk[0]}<span className="font-semibold">{activePerk[1]}</span>{activePerk[2]}<span className="font-semibold">{activePerk[3]}</span>{activePerk[4]}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="bg-white sticky top-14 z-40 border-b border-slate-200/60 shadow-sm">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex gap-1 py-2 overflow-x-auto">
            {restaurant.categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === cat ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu grid */}
      <main className="max-w-3xl mx-auto px-4 py-6 pb-28">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              quantity={quantities[item.id] || 0}
              onAdd={() => handleAdd(item.id)}
              onRemove={() => handleRemove(item.id)}
              lang={lang}
            />
          ))}
        </div>
      </main>

      {/* Floating cart CTA */}
      {totalItems > 0 && !isCheckoutOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-[slideUp_260ms_ease-out]">
          <div className="max-w-3xl mx-auto">
            <button onClick={handleProceedToCheckout} className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-2xl px-6 py-4 flex items-center justify-between shadow-lg shadow-amber-500/30 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="bg-white/20 text-sm font-bold rounded-full w-7 h-7 flex items-center justify-center tabular-nums">{totalItems}</span>
                <span className="font-semibold">{t('proceedToCheckout', lang)}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-lg tabular-nums">${totalPrice.toFixed(2)}</span>
                <ChevronRight size={18} className="opacity-60" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Cart drawer */}
      {isCartOpen && (
        <>
          <div className="fixed inset-0 z-[70] bg-black/30 backdrop-blur-sm animate-[fadeIn_180ms_ease-out]" onClick={() => setIsCartOpen(false)} />
          <div className="fixed top-0 right-0 bottom-0 z-[80] w-full max-w-sm bg-white shadow-2xl flex flex-col animate-[slideUp_260ms_ease-out]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">{t('yourCart', lang)}</h3>
              <button onClick={() => setIsCartOpen(false)} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer">
                <X size={18} className="text-slate-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart size={40} className="text-slate-200 mx-auto mb-3" />
                  <p className="text-sm text-slate-400">{t('cartEmpty', lang)}</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {cartItems.map(({ item, qty }) => (
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900">{itemName(item, lang)}</p>
                          <p className="text-xs text-slate-400">{itemSub(item, lang)}</p>
                          <p className="text-sm font-semibold text-slate-900 mt-1 tabular-nums">${(item.price * qty).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-100 rounded-full px-1 py-1">
                          <button onClick={() => handleRemove(item.id)} className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"><Minus size={12} className="text-slate-700" /></button>
                          <span className="text-xs font-semibold text-slate-900 w-4 text-center tabular-nums">{qty}</span>
                          <button onClick={() => handleAdd(item.id)} className="w-7 h-7 rounded-full bg-amber-500 shadow-sm flex items-center justify-center hover:bg-amber-600 transition-colors cursor-pointer"><Plus size={12} className="text-white" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {cartItems.length > 0 && suggestionItem && !hasSuggestion && (
                <div className="mt-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl border border-amber-200/60 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={14} className="text-amber-500" />
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">{t('aiSuggestionLabel', lang)}</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {lang === 'en'
                      ? <>You have {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart. Customers usually add <span className="font-semibold">'{suggestionItem.name_en}'</span> to this order. Add for <span className="font-bold">${suggestionItem.price.toFixed(2)}</span>?</>
                      : <>您的購物車有 {totalItems} 件商品。大多數顧客會加購<span className="font-semibold">「{suggestionItem.name_zh || suggestionItem.name_en}」</span>。只需 <span className="font-bold">${suggestionItem.price.toFixed(2)}</span>！</>
                    }
                  </p>
                  <button onClick={() => handleAdd(suggestionItem.id)} className="mt-3 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors cursor-pointer flex items-center gap-1.5">
                    <Plus size={14} />
                    {t('addToCart', lang)}
                  </button>
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-slate-100 px-5 py-4">
                {restaurant.communityGoal && (() => {
                  const { current, target: goal } = restaurant.communityGoal
                  const remaining = Math.max(0, goal - current)
                  const reached = remaining === 0
                  const nudge = reached
                    ? t('cartNudgeReached', lang)
                    : t('cartNudge', lang).replace('{amount}', `$${remaining}`)
                  return (
                    <div className="mb-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/70 rounded-2xl px-4 py-3 flex items-center gap-2">
                      <Sparkles size={14} className="text-amber-500 shrink-0" />
                      <p className="text-xs font-medium text-amber-900 leading-snug">{nudge}</p>
                    </div>
                  )
                })()}
                <div className="flex justify-between text-base font-bold text-slate-900 mb-4">
                  <span>{t('subtotal', lang)}</span>
                  <span className="tabular-nums">${totalPrice.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {t('proceedToCheckout', lang)}
                  <ChevronRight size={18} className="opacity-60" />
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Checkout */}
      {isCheckoutOpen && (
        <CheckoutView
          restaurant={restaurant}
          cartItems={cartItems}
          subtotal={totalPrice}
          onBack={() => setIsCheckoutOpen(false)}
          onComplete={handleComplete}
          referralCode={referralCode}
          onAdd={(id) => addItem(restaurant.id, id)}
          onRemove={handleRemove}
          lang={lang}
          user={user}
        />
      )}
    </div>
  )
}
