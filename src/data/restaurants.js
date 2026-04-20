// ─── Mock Restaurant / Drop Feed ───
// TODO: TECH TEAM - Replace with n8n GET request to /webhook/foodservai-drops.

const daysFromNow = (d, h = 0, m = 0) => {
  const t = new Date()
  t.setDate(t.getDate() + d)
  t.setHours(h, m, 0, 0)
  return t.toISOString()
}

export const RESTAURANTS = [
  {
    id: 'tofu-king',
    name_en: 'Tofu King',
    name_zh: '豆腐王',
    tagline: {
      en: 'Pre-order now for weekend pickups across SoCal.',
      zh: '立即預訂，週末於南加州各取貨點取貨。',
    },
    hubCity: { en: 'Irvine', zh: '爾灣' },
    dropCloseAt: daysFromNow(2, 21, 0),
    coverGradient: 'from-amber-500/25 via-slate-900 to-slate-900',
    emoji: '🍲',
    zipCodes: ['92602', '92618', '91748', '91006'],
    categories: ['Hot Deli (熟食)', 'Frozen Signatures (冷凍食品)'],
    dropHubs: [
      { id: 'irvine-spectrum',    city: { en: 'Irvine Spectrum',      zh: '爾灣 Spectrum' },    label: { en: '📍 Irvine Spectrum — Sat 12:00 PM',     zh: '📍 爾灣 Spectrum — 週六下午 12:00' } },
      { id: 'arcadia-santa-anita',city: { en: 'Arcadia Santa Anita',  zh: '亞凱迪亞 聖塔安妮塔' }, label: { en: '📍 Arcadia Santa Anita — Sun 2:00 PM',  zh: '📍 亞凱迪亞 聖塔安妮塔 — 週日下午 2:00' } },
      { id: 'chino-hills-shoppes',city: { en: 'Chino Hills Shoppes',  zh: '奇諾崗 Shoppes' },   label: { en: '📍 Chino Hills Shoppes — Sun 5:00 PM',  zh: '📍 奇諾崗 Shoppes — 週日下午 5:00' } },
    ],
    communityGoal: {
      current: 750,
      target: 1000,
      minimumSpend: 15,
      reward: {
        en: 'Free Spicy Wontons for everyone',
        zh: '全員免費辣餛飩',
      },
    },
    suggestionItemId: 3,
    menu: [
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
    ],
  },
  {
    id: 'dumpling-house',
    name_en: 'Dumpling House',
    name_zh: '水餃之家',
    tagline: {
      en: 'Hand-pleated dumplings made fresh the morning of pickup.',
      zh: '現包現做，取貨當日新鮮製作。',
    },
    hubCity: { en: 'Rowland Heights', zh: '羅蘭崗' },
    dropCloseAt: daysFromNow(3, 21, 0),
    coverGradient: 'from-emerald-500/25 via-slate-900 to-slate-900',
    emoji: '🥟',
    zipCodes: ['91748', '91745', '91789'],
    categories: ['Dumplings (水餃)', 'Sides (小菜)'],
    dropHubs: [
      { id: 'rowland-heights-99', city: { en: 'Rowland Heights 99 Ranch', zh: '羅蘭崗 大華超市' }, label: { en: '📍 Rowland Heights 99 Ranch — Sat 1:00 PM', zh: '📍 羅蘭崗 大華超市 — 週六下午 1:00' } },
      { id: 'diamond-bar-plaza',  city: { en: 'Diamond Bar Plaza',        zh: '鑽石吧 Plaza' },    label: { en: '📍 Diamond Bar Plaza — Sat 3:30 PM',        zh: '📍 鑽石吧 Plaza — 週六下午 3:30' } },
    ],
    communityGoal: {
      current: 420,
      target: 600,
      minimumSpend: 20,
      reward: {
        en: '+10 bonus dumplings per order',
        zh: '每單加贈 10 顆水餃',
      },
    },
    suggestionItemId: 103,
    menu: [
      { id: 101, name_en: 'Pork & Shrimp Dumplings (25pc)', name_zh: '豬蝦水餃 (25顆)', price: 17.99, category: 'Dumplings (水餃)', image_placeholder_color: 'bg-pink-100', is_hot_seller: true },
      { id: 102, name_en: 'Vegetable Dumplings (25pc)', name_zh: '素水餃 (25顆)', price: 14.99, category: 'Dumplings (水餃)', image_placeholder_color: 'bg-green-100', is_hot_seller: false },
      { id: 103, name_en: 'Black Vinegar & Chili Sauce', name_zh: '黑醋辣椒醬', price: 5.99, category: 'Sides (小菜)', image_placeholder_color: 'bg-amber-100', is_hot_seller: true },
      { id: 104, name_en: 'Cold Cucumber Salad', name_zh: '涼拌黃瓜', price: 7.49, category: 'Sides (小菜)', image_placeholder_color: 'bg-lime-100', is_hot_seller: false },
      { id: 105, name_en: 'Beef & Onion Dumplings (25pc)', name_zh: '牛肉洋蔥水餃 (25顆)', price: 18.99, category: 'Dumplings (水餃)', image_placeholder_color: 'bg-orange-100', is_hot_seller: true },
      { id: 106, name_en: 'Marinated Tofu Skin', name_zh: '滷豆皮', price: 6.99, category: 'Sides (小菜)', image_placeholder_color: 'bg-yellow-100', is_hot_seller: false },
    ],
  },
  {
    id: 'boba-drop',
    name_en: 'Boba Drop',
    name_zh: '珍珠快閃',
    tagline: {
      en: 'Frozen boba kits and milk-tea concentrates. Shake at home, taste the shop.',
      zh: '冷凍珍珠包與奶茶濃縮包，在家搖一搖，喝出手搖店的味道。',
    },
    hubCity: { en: 'Arcadia', zh: '亞凱迪亞' },
    dropCloseAt: daysFromNow(4, 21, 0),
    coverGradient: 'from-fuchsia-500/25 via-slate-900 to-slate-900',
    emoji: '🧋',
    zipCodes: ['91006', '91007', '91775'],
    categories: ['Kits', 'Concentrates'],
    dropHubs: [
      { id: 'arcadia-mall',     city: { en: 'Arcadia Mall',       zh: '亞凱迪亞 Mall' }, label: { en: '📍 Arcadia Mall — Sun 12:00 PM',       zh: '📍 亞凱迪亞 Mall — 週日下午 12:00' } },
      { id: 'san-gabriel-plaza',city: { en: 'San Gabriel Plaza',  zh: '聖蓋博 Plaza' },  label: { en: '📍 San Gabriel Plaza — Sun 3:00 PM',    zh: '📍 聖蓋博 Plaza — 週日下午 3:00' } },
    ],
    communityGoal: {
      current: 260,
      target: 800,
      minimumSpend: 18,
      reward: {
        en: 'Free brown sugar pearl upgrade on every kit',
        zh: '每套升級黑糖珍珠',
      },
    },
    suggestionItemId: 203,
    menu: [
      { id: 201, name_en: 'Classic Boba Kit (Serves 4)', name_zh: '經典珍珠奶茶包 (4人份)', price: 19.99, category: 'Kits', image_placeholder_color: 'bg-amber-100', is_hot_seller: true },
      { id: 202, name_en: 'Taro Boba Kit (Serves 4)', name_zh: '芋頭珍珠奶茶包 (4人份)', price: 21.99, category: 'Kits', image_placeholder_color: 'bg-purple-100', is_hot_seller: true },
      { id: 203, name_en: 'Brown Sugar Syrup (16oz)', name_zh: '黑糖糖漿 (16oz)', price: 8.99, category: 'Concentrates', image_placeholder_color: 'bg-orange-100', is_hot_seller: false },
      { id: 204, name_en: 'Thai Tea Concentrate (32oz)', name_zh: '泰式奶茶濃縮 (32oz)', price: 12.99, category: 'Concentrates', image_placeholder_color: 'bg-rose-100', is_hot_seller: true },
      { id: 205, name_en: 'Matcha Latte Kit (Serves 4)', name_zh: '抹茶拿鐵包 (4人份)', price: 22.99, category: 'Kits', image_placeholder_color: 'bg-emerald-100', is_hot_seller: false },
    ],
  },
]

export const getRestaurant = (id) => RESTAURANTS.find((r) => r.id === id)
