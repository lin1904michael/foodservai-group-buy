import { useState, useEffect } from 'react'
import { ShoppingCart, Plus, Minus, ChevronRight, ChevronLeft, MapPin, Clock, CreditCard, Smartphone, CheckCircle, QrCode, X, Lock, Sparkles, FileText, Banknote, Globe } from 'lucide-react'

// ─── Translation Dictionary ───
const T = {
  cart: { en: 'Cart', zh: '購物車' },
  add: { en: 'Add', zh: '加入' },
  hotSeller: { en: '🔥 Hot Seller', zh: '🔥 熱銷' },
  communityGroupOrder: { en: 'Community Group Order', zh: '社區團購' },
  heroDesc: { en: 'Pre-order now for weekend pickups across SoCal.', zh: '立即預訂，週末於南加州各取貨點取貨。' },
  orderByThu: { en: 'Order by Thu 9PM', zh: '週四晚9點前下單' },
  perkUnlocked: { en: '✨ Group Leader Perk Unlocked!', zh: '✨ 團長福利已解鎖！' },
  perkDesc: {
    en: ['You earned a ', 'Free Chicken Cutlet (Dine-In)', ' & ', 'Side Kimchi (泡菜)', '. Rewards will be added to your FoodservAI Wallet after checkout.'],
    zh: ['您獲得了', '免費雞排（內用）', '和', '泡菜小菜', '。獎勵將在結帳後加入您的 FoodservAI 錢包。'],
  },
  proceedToCheckout: { en: 'Proceed to Checkout', zh: '前往結帳' },
  yourCart: { en: 'Your Cart', zh: '您的購物車' },
  cartEmpty: { en: 'Your cart is empty', zh: '購物車是空的' },
  subtotal: { en: 'Subtotal', zh: '小計' },
  tax: { en: 'Tax (9%)', zh: '稅金 (9%)' },
  total: { en: 'Total', zh: '總計' },
  aiSuggestionLabel: { en: 'FoodservAI Suggestion', zh: 'FoodservAI 推薦' },
  addToCart: { en: 'Add to Cart', zh: '加入購物車' },
  backToMenu: { en: 'Back to Menu', zh: '返回菜單' },
  backToCheckout: { en: 'Back to Checkout', zh: '返回結帳' },
  checkout: { en: 'Checkout', zh: '結帳' },
  contactInfo: { en: 'Contact Info', zh: '聯絡資訊' },
  fullName: { en: 'Full Name', zh: '姓名' },
  phoneNumber: { en: 'Phone Number', zh: '電話號碼' },
  emailAddress: { en: 'Email Address', zh: '電子信箱' },
  emailHelper: { en: 'Required to receive your invoice', zh: '用於接收您的發票' },
  companyName: { en: 'Company Name', zh: '公司名稱' },
  companyPlaceholder: { en: 'Company Name (Optional)', zh: '公司名稱（選填）' },
  pickupLocation: { en: 'Pickup Location', zh: '取貨地點' },
  selectPickup: { en: 'Select Pickup Location...', zh: '選擇取貨地點...' },
  orderSummary: { en: 'Order Summary', zh: '訂單摘要' },
  selectPayment: { en: 'Select Payment Method', zh: '選擇付款方式' },
  payWithCard: { en: 'Pay with Card', zh: '信用卡付款' },
  securePayment: { en: 'Secure card payment', zh: '安全卡片付款' },
  cardNumber: { en: 'Card Number', zh: '卡號' },
  payAtPickup: { en: 'Pay at Pickup (現金)', zh: '取貨時付現金' },
  payWithZelle: { en: 'Pay with Zelle', zh: 'Zelle 付款' },
  processing: { en: 'Processing...', zh: '處理中...' },
  confirming: { en: 'Confirming...', zh: '確認中...' },
  validationError: { en: 'Please complete all contact and location details to receive your invoice.', zh: '請填寫所有聯絡資訊及取貨地點以接收發票。' },
  zellePayment: { en: 'Zelle Payment', zh: 'Zelle 付款' },
  zelleAccountDetails: { en: 'Zelle Account Details', zh: 'Zelle 帳戶資訊' },
  zelleAccountName: { en: 'Zelle Account Name (First & Last)', zh: 'Zelle 帳戶姓名（名和姓）' },
  zelleAccountHelper: { en: "Please enter the exact name registered to your bank's Zelle account.", zh: '請輸入您銀行 Zelle 帳戶登記的確切姓名。' },
  zelleContact: { en: 'Zelle Phone Number or Email', zh: 'Zelle 電話號碼或電子信箱' },
  zelleContactHelper: { en: 'The contact method attached to your Zelle account.', zh: '與您的 Zelle 帳戶綁定的聯絡方式。' },
  zelleSendExactly: { en: 'Please send exactly', zh: '請準確轉帳' },
  zelleTo: { en: 'to', zh: '至' },
  zelleCritical: { en: 'CRITICAL: You MUST include your Order ID', zh: '重要：您必須在 Zelle 備註欄中填入您的訂單編號' },
  zelleMemoField: { en: 'in the Zelle Memo/Notes field to verify your payment.', zh: '以便我們核實您的付款。' },
  zelleNotPrepared: { en: 'Your order will not be prepared until payment is received.', zh: '在收到付款之前，我們不會開始準備您的訂單。' },
  iHaveSent: { en: 'I Have Sent the Payment', zh: '我已完成轉帳' },
  zelleFieldsHelper: { en: 'Fill in your Zelle account details above to continue.', zh: '請先填寫上方的 Zelle 帳戶資訊。' },
  orderReserved: { en: 'Order Reserved!', zh: '訂單已保留！' },
  invoiceEmailed: { en: 'Your invoice has been emailed to', zh: '發票已寄送至' },
  pickup: { en: 'Pickup', zh: '取貨' },
  cashReserved: { en: 'Order Reserved! Please have cash ready at pickup. Our AI-Powered Invoice Engine will email your receipt once payment is received by the staff.', zh: '訂單已保留！請在取貨時準備現金。我們的 AI 發票引擎將在工作人員收到款項後，將收據寄送至您的信箱。' },
  awaitingAI: { en: 'Status: Awaiting AI Verification of Payment', zh: '狀態：等待 AI 付款驗證' },
  previewInvoice: { en: 'Preview My Invoice', zh: '預覽發票' },
  invoicePreview: { en: 'Invoice Preview', zh: '發票預覽' },
  billTo: { en: 'Bill To', zh: '帳單對象' },
  item: { en: 'Item', zh: '品項' },
  qty: { en: 'Qty', zh: '數量' },
  amount: { en: 'Amount', zh: '金額' },
  scanToPay: { en: 'Scan to Pay', zh: '掃碼付款' },
  pay: { en: 'Pay', zh: '付款' },
}

const t = (key, lang) => T[key]?.[lang] || T[key]?.en || key

// Helper for item name with fallback
const itemName = (item, lang) => lang === 'zh' ? (item.name_zh || item.name_en) : item.name_en
const itemSub = (item, lang) => lang === 'zh' ? item.name_en : item.name_zh

const MENU_ITEMS = [
  { id: 1, name_en: 'Spicy Beef Tendon', name_zh: '香辣牛筋', price: 14.99, category: 'Hot Deli (熟食)', image_placeholder_color: 'bg-orange-100', is_hot_seller: true },
  { id: 2, name_en: 'Braised Pork Belly', name_zh: '紅燒五花肉', price: 16.99, category: 'Hot Deli (熟食)', image_placeholder_color: 'bg-amber-100', is_hot_seller: false },
  { id: 3, name_en: 'Signature Chili Oil', name_zh: '招牌辣油', price: 8.99, category: 'Hot Deli (熟食)', image_placeholder_color: 'bg-red-100', is_hot_seller: true },
  { id: 4, name_en: 'Sesame Noodles', name_zh: '麻醬麵', price: 10.99, category: 'Hot Deli (熟食)', image_placeholder_color: 'bg-yellow-100', is_hot_seller: false },
  { id: 5, name_en: 'Scallion Pancakes (5pc)', name_zh: '蔥油餅 (5片)', price: 9.49, category: 'Hot Deli (熟食)', image_placeholder_color: 'bg-lime-100', is_hot_seller: false },
  { id: 6, name_en: 'Pork & Chive Dumplings (30pc)', name_zh: '豬肉韭菜水餃 (30顆)', price: 13.99, category: 'Frozen Signatures (冷凍食品)', image_placeholder_color: 'bg-sky-100', is_hot_seller: true },
  { id: 7, name_en: 'Xiao Long Bao (20pc)', name_zh: '小籠包 (20顆)', price: 15.99, category: 'Frozen Signatures (冷凍食品)', image_placeholder_color: 'bg-blue-100', is_hot_seller: true },
  { id: 8, name_en: 'Sticky Rice in Lotus Leaf', name_zh: '荷葉糯米雞', price: 11.99, category: 'Frozen Signatures (冷凍食品)', image_placeholder_color: 'bg-emerald-100', is_hot_seller: false },
  { id: 9, name_en: 'Taro Buns (6pc)', name_zh: '芋頭包 (6個)', price: 9.99, category: 'Frozen Signatures (冷凍食品)', image_placeholder_color: 'bg-purple-100', is_hot_seller: false },
  { id: 10, name_en: 'Frozen Beef Rolls (10pc)', name_zh: '牛肉捲餅 (10片)', price: 18.99, category: 'Frozen Signatures (冷凍食品)', image_placeholder_color: 'bg-rose-100', is_hot_seller: false },
]

const CATEGORIES = ['Hot Deli (熟食)', 'Frozen Signatures (冷凍食品)']

const PICKUP_LOCATIONS = [
  'Irvine - Saturday 12:00 PM',
  'Arcadia - Sunday 2:00 PM',
  'Chino Hills - Sunday 5:00 PM',
]

const TAX_RATE = 0.09
const SUGGESTION_ITEM = MENU_ITEMS.find((i) => i.id === 3)

function ItemCard({ item, quantity, onAdd, onRemove, lang }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
      <div className={`relative ${item.image_placeholder_color} h-44 flex items-center justify-center`}>
        <span className="text-5xl opacity-60">
          {item.category.includes('Hot') ? '🍲' : '🧊'}
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
            <button onClick={onAdd} className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors cursor-pointer">
              {t('add', lang)}
            </button>
          ) : (
            <div className="flex items-center gap-3 bg-slate-100 rounded-full px-1 py-1">
              <button onClick={onRemove} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer">
                <Minus size={14} className="text-slate-700" />
              </button>
              <span className="text-sm font-semibold text-slate-900 w-5 text-center">{quantity}</span>
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

function InvoiceModal({ form, cartItems, subtotal, paymentMethod, onClose, lang }) {
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax
  const isPaid = paymentMethod === 'stripe'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto">
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
            <h3 className="text-xl font-bold text-slate-900">Tofu King 豆腐王</h3>
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

function CheckoutView({ cartItems, subtotal, onBack, onComplete, referralCode, onAdd, onRemove, lang }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', pickup: '', company: '' })
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

  const tax = subtotal * TAX_RATE
  const total = subtotal + tax

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setValidationError('')
  }

  const isFormValid = () => form.name.trim() && form.phone.trim() && form.email.trim() && form.pickup

  const buildPayload = (paymentMethod) => {
    const payload = {
      order_id: orderId,
      customer: { name: form.name, phone: form.phone, email: form.email, company: form.company || null },
      pickup_location: form.pickup,
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
    console.log("SENDING TO N8N WEBHOOK:", payload)
  }

  const validateForm = () => {
    if (!isFormValid()) {
      setValidationError(t('validationError', lang))
      return false
    }
    return true
  }

  const handleApplePay = () => {
    if (!validateForm()) return
    setPaymentMethodUsed('stripe')
    setProcessing(true)
    setTimeout(() => { sendWebhook('stripe'); setProcessing(false); setScreen('success') }, 1500)
  }

  const handleStripe = () => {
    if (!validateForm()) return
    setShowStripeForm((prev) => !prev)
  }

  const handleStripePay = () => {
    setPaymentMethodUsed('stripe')
    setProcessing(true)
    setTimeout(() => { sendWebhook('stripe'); setProcessing(false); setScreen('success') }, 1500)
  }

  const handleZelle = () => {
    if (!validateForm()) return
    setScreen('zelle')
  }

  const handleCashPickup = () => {
    if (!validateForm()) return
    setPaymentMethodUsed('cash')
    setProcessing(true)
    setTimeout(() => { sendWebhook('cash'); setProcessing(false); setScreen('success') }, 1200)
  }

  const handleZelleSent = () => {
    setPaymentMethodUsed('zelle')
    setProcessing(true)
    setTimeout(() => { sendWebhook('zelle'); setProcessing(false); setScreen('success') }, 1200)
  }

  // ─── Success Screen ───
  if (screen === 'success') {
    const isPaid = paymentMethodUsed === 'stripe'
    return (
      <div className="fixed inset-0 z-[60] bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center px-6 max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('orderReserved', lang)}</h2>
          <p className="text-slate-500 mb-1">
            {t('invoiceEmailed', lang)} <span className="font-medium text-slate-700">{form.email}</span>.
          </p>
          <p className="text-slate-400 text-sm mb-4">{t('pickup', lang)}: {form.pickup}</p>

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
        {showInvoice && <InvoiceModal form={form} cartItems={cartItems} subtotal={subtotal} paymentMethod={paymentMethodUsed} onClose={() => setShowInvoice(false)} lang={lang} />}
      </div>
    )
  }

  // ─── Zelle Screen ───
  const isZelleFieldsValid = zelleAccountName.trim() && zelleContactInfo.trim()

  if (screen === 'zelle') {
    return (
      <div className="fixed inset-0 z-[60] bg-gradient-to-b from-slate-50 to-white overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-6">
          <button onClick={() => setScreen('form')} className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6 cursor-pointer">
            <ChevronLeft size={18} />
            {t('backToCheckout', lang)}
          </button>

          <div>
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
      </div>
    )
  }

  // ─── Checkout Form ───
  return (
    <div className="fixed inset-0 z-[60] bg-gradient-to-b from-slate-50 to-white overflow-y-auto">
      <div className="max-w-lg mx-auto px-4 py-6 pb-12">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6 cursor-pointer">
          <ChevronLeft size={18} />
          {t('backToMenu', lang)}
        </button>

        <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('checkout', lang)}</h2>

        {/* Contact Info */}
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
              <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} placeholder="john@email.com" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all" />
              <p className="text-xs text-slate-400 mt-1.5">{t('emailHelper', lang)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('companyName', lang)}</label>
              <input type="text" value={form.company} onChange={(e) => updateField('company', e.target.value)} placeholder={t('companyPlaceholder', lang)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all" />
            </div>
          </div>
        </div>

        {/* Pickup Location */}
        <div className="bg-white rounded-3xl border border-slate-200/60 p-5 mb-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">{t('pickupLocation', lang)} <span className="text-red-400">*</span></h3>
          <select value={form.pickup} onChange={(e) => updateField('pickup', e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all appearance-none cursor-pointer">
            <option value="">{t('selectPickup', lang)}</option>
            {PICKUP_LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
          </select>
        </div>

        {/* Order Summary */}
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
                    <span className="text-xs font-semibold text-slate-900 w-4 text-center">{qty}</span>
                    <button onClick={() => onAdd(item.id)} className="w-7 h-7 rounded-full bg-amber-500 shadow-sm flex items-center justify-center hover:bg-amber-600 transition-colors cursor-pointer"><Plus size={12} className="text-white" /></button>
                  </div>
                  <span className="text-sm font-semibold text-slate-900 w-16 text-right">${(item.price * qty).toFixed(2)}</span>
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

        {/* Payment Methods */}
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
              <div className="bg-slate-50 rounded-3xl border border-slate-200 p-5 space-y-3">
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

export default function App() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0])
  const [quantities, setQuantities] = useState({})
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [referralCode, setReferralCode] = useState(null)
  const [lang, setLang] = useState('en')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    if (ref) setReferralCode(ref)
  }, [])

  const filteredItems = MENU_ITEMS.filter((item) => item.category === activeCategory)

  const addItem = (id) => setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }))

  const removeItem = (id) => {
    setQuantities((prev) => {
      const next = { ...prev }
      if (next[id] > 1) next[id] -= 1
      else delete next[id]
      return next
    })
  }

  const totalItems = Object.values(quantities).reduce((sum, q) => sum + q, 0)
  const totalPrice = Object.entries(quantities).reduce((sum, [id, qty]) => {
    const item = MENU_ITEMS.find((i) => i.id === Number(id))
    return sum + (item ? item.price * qty : 0)
  }, 0)

  const cartItems = Object.entries(quantities).map(([id, qty]) => ({
    item: MENU_ITEMS.find((i) => i.id === Number(id)),
    qty,
  }))

  const hasChiliOil = quantities[SUGGESTION_ITEM.id] > 0

  const handleComplete = () => {
    setIsCheckoutOpen(false)
    setQuantities({})
  }

  const perk = T.perkDesc[lang]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 sticky top-0 z-50 shadow-lg shadow-slate-900/10">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <span className="text-amber-400">✦</span>
            FoodservAI
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang((l) => l === 'en' ? 'zh' : 'en')}
              className="flex items-center gap-1.5 text-xs font-medium text-amber-400/90 hover:text-amber-300 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-full transition-all cursor-pointer border border-slate-700/50"
            >
              <Globe size={13} />
              {lang === 'en' ? '中文' : 'EN'}
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer relative"
            >
              <ShoppingCart size={20} />
              <span>{t('cart', lang)} ({totalItems})</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 md:p-8 border border-slate-700/50">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">
              {t('communityGroupOrder', lang)}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              Tofu King 豆腐王
            </h2>
            <p className="text-slate-400 mt-2 text-sm md:text-base max-w-lg">
              {t('heroDesc', lang)}
            </p>
            <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-amber-500/70" />
                Rowland Heights, Irvine, Arcadia
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-amber-500/70" />
                {t('orderByThu', lang)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Referral Banner */}
      {referralCode && (
        <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 border-b border-emerald-200">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-lg">🎁</span>
              <div>
                <p className="text-sm font-bold text-emerald-900">{t('perkUnlocked', lang)}</p>
                <p className="text-sm text-emerald-700 mt-0.5 leading-relaxed">
                  {perk[0]}<span className="font-semibold">{perk[1]}</span>{perk[2]}<span className="font-semibold">{perk[3]}</span>{perk[4]}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="bg-white sticky top-14 z-40 border-b border-slate-200/60 shadow-sm">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex gap-1 py-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  activeCategory === cat ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <main className="max-w-3xl mx-auto px-4 py-6 pb-28">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} quantity={quantities[item.id] || 0} onAdd={() => addItem(item.id)} onRemove={() => removeItem(item.id)} lang={lang} />
          ))}
        </div>
      </main>

      {/* Floating Cart Summary */}
      {totalItems > 0 && !isCheckoutOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
          <div className="max-w-3xl mx-auto">
            <button onClick={() => setIsCheckoutOpen(true)} className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-2xl px-6 py-4 flex items-center justify-between shadow-lg shadow-amber-500/30 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="bg-white/20 text-sm font-bold rounded-full w-7 h-7 flex items-center justify-center">{totalItems}</span>
                <span className="font-semibold">{t('proceedToCheckout', lang)}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-lg">${totalPrice.toFixed(2)}</span>
                <ChevronRight size={18} className="opacity-60" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Mini-Cart Sidebar */}
      {isCartOpen && (
        <>
          <div className="fixed inset-0 z-[70] bg-black/30 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="fixed top-0 right-0 bottom-0 z-[80] w-full max-w-sm bg-white shadow-2xl flex flex-col">
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
                          <p className="text-sm font-semibold text-slate-900 mt-1">${(item.price * qty).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-100 rounded-full px-1 py-1">
                          <button onClick={() => removeItem(item.id)} className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"><Minus size={12} className="text-slate-700" /></button>
                          <span className="text-xs font-semibold text-slate-900 w-4 text-center">{qty}</span>
                          <button onClick={() => addItem(item.id)} className="w-7 h-7 rounded-full bg-amber-500 shadow-sm flex items-center justify-center hover:bg-amber-600 transition-colors cursor-pointer"><Plus size={12} className="text-white" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* AI Suggestion Widget */}
              {cartItems.length > 0 && !hasChiliOil && (
                <div className="mt-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl border border-amber-200/60 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={14} className="text-amber-500" />
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">{t('aiSuggestionLabel', lang)}</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {lang === 'en'
                      ? <>You have {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart. Customers usually add <span className="font-semibold">'{SUGGESTION_ITEM.name_en}'</span> to this order. Add for <span className="font-bold">${SUGGESTION_ITEM.price.toFixed(2)}</span>?</>
                      : <>您的購物車有 {totalItems} 件商品。大多數顧客會加購<span className="font-semibold">「{SUGGESTION_ITEM.name_zh || SUGGESTION_ITEM.name_en}」</span>。只需 <span className="font-bold">${SUGGESTION_ITEM.price.toFixed(2)}</span>！</>
                    }
                  </p>
                  <button onClick={() => addItem(SUGGESTION_ITEM.id)} className="mt-3 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors cursor-pointer flex items-center gap-1.5">
                    <Plus size={14} />
                    {t('addToCart', lang)}
                  </button>
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-slate-100 px-5 py-4">
                <div className="flex justify-between text-base font-bold text-slate-900 mb-4">
                  <span>{t('subtotal', lang)}</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true) }}
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

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutView cartItems={cartItems} subtotal={totalPrice} onBack={() => setIsCheckoutOpen(false)} onComplete={handleComplete} referralCode={referralCode} onAdd={addItem} onRemove={removeItem} lang={lang} />
      )}
    </div>
  )
}
