// ─── Mock Rewards Feed ───
// TODO: TECH TEAM - Replace with n8n GET /webhook/rewards?email=...
// Includes a mock user points balance + list of available restaurant rewards.

const daysFromNow = (d) => {
  const t = new Date()
  t.setDate(t.getDate() + d)
  t.setHours(23, 59, 0, 0)
  return t.toISOString()
}

export const USER_POINTS = 1240

export const REWARDS = [
  {
    id: 'rwd-tofu-king-10',
    restaurantId: 'tofu-king',
    restaurantName_en: 'Tofu King',
    restaurantName_zh: '豆腐王',
    title_en: '10% off your next order',
    title_zh: '下次訂單 9 折',
    description_en: 'Stackable once per drop. No minimum spend.',
    description_zh: '每檔團購可使用一次，無最低消費。',
    pointsRequired: 1000,
    expiresAt: daysFromNow(14),
    emoji: '🍲',
  },
  {
    id: 'rwd-boba-milk-tea',
    restaurantId: 'boba-drop',
    restaurantName_en: 'Boba Drop',
    restaurantName_zh: '珍珠快閃',
    title_en: 'Free Classic Milk Tea kit',
    title_zh: '免費經典奶茶包',
    description_en: 'Serves 4. Redeemable on any Sunday drop.',
    description_zh: '4 人份。可於任何週日團購兌換。',
    pointsRequired: 500,
    expiresAt: daysFromNow(21),
    emoji: '🧋',
  },
  {
    id: 'rwd-dumpling-bonus',
    restaurantId: 'dumpling-house',
    restaurantName_en: 'Dumpling House',
    restaurantName_zh: '水餃之家',
    title_en: '+15 bonus dumplings',
    title_zh: '加贈 15 顆水餃',
    description_en: 'Added free to any dumpling order.',
    description_zh: '加入任一水餃訂單即可免費獲得。',
    pointsRequired: 300,
    expiresAt: daysFromNow(4),
    emoji: '🥟',
  },
  {
    id: 'rwd-tofu-chili-oil',
    restaurantId: 'tofu-king',
    restaurantName_en: 'Tofu King',
    restaurantName_zh: '豆腐王',
    title_en: 'Free Signature Chili Oil',
    title_zh: '免費招牌辣油',
    description_en: 'One jar per redemption.',
    description_zh: '每次兌換一罐。',
    pointsRequired: 750,
    expiresAt: daysFromNow(7),
    emoji: '🌶️',
  },
]
