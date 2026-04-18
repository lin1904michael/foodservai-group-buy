import { useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Search, ScrollText, Receipt, FileDown, Info } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { t } from '../i18n'

// ─── Order History (/history) ───
// Mock fetch of the last 30 days, instant client-side filter.

function daysAgoISO(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

function hoursAgoISO(n) {
  const d = new Date()
  d.setHours(d.getHours() - n)
  return d.toISOString()
}

export const MOCK_ORDERS = [
  {
    orderId: 'FSA-7840',
    date: hoursAgoISO(6),
    restaurantId: 'tofu-king',
    restaurantName: 'Tofu King 豆腐王',
    items: [
      { name: 'Xiao Long Bao (20pc)', qty: 1 },
      { name: 'Signature Chili Oil', qty: 1 },
    ],
    totalAmount: 25.32,
    status: 'pickedUp',
  },
  {
    orderId: 'FSA-7823',
    date: daysAgoISO(4),
    restaurantId: 'tofu-king',
    restaurantName: 'Tofu King 豆腐王',
    items: [
      { name: 'Pork & Chive Dumplings (30pc)', qty: 2 },
      { name: 'Signature Chili Oil', qty: 1 },
      { name: 'Scallion Pancakes (5pc)', qty: 1 },
      { name: 'Braised Pork Belly', qty: 1 },
    ],
    totalAmount: 74.44,
    status: 'pickedUp',
  },
  {
    orderId: 'FSA-7791',
    date: daysAgoISO(11),
    restaurantId: 'dumpling-house',
    restaurantName: 'Dumpling House 水餃之家',
    items: [
      { name: 'Pork & Shrimp Dumplings (25pc)', qty: 1 },
      { name: 'Black Vinegar & Chili Sauce', qty: 2 },
      { name: 'Cold Cucumber Salad', qty: 1 },
    ],
    totalAmount: 38.40,
    status: 'completed',
  },
  {
    orderId: 'FSA-7744',
    date: daysAgoISO(22),
    restaurantId: 'boba-drop',
    restaurantName: 'Boba Drop 珍珠快閃',
    items: [
      { name: 'Classic Boba Kit (Serves 4)', qty: 1 },
      { name: 'Brown Sugar Syrup (16oz)', qty: 2 },
    ],
    totalAmount: 41.22,
    status: 'refunded',
  },
]

export const getPreviouslyOrderedRestaurantIds = () =>
  Array.from(new Set(MOCK_ORDERS.map((o) => o.restaurantId)))

function formatDate(iso, lang) {
  const d = new Date(iso)
  return d.toLocaleDateString(lang === 'zh' ? 'zh-TW' : 'en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function SkeletonCard() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-2">
          <div className="h-4 w-40 bg-slate-800 rounded" />
          <div className="h-3 w-24 bg-slate-800 rounded" />
        </div>
        <div className="h-6 w-20 bg-slate-800 rounded-full" />
      </div>
      <div className="space-y-2 mb-5">
        <div className="h-3 w-full bg-slate-800 rounded" />
        <div className="h-3 w-5/6 bg-slate-800 rounded" />
        <div className="h-3 w-2/3 bg-slate-800 rounded" />
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <div className="h-5 w-24 bg-slate-800 rounded" />
        <div className="h-10 w-28 bg-slate-800 rounded-full" />
      </div>
    </div>
  )
}

const STATUS_STYLES = {
  completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  pickedUp: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  refunded: 'bg-slate-700/40 text-slate-400 border-slate-700',
}

function OrderCard({ order, lang, index }) {
  const previewItems = order.items.slice(0, 3)
  const remaining = order.items.length - previewItems.length

  return (
    <div
      className="rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-sm p-5
                 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5
                 transition-all duration-300 animate-[slideUp_320ms_ease-out]"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-white truncate">{order.restaurantName}</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {formatDate(order.date, lang)} · <span className="font-mono">{order.orderId}</span>
          </p>
        </div>
        <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLES[order.status] || STATUS_STYLES.completed}`}>
          {t(order.status, lang)}
        </span>
      </div>

      <ul className="space-y-1 mb-5">
        {previewItems.map((it, i) => (
          <li key={i} className="text-sm text-slate-300 flex items-center justify-between gap-3">
            <span className="truncate">• {it.name}</span>
            <span className="text-slate-500 tabular-nums shrink-0">×{it.qty}</span>
          </li>
        ))}
        {remaining > 0 && (
          <li className="text-xs text-slate-500 italic">
            {t('morePrefix', lang)}{remaining} {t('moreItems', lang)}
          </li>
        )}
      </ul>

      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-slate-500 font-semibold">{t('total', lang)}</p>
          <p className="text-lg font-bold text-white tabular-nums">${order.totalAmount.toFixed(2)}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              // TODO: TECH TEAM - Replace with n8n GET /webhook/receipt-pdf?order_id=... which returns a
              // PDF rendered server-side using the GM's CRM → Receipt Branding logo & colors.
              console.log('Download receipt (branded via CRM):', order.orderId)
            }}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-500/60 text-slate-200 hover:text-white font-semibold text-sm px-3.5 py-2.5 rounded-full transition-all duration-200 cursor-pointer inline-flex items-center gap-1.5"
            aria-label={t('downloadReceipt', lang)}
          >
            <FileDown size={14} className="text-amber-400" />
            <span className="hidden sm:inline">{t('downloadReceipt', lang)}</span>
            <span className="sm:hidden">📄</span>
          </button>
          <button
            onClick={() => console.log('Reorder:', order.orderId)}
            className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm px-4 py-2.5 rounded-full transition-all duration-200 cursor-pointer hover:scale-[1.03] active:scale-95 inline-flex items-center gap-1.5"
          >
            {t('reorder', lang)}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function OrderHistory() {
  const { user, lang, openAuthModal } = useApp()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    // TODO: TECH TEAM - Replace with actual n8n GET request.
    // e.g. fetch(`${N8N}/webhook/order-history?email=${user.email}&days=30`).
    const timer = setTimeout(() => {
      try {
        setOrders(MOCK_ORDERS)
        setIsLoading(false)
      } catch (e) {
        setError(String(e))
        setIsLoading(false)
      }
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // Guest gate: redirect to / and pop the auth modal.
  useEffect(() => {
    if (!user) openAuthModal()
  }, [user, openAuthModal])

  const filteredOrders = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) return orders
    return orders.filter((o) =>
      o.restaurantName.toLowerCase().includes(q) ||
      o.items.some((it) => it.name.toLowerCase().includes(q)),
    )
  }, [orders, searchTerm])

  if (!user) return <Navigate to="/" replace />

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-slate-950 text-white">
      <section className="border-b border-slate-800/70">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-amber-500/20 mb-3">
            <ScrollText size={12} />
            30 {lang === 'zh' ? '天記錄' : 'day history'}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight">
            {t('orderHistoryTitle', lang)}
          </h1>
          <p className="text-slate-400 mt-2">{t('orderHistorySubtitle', lang)}</p>

          {/* Search */}
          <div className="mt-6 relative max-w-xl">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`🔍 ${t('searchOrders', lang)}`}
              className="w-full bg-slate-900/70 backdrop-blur-sm border border-slate-700/70 rounded-full pl-12 pr-5 py-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/70 transition-all"
            />
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-10">
        {!isLoading && filteredOrders.length > 0 && (
          <div className="flex items-start gap-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 mb-5">
            <Info size={14} className="text-amber-400 mt-0.5 shrink-0" />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {t('receiptBrandingNote', lang)}
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-5 mb-5 text-sm text-red-300">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-12 text-center">
            <Receipt size={32} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">{t('noOrdersFound', lang)}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredOrders.map((o, i) => (
              <OrderCard key={o.orderId} order={o} lang={lang} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
