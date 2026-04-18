// ─── Shared Translation Dictionary ───
// Used across Portal, RestaurantDrop, OrderHistory, Header, AuthModal

export const T = {
  // ── Header / global ──
  cart: { en: 'Cart', zh: '購物車' },
  signIn: { en: 'Sign in', zh: '登入' },
  profile: { en: 'Profile', zh: '個人檔案' },
  signOut: { en: 'Sign out', zh: '登出' },

  // ── Portal ──
  portalHeroEyebrow: { en: 'FoodservAI Community Marketplace', zh: 'FoodservAI 社區市集' },
  portalHeroTitle: { en: 'Weekend Drops, Curated.', zh: '精選週末團購。' },
  portalHeroDesc: { en: 'Skip the long lines. Pre-order from SoCal\'s best kitchens and pick up at a neighborhood hub.', zh: '免排隊。向南加州最棒的廚房預訂，到社區取貨點領取。' },
  portalSearchPlaceholder: { en: 'Enter Address or Zip Code', zh: '輸入地址或郵遞區號' },
  useCurrentLocation: { en: '📍 Use Current Location', zh: '📍 使用目前位置' },
  activeDropsTitle: { en: 'Active Drops', zh: '進行中的團購' },
  nextDrop: { en: 'Next Drop', zh: '下一次團購' },
  dropClosesIn: { en: 'Closes in', zh: '距離截止' },
  dropClosed: { en: 'Drop closed', zh: '團購已截止' },
  viewDrop: { en: 'View Drop', zh: '查看團購' },
  noResults: { en: 'No drops match that location yet. Try another zip.', zh: '目前這個地區沒有團購。請嘗試其他郵遞區號。' },

  // ── Restaurant Drop (existing) ──
  add: { en: 'Add', zh: '加入' },
  hotSeller: { en: '🔥 Hot Seller', zh: '🔥 熱銷' },
  communityGroupOrder: { en: 'Community Group Order', zh: '社區團購' },
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

  // ── Auth Modal ──
  authTitle: { en: 'Sign in to join the drop.', zh: '登入以加入團購。' },
  authSubtitle: { en: 'We\'ll email you a 4-digit code. No passwords, ever.', zh: '我們會寄送 4 位數驗證碼到您的信箱，無需密碼。' },
  sendLoginCode: { en: 'Send Login Code', zh: '發送登入驗證碼' },
  enterCode: { en: 'Enter the 4-digit code', zh: '請輸入 4 位數驗證碼' },
  codeSentTo: { en: 'Sent to', zh: '已寄送至' },
  verifyContinue: { en: 'Verify & Continue', zh: '驗證並繼續' },
  changeEmail: { en: 'Change email', zh: '更改電子信箱' },
  hint: { en: 'Demo: enter any 4 digits', zh: '示範模式：輸入任意 4 位數' },

  // ── Phase 8: FOMO Engine ──
  dropClosesInLabel: { en: '⏳ Drop Closes In', zh: '⏳ 距離團購截止' },
  communityGoal: { en: 'Community Goal', zh: '社區目標' },
  toUnlock: { en: 'to unlock', zh: '即可解鎖' },
  goalReached: { en: '🎉 Goal unlocked for the whole group!', zh: '🎉 全組已解鎖此獎勵！' },
  cartNudge: { en: 'Only {amount} away from the Community Reward!', zh: '再差 {amount} 就能解鎖社區獎勵！' },
  cartNudgeReached: { en: '🎉 Reward unlocked — share the drop!', zh: '🎉 已解鎖獎勵 — 快分享團購連結！' },
  selectDropHub: { en: 'Select Your Drop Hub', zh: '選擇取貨點' },
  selectHubPlaceholder: { en: 'Select a drop hub…', zh: '選擇取貨點⋯' },

  // ── Phase 8: Global nav & checkout UX ──
  home: { en: 'Home', zh: '首頁' },
  backToRestaurant: { en: 'Back to Restaurant', zh: '返回餐廳' },
  emailLocked: { en: 'Locked to your signed-in account', zh: '已鎖定為您的登入帳戶' },

  // ── Phase 8: Abandoned cart recovery ──
  pendingOrdersTitle: { en: 'Pending Orders', zh: '待完成訂單' },
  pendingOrdersDesc: { en: 'You have unfinished drops waiting.', zh: '您有尚未完成的團購訂單。' },
  completeBefore: { en: '⚠️ Complete your order before the drop window closes at', zh: '⚠️ 請在團購截止時間前完成訂單：' },
  resumeCheckout: { en: 'Resume Checkout', zh: '繼續結帳' },

  // ── Phase 8: Rewards ──
  rewards: { en: 'Rewards', zh: '獎勵' },
  rewardsTitle: { en: 'FoodservAI Rewards', zh: 'FoodservAI 獎勵' },
  rewardsSubtitle: { en: 'Redeem your points for free drops and perks.', zh: '使用點數兌換免費團購與福利。' },
  currentPoints: { en: 'Current FoodservAI Points', zh: '目前 FoodservAI 點數' },
  points: { en: 'pts', zh: '點' },
  sortBy: { en: 'Sort by', zh: '排序方式' },
  sortHighest: { en: 'Highest Points', zh: '點數由高至低' },
  sortLowest: { en: 'Lowest Points', zh: '點數由低至高' },
  sortExpiring: { en: 'Expiring Soon', zh: '即將過期' },
  redeem: { en: 'Redeem', zh: '兌換' },
  needMore: { en: 'Need', zh: '還差' },
  morePoints: { en: 'more pts', zh: '點' },
  expires: { en: 'Expires', zh: '到期' },

  // ── Order History ──
  orderHistoryTitle: { en: 'Order History', zh: '訂單記錄' },
  orderHistorySubtitle: { en: 'Your last 30 days of drops.', zh: '過去 30 天的團購訂單。' },
  searchOrders: { en: 'Search past orders (restaurant or item name)', zh: '搜尋過去訂單（店名或品項）' },
  noOrdersFound: { en: 'No orders found in the last 30 days.', zh: '過去 30 天內沒有訂單。' },
  reorder: { en: '🔄 Reorder', zh: '🔄 再次訂購' },
  morePrefix: { en: '+', zh: '+' },
  moreItems: { en: 'more', zh: '項' },
  completed: { en: 'Completed', zh: '已完成' },
  pickedUp: { en: 'Picked Up', zh: '已取貨' },
  refunded: { en: 'Refunded', zh: '已退款' },

  // ── Phase 40: Marketplace Hub search & sort ──
  searchRestaurants: { en: 'Search by restaurant name', zh: '依餐廳名稱搜尋' },
  sortDropClosing: { en: 'Drop Closing Time', zh: '團購截止時間' },
  sortNameAZ: { en: 'Name (A–Z)', zh: '名稱 (A–Z)' },
  unlockSuffix: { en: 'to unlock', zh: '即可解鎖' },
  goalUnlocked: { en: '✓ Unlocked', zh: '✓ 已解鎖' },

  // ── Phase 40: Rewards search & pinning ──
  searchRewards: { en: 'Search rewards by restaurant', zh: '依餐廳搜尋獎勵' },
  previouslyOrdered: { en: 'From Your Previous Orders', zh: '您曾訂購的餐廳' },
  otherRewards: { en: 'Other Available Rewards', zh: '其他可用獎勵' },
  noRewardsFound: { en: 'No rewards match your search.', zh: '沒有符合的獎勵。' },

  // ── Phase 40: Community goal minimum-spend qualifier ──
  minSpendNote: {
    en: '(Note: Individual cart must be at least {amount} to qualify for group rewards)',
    zh: '（註：個人訂單需達 {amount} 以上才符合團體獎勵資格）',
  },
  minSpendOnlyMore: {
    en: 'Only {amount} more needed to unlock',
    zh: '只差 {amount} 即可解鎖',
  },
  gmDashboardNote: {
    en: '⚙️ Minimum-spend threshold is set by the restaurant in GM Dashboard → Community Goal settings.',
    zh: '⚙️ 最低消費門檻由餐廳於 GM 管理後台 → 社區目標設定調整。',
  },

  // ── Phase 40: Download receipt ──
  downloadReceipt: { en: 'Download Receipt', zh: '下載收據' },
  receiptBrandingNote: {
    en: '📄 Receipts render with the custom logo & branding set by the restaurant in CRM → Receipt Branding.',
    zh: '📄 收據使用餐廳於 CRM → 收據品牌設定中自訂的 Logo 與品牌樣式產生。',
  },

  // ── Phase 41: In-checkout rewards & promo ──
  applyRewards: { en: 'Apply Rewards', zh: '使用獎勵' },
  noRewardsForDrop: {
    en: 'No rewards available for this drop yet.',
    zh: '目前此團購沒有可用獎勵。',
  },
  selectRewardPlaceholder: { en: 'Select a reward…', zh: '選擇獎勵⋯' },
  rewardUnlocked: { en: 'Unlocked', zh: '已解鎖' },
  rewardRedeemCost: {
    en: 'Costs {points} Points to Redeem',
    zh: '需 {points} 點兌換',
  },
  rewardNeedMore: {
    en: 'Need {points} more pts',
    zh: '還差 {points} 點',
  },
  rewardDeductionNote: {
    en: '-{points} Points will be deducted from your balance.',
    zh: '將從您的點數餘額扣除 {points} 點。',
  },
  rewardAlreadyUnlocked: {
    en: '✓ This reward is already unlocked — no points deducted.',
    zh: '✓ 此獎勵已解鎖 — 不會扣除點數。',
  },
  promoCode: { en: 'Promo Code', zh: '優惠碼' },
  promoPlaceholder: { en: 'Enter promo code', zh: '輸入優惠碼' },
  apply: { en: 'Apply', zh: '套用' },
  promoApplied: {
    en: 'Code Applied: 10% Off Group Host Special',
    zh: '優惠碼已套用：團主專屬 9 折',
  },
  rewardClaimed: { en: 'Claimed', zh: '已領取' },
  rewardRedeemed: {
    en: 'Redeemed: {title} (-{points} pts)',
    zh: '已兌換：{title} (-{points} 點)',
  },

  // ── Phase 9A: Rewards subtabs + in-store redemption ──
  tabAvailable: { en: 'Available Rewards', zh: '可用獎勵' },
  tabUsed: { en: 'Past / Used', zh: '歷史記錄' },
  useInStore: { en: 'Use In-Store', zh: '門市兌換' },
  rewardUsedLabel: { en: 'Used', zh: '已使用' },
  rewardUsedOn: { en: 'Used on', zh: '使用於' },
  noUsedRewards: { en: 'No rewards redeemed yet.', zh: '尚未使用任何獎勵。' },
  confirmRedemption: { en: 'Confirm Redemption', zh: '確認兌換' },
  antiFraudTitle: { en: 'Heads up —', zh: '注意 —' },
  antiFraudBody: {
    en: 'Only tap Confirm when you are physically at the counter with staff. This starts a live 15-minute redemption window.',
    zh: '請僅在櫃台人員面前按下「確認」。將啟動一個 15 分鐘的即時兌換視窗。',
  },
  cancel: { en: 'Cancel', zh: '取消' },
  confirmWithStaff: { en: 'Confirm with Staff', zh: '向店員確認' },
  liveRedemption: { en: 'Live Redemption', zh: '即時兌換' },
  showCashier: { en: 'Show this live screen to the cashier.', zh: '請將此即時畫面出示給收銀員。' },
  expiresIn: { en: 'Expires In', zh: '剩餘時間' },
  staffTap: { en: 'Mark as Redeemed (Staff Tap Here)', zh: '標記為已兌換（店員請按此）' },
  staffTapHelper: {
    en: 'Customer: do not press. Cashier confirms redemption.',
    zh: '顧客請勿按下，由收銀員完成兌換。',
  },

  // ── Phase 9B/9C: Issue Report ──
  reportIssue: { en: 'Report an Issue', zh: '回報問題' },
  reportIssueTitle: { en: 'Report an Issue', zh: '回報問題' },
  reportIssueSubtitle: {
    en: 'Tell us what went wrong — your GM will be notified directly.',
    zh: '告訴我們發生了什麼 — 將直接通知店經理。',
  },
  selectOrder: { en: 'Select Order', zh: '選擇訂單' },
  selectOrderPlaceholder: { en: 'Choose an order…', zh: '選擇訂單⋯' },
  issueType: { en: 'Issue Type', zh: '問題類型' },
  issueTypePlaceholder: { en: 'Select issue type…', zh: '選擇問題類型⋯' },
  issueTypeMissing: { en: 'Missing Item', zh: '缺件' },
  issueTypeQuality: { en: 'Quality Issue', zh: '品質問題' },
  issueTypeWrong: { en: 'Wrong Order', zh: '訂單錯誤' },
  issueTypeOther: { en: 'Other', zh: '其他' },
  issueDescription: { en: 'Description', zh: '說明' },
  issueDescriptionPlaceholder: {
    en: 'Describe what happened (optional photo helps a lot).',
    zh: '描述發生的狀況（建議附上一張照片）。',
  },
  issuePhoto: { en: 'Photo (optional — one image only)', zh: '照片（選填 — 僅限一張）' },
  issuePhotoHint: {
    en: 'Images are resized to 800px and compressed locally before upload.',
    zh: '圖片將在本機壓縮至 800px 寬再上傳。',
  },
  issueSubmit: { en: 'Submit Report', zh: '送出回報' },
  issueSubmitting: { en: 'Submitting…', zh: '送出中⋯' },
  issueSuccessTitle: { en: 'Report Submitted', zh: '已送出回報' },
  issueSuccessBody: {
    en: 'The General Manager has been notified directly.',
    zh: '已直接通知店經理。',
  },
  issueBackToReports: { en: 'Back to Home', zh: '返回首頁' },
  issueNoOrders: {
    en: 'No recent orders found. Issue reports are only accepted within 24 hours of your purchase.',
    zh: '找不到最近的訂單。問題回報僅接受購買後 24 小時內的訂單。',
  },
  issueSignInRequired: {
    en: 'Sign in to file an issue report.',
    zh: '請先登入後再回報問題。',
  },

  // ── Phase 9A: Checkout reward discount ──
  rewardDiscountLine: { en: 'Reward', zh: '獎勵折抵' },
  rewardAttached: {
    en: 'Reward attached (no cash value)',
    zh: '已附加獎勵（無現金價值）',
  },
}

export const t = (key, lang) => T[key]?.[lang] ?? T[key]?.en ?? key

export const itemName = (item, lang) =>
  lang === 'zh' ? (item.name_zh || item.name_en) : item.name_en
export const itemSub = (item, lang) =>
  lang === 'zh' ? item.name_en : item.name_zh
