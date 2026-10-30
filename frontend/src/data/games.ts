export interface AccountField {
  id: string;
  label: string;
  labelKh: string;
  placeholder: string;
  placeholderKh: string;
  type: 'text' | 'select';
  options?: { label: string; value: string }[];
  helperText?: string;
  helperTextKh?: string;
}

export interface GamePackage {
  id: string;
  label: string;
  amount: number;
  bonus: number;
  priceUSD: number;
  priceKHR: number;
  discountPercent?: number;
  popular?: boolean;
  badge?: string;
}

export interface GameItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryId: 'moba-mlbb' | 'ff' | 'pubg' | 'roblox' | 'rpg-genshin' | 'shooter';
  cover: string;
  banner: string;
  currencyName: string;
  currencyIcon: string;
  accountFields: AccountField[];
  packages: GamePackage[];
  rating: number;
  ordersToday: number;
  tags: string[];
}

export interface CategoryGroup {
  id: 'all' | 'moba-mlbb' | 'ff' | 'pubg' | 'roblox' | 'rpg-genshin' | 'shooter';
  label: string;
  labelKh: string;
  icon: string;
}

export const CATEGORIES: CategoryGroup[] = [
  { id: 'all', label: 'All Games', labelKh: 'ហ្គេមទាំងអស់', icon: '🎮' },
  { id: 'moba-mlbb', label: 'Mobile Legends: Bang Bang', labelKh: 'Mobile Legends (Diamonds & Pass)', icon: '💎' },
  { id: 'ff', label: 'Free Fire & Free Fire Max', labelKh: 'Free Fire (Diamonds)', icon: '🔥' },
  { id: 'pubg', label: 'PUBG Mobile', labelKh: 'PUBG Mobile (UC)', icon: '🪙' },
  { id: 'roblox', label: 'Roblox (Robux Direct)', labelKh: 'Roblox (Robux Direct)', icon: '⚡' },
  { id: 'rpg-genshin', label: 'Genshin, Valorant & HOK', labelKh: 'Genshin, Valorant & HOK', icon: '💎' },
  { id: 'shooter', label: 'CODM, Wild Rift & Blood Strike', labelKh: 'CODM, Wild Rift & Blood Strike', icon: '🎯' },
];

export const GAMES: GameItem[] = [
  // 1. Mobile Legends: Bang Bang
  {
    id: '1',
    slug: 'mobile-legends',
    name: 'Mobile Legends: Bang Bang',
    category: 'MOBA',
    categoryId: 'moba-mlbb',
    cover: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1920&q=85',
    currencyName: 'Diamonds & Pass',
    currencyIcon: '💎',
    rating: 4.9,
    ordersToday: 24890,
    tags: ['Moonton', 'MOBA', 'Instant Delivery', 'Popular'],
    accountFields: [
      {
        id: 'userId',
        label: 'User ID',
        labelKh: 'User ID',
        placeholder: 'e.g. 12345678',
        placeholderKh: 'ឧទាហរណ៍ 12345678',
        type: 'text',
        helperText: 'Find in Profile > Basic Info (Numbers before bracket)',
        helperTextKh: 'រកក្នុង Profile > Basic Info (លេខមុខវង់ក្រចក)',
      },
      {
        id: 'zoneId',
        label: 'Zone ID',
        labelKh: 'Zone ID',
        placeholder: 'e.g. 2001',
        placeholderKh: 'ឧទាហរណ៍ 2001',
        type: 'text',
        helperText: 'Numbers inside bracket e.g. (2001)',
        helperTextKh: 'លេខក្នុងវង់ក្រចក ឧ. (2001)',
      },
    ],
    packages: [
      { id: 'ml-pass', label: 'Weekly Diamond Pass', amount: 210, bonus: 70, priceUSD: 1.85, priceKHR: 7600, discountPercent: 30, popular: true, badge: 'HOT DEAL' },
      { id: 'ml-86', label: '86 Diamonds', amount: 86, bonus: 0, priceUSD: 1.25, priceKHR: 5125 },
      { id: 'ml-172', label: '172 Diamonds', amount: 172, bonus: 14, priceUSD: 2.45, priceKHR: 10045 },
      { id: 'ml-257', label: '257 Diamonds', amount: 257, bonus: 25, priceUSD: 3.65, priceKHR: 14965, popular: true, badge: 'BEST VALUE' },
      { id: 'ml-706', label: '706 Diamonds', amount: 706, bonus: 70, priceUSD: 9.85, priceKHR: 40385 },
      { id: 'ml-2195', label: '2,195 Diamonds', amount: 2195, bonus: 260, priceUSD: 29.90, priceKHR: 122590, badge: 'VIP PACK' },
      { id: 'ml-twilight', label: 'Twilight Pass', amount: 1, bonus: 0, priceUSD: 9.50, priceKHR: 38950 },
    ],
  },

  // 2. Free Fire & Free Fire Max
  {
    id: '2',
    slug: 'free-fire',
    name: 'Free Fire & Free Fire Max',
    category: 'Battle Royale',
    categoryId: 'ff',
    cover: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1920&q=85',
    currencyName: 'Diamonds',
    currencyIcon: '💎',
    rating: 4.8,
    ordersToday: 18450,
    tags: ['Garena', 'Shooter', 'Fast Delivery'],
    accountFields: [
      {
        id: 'playerId',
        label: 'Player ID (UID)',
        labelKh: 'លេខសម្គាល់ Player ID (UID)',
        placeholder: 'e.g. 192837465',
        placeholderKh: 'ឧទាហរណ៍ 192837465',
        type: 'text',
        helperText: 'Click your profile avatar at top-left to copy your UID',
        helperTextKh: 'ចុចលើ Avatar ជ្រុងខាងលើឆ្វេងដើម្បីចម្លង UID',
      },
    ],
    packages: [
      { id: 'ff-100', label: '100 Diamonds', amount: 100, bonus: 10, priceUSD: 0.95, priceKHR: 3895 },
      { id: 'ff-310', label: '310 Diamonds', amount: 310, bonus: 35, priceUSD: 2.85, priceKHR: 11685, popular: true, badge: 'HOT' },
      { id: 'ff-520', label: '520 Diamonds', amount: 520, bonus: 55, priceUSD: 4.75, priceKHR: 19475 },
      { id: 'ff-1060', label: '1,060 Diamonds', amount: 1060, bonus: 120, priceUSD: 9.45, priceKHR: 38745, badge: 'TOP PICK' },
      { id: 'ff-2180', label: '2,180 Diamonds', amount: 2180, bonus: 240, priceUSD: 18.90, priceKHR: 77490 },
      { id: 'ff-weekly', label: 'Weekly Membership', amount: 450, bonus: 0, priceUSD: 1.90, priceKHR: 7790, badge: 'MEMBERSHIP' },
    ],
  },

  // 3. PUBG Mobile
  {
    id: '3',
    slug: 'pubg-mobile',
    name: 'PUBG Mobile',
    category: 'Battle Royale',
    categoryId: 'pubg',
    cover: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1920&q=85',
    currencyName: 'Unknown Cash (UC)',
    currencyIcon: '🪙',
    rating: 4.9,
    ordersToday: 15300,
    tags: ['Tencent', 'Royale Pass', 'Instant'],
    accountFields: [
      {
        id: 'playerId',
        label: 'Character ID',
        labelKh: 'Character ID (លេខតួអង្គ)',
        placeholder: 'e.g. 5123456789',
        placeholderKh: 'ឧទាហរណ៍ 5123456789',
        type: 'text',
        helperText: 'Tap your profile picture in-game to copy Character ID',
        helperTextKh: 'ចុចរូប Profile ក្នុងហ្គេមដើម្បីចម្លង Character ID',
      },
    ],
    packages: [
      { id: 'pubg-60', label: '60 UC', amount: 60, bonus: 0, priceUSD: 0.98, priceKHR: 4018 },
      { id: 'pubg-325', label: '300 + 25 UC', amount: 325, bonus: 25, priceUSD: 4.75, priceKHR: 19475, popular: true, badge: 'POPULAR' },
      { id: 'pubg-660', label: '600 + 60 UC (Royale Pass)', amount: 660, bonus: 60, priceUSD: 9.45, priceKHR: 38745, badge: 'ROYALE PASS' },
      { id: 'pubg-1800', label: '1,500 + 300 UC', amount: 1800, bonus: 300, priceUSD: 23.50, priceKHR: 96350 },
      { id: 'pubg-3850', label: '3,000 + 850 UC', amount: 3850, bonus: 850, priceUSD: 46.90, priceKHR: 192290 },
      { id: 'pubg-8100', label: '6,000 + 2,100 UC', amount: 8100, bonus: 2100, priceUSD: 92.50, priceKHR: 379250, badge: 'MYTHIC PACK' },
    ],
  },

  // 4. Roblox
  {
    id: '4',
    slug: 'roblox',
    name: 'Roblox (Robux Direct)',
    category: 'Metaverse / Sandbox',
    categoryId: 'roblox',
    cover: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=1920&q=85',
    currencyName: 'Robux Direct',
    currencyIcon: '⚡',
    rating: 4.9,
    ordersToday: 21670,
    tags: ['Roblox Corp', 'Blox Fruits', 'Instant Transfer'],
    accountFields: [
      {
        id: 'robloxUsername',
        label: 'Roblox Username',
        labelKh: 'ឈ្មោះគណនី Roblox Username',
        placeholder: 'e.g. ProGamer2026',
        placeholderKh: 'ឧទាហរណ៍ ProGamer2026',
        type: 'text',
        helperText: 'Your unique Roblox login username (not Display Name)',
        helperTextKh: 'ឈ្មោះពិតសម្រាប់ Login (មិនមែន Display Name ទេ)',
      },
    ],
    packages: [
      { id: 'rbx-80', label: '80 Robux', amount: 80, bonus: 0, priceUSD: 1.10, priceKHR: 4510 },
      { id: 'rbx-400', label: '400 Robux', amount: 400, bonus: 0, priceUSD: 4.80, priceKHR: 19680, popular: true, badge: 'HOT' },
      { id: 'rbx-800', label: '800 Robux', amount: 800, bonus: 40, priceUSD: 9.50, priceKHR: 38950, badge: 'BEST SELLER' },
      { id: 'rbx-1700', label: '1,700 Robux', amount: 1700, bonus: 100, priceUSD: 19.40, priceKHR: 79540 },
      { id: 'rbx-4500', label: '4,500 Robux', amount: 4500, bonus: 500, priceUSD: 48.00, priceKHR: 196800, badge: 'SUPER PACK' },
      { id: 'rbx-10000', label: '10,000 Robux', amount: 10000, bonus: 1200, priceUSD: 98.00, priceKHR: 401800 },
    ],
  },

  // 5. Genshin Impact
  {
    id: '5',
    slug: 'genshin-impact',
    name: 'Genshin Impact',
    category: 'Action RPG',
    categoryId: 'rpg-genshin',
    cover: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1920&q=85',
    currencyName: 'Genesis Crystals',
    currencyIcon: '💎',
    rating: 4.9,
    ordersToday: 9840,
    tags: ['HoYoverse', 'Welkin Moon', 'RPG'],
    accountFields: [
      {
        id: 'uid',
        label: 'Genshin UID',
        labelKh: 'Genshin UID (លេខសម្គាល់)',
        placeholder: 'e.g. 800123456',
        placeholderKh: 'ឧទាហរណ៍ 800123456',
        type: 'text',
        helperText: 'Visible at bottom right corner of the screen',
        helperTextKh: 'ឃើញនៅជ្រុងខាងក្រោមស្តាំនៃអេក្រង់ហ្គេម',
      },
      {
        id: 'server',
        label: 'Server Region',
        labelKh: 'តំបន់ Server',
        placeholder: 'Select Server',
        placeholderKh: 'ជ្រើសរើស Server',
        type: 'select',
        options: [
          { label: 'Asia (អាស៊ី)', value: 'os_asia' },
          { label: 'America (អាមេរិក)', value: 'os_usa' },
          { label: 'Europe (អឺរ៉ុប)', value: 'os_euro' },
          { label: 'TW/HK/MO', value: 'os_cht' },
        ],
      },
    ],
    packages: [
      { id: 'gi-welkin', label: 'Blessing of the Welkin Moon', amount: 3000, bonus: 300, priceUSD: 4.85, priceKHR: 19885, popular: true, badge: 'HOT DEAL' },
      { id: 'gi-60', label: '60 Genesis Crystals', amount: 60, bonus: 0, priceUSD: 0.95, priceKHR: 3895 },
      { id: 'gi-300', label: '300 + 30 Genesis Crystals', amount: 330, bonus: 30, priceUSD: 4.80, priceKHR: 19680 },
      { id: 'gi-980', label: '980 + 110 Genesis Crystals', amount: 1090, bonus: 110, priceUSD: 14.50, priceKHR: 59450 },
      { id: 'gi-1980', label: '1,980 + 260 Genesis Crystals', amount: 2240, bonus: 260, priceUSD: 28.90, priceKHR: 118490 },
      { id: 'gi-3280', label: '3,280 + 600 Genesis Crystals', amount: 3880, bonus: 600, priceUSD: 48.00, priceKHR: 196800 },
      { id: 'gi-6480', label: '6,480 + 1,600 Genesis Crystals', amount: 8080, bonus: 1600, priceUSD: 95.00, priceKHR: 389500, badge: 'MAX PACK' },
    ],
  },

  // 6. Valorant
  {
    id: '6',
    slug: 'valorant',
    name: 'Valorant',
    category: 'Tactical Shooter',
    categoryId: 'rpg-genshin',
    cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=85',
    currencyName: 'Valorant Points (VP)',
    currencyIcon: '🎯',
    rating: 4.9,
    ordersToday: 13240,
    tags: ['Riot Games', 'FPS', 'Instant Riot Code'],
    accountFields: [
      {
        id: 'riotId',
        label: 'Riot ID & Tagline',
        labelKh: 'Riot ID & Tagline (Name#TAG)',
        placeholder: 'e.g. TenZ#NA1',
        placeholderKh: 'ឧទាហរណ៍ TenZ#NA1',
        type: 'text',
        helperText: 'Your full Riot ID including the # and tag letters/numbers',
        helperTextKh: 'ឈ្មោះ Riot ID ពេញរួមទាំងសញ្ញា # និង Tag',
      },
    ],
    packages: [
      { id: 'val-475', label: '475 VP', amount: 475, bonus: 0, priceUSD: 4.85, priceKHR: 19885 },
      { id: 'val-1000', label: '1,000 VP', amount: 1000, bonus: 50, priceUSD: 9.75, priceKHR: 39975, popular: true, badge: 'POPULAR' },
      { id: 'val-2050', label: '2,050 VP', amount: 2050, bonus: 150, priceUSD: 19.50, priceKHR: 79950 },
      { id: 'val-3650', label: '3,650 VP', amount: 3650, bonus: 350, priceUSD: 34.00, priceKHR: 139400, badge: 'BUNDLE VALUE' },
      { id: 'val-5350', label: '5,350 VP', amount: 5350, bonus: 600, priceUSD: 48.50, priceKHR: 198850 },
      { id: 'val-11000', label: '11,000 VP', amount: 11000, bonus: 1500, priceUSD: 96.00, priceKHR: 393600, badge: 'VIP' },
    ],
  },

  // 7. Honor of Kings
  {
    id: '7',
    slug: 'honor-of-kings',
    name: 'Honor of Kings',
    category: 'MOBA',
    categoryId: 'rpg-genshin',
    cover: 'https://images.unsplash.com/photo-1612287233207-6b22998a445b?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1612287233207-6b22998a445b?auto=format&fit=crop&w=1920&q=85',
    currencyName: 'Tokens',
    currencyIcon: '👑',
    rating: 4.8,
    ordersToday: 11200,
    tags: ['Level Infinite', 'MOBA', 'Instant Direct'],
    accountFields: [
      {
        id: 'playerId',
        label: 'Player ID (UID)',
        labelKh: 'Player ID (លេខសម្គាល់)',
        placeholder: 'e.g. 8899112233',
        placeholderKh: 'ឧទាហរណ៍ 8899112233',
        type: 'text',
        helperText: 'Find in your profile settings in-game',
        helperTextKh: 'រកក្នុង Profile Settings ក្នុងហ្គេម',
      },
    ],
    packages: [
      { id: 'hok-80', label: '80 Tokens', amount: 80, bonus: 0, priceUSD: 0.99, priceKHR: 4059 },
      { id: 'hok-240', label: '240 + 17 Tokens', amount: 257, bonus: 17, priceUSD: 2.95, priceKHR: 12095 },
      { id: 'hok-400', label: '400 + 32 Tokens', amount: 432, bonus: 32, priceUSD: 4.85, priceKHR: 19885, popular: true, badge: 'HOT' },
      { id: 'hok-800', label: '800 + 85 Tokens', amount: 885, bonus: 85, priceUSD: 9.60, priceKHR: 39360 },
      { id: 'hok-1200', label: '1,200 + 155 Tokens', amount: 1355, bonus: 155, priceUSD: 14.40, priceKHR: 59040 },
      { id: 'hok-4000', label: '4,000 + 600 Tokens', amount: 4600, bonus: 600, priceUSD: 47.90, priceKHR: 196390, badge: 'WHALE' },
    ],
  },

  // 8. Call of Duty Mobile (CODM)
  {
    id: '8',
    slug: 'codm',
    name: 'Call of Duty: Mobile (CODM)',
    category: 'Shooter',
    categoryId: 'shooter',
    cover: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1920&q=85',
    currencyName: 'COD Points (CP)',
    currencyIcon: '⚡',
    rating: 4.8,
    ordersToday: 7650,
    tags: ['Activision', 'Garena', 'Shooter'],
    accountFields: [
      {
        id: 'uid',
        label: 'OpenID / UID',
        labelKh: 'OpenID / UID',
        placeholder: 'e.g. 67489201928374',
        placeholderKh: 'ឧទាហរណ៍ 67489201928374',
        type: 'text',
        helperText: 'Found under Settings > Legal and Privacy > OpenID',
        helperTextKh: 'រកក្នុង Settings > Legal and Privacy > OpenID',
      },
    ],
    packages: [
      { id: 'codm-80', label: '80 CP', amount: 80, bonus: 0, priceUSD: 0.98, priceKHR: 4018 },
      { id: 'codm-420', label: '400 + 20 CP', amount: 420, bonus: 20, priceUSD: 4.85, priceKHR: 19885, popular: true, badge: 'BATTLE PASS' },
      { id: 'codm-880', label: '800 + 80 CP', amount: 880, bonus: 80, priceUSD: 9.60, priceKHR: 39360 },
      { id: 'codm-2400', label: '2,000 + 400 CP', amount: 2400, bonus: 400, priceUSD: 24.00, priceKHR: 98400 },
      { id: 'codm-5000', label: '4,000 + 1,000 CP', amount: 5000, bonus: 1000, priceUSD: 48.00, priceKHR: 196800, badge: 'LEGENDARY' },
    ],
  },

  // 9. League of Legends: Wild Rift
  {
    id: '9',
    slug: 'wild-rift',
    name: 'League of Legends: Wild Rift',
    category: 'MOBA',
    categoryId: 'shooter',
    cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=85',
    currencyName: 'Wild Cores',
    currencyIcon: '💎',
    rating: 4.8,
    ordersToday: 6540,
    tags: ['Riot Games', 'MOBA', 'Direct Top-Up'],
    accountFields: [
      {
        id: 'riotId',
        label: 'Riot ID (Name#TAG)',
        labelKh: 'Riot ID (ឈ្មោះ#TAG)',
        placeholder: 'e.g. YasuoKing#KH1',
        placeholderKh: 'ឧទាហរណ៍ YasuoKing#KH1',
        type: 'text',
        helperText: 'Your Riot ID visible under profile icon',
        helperTextKh: 'ឈ្មោះ Riot ID របស់អ្នក',
      },
    ],
    packages: [
      { id: 'wr-425', label: '425 Wild Cores', amount: 425, bonus: 0, priceUSD: 4.40, priceKHR: 18040 },
      { id: 'wr-975', label: '975 + 25 Wild Cores', amount: 1000, bonus: 25, priceUSD: 9.80, priceKHR: 40180, popular: true, badge: 'WILD PASS' },
      { id: 'wr-2050', label: '2,050 + 100 Wild Cores', amount: 2150, bonus: 100, priceUSD: 19.50, priceKHR: 79950 },
      { id: 'wr-5350', label: '5,350 + 400 Wild Cores', amount: 5750, bonus: 400, priceUSD: 48.50, priceKHR: 198850, badge: 'VALUED' },
    ],
  },

  // 10. Blood Strike
  {
    id: '10',
    slug: 'blood-strike',
    name: 'Blood Strike',
    category: 'FPS / Battle Royale',
    categoryId: 'shooter',
    cover: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1920&q=85',
    currencyName: 'Gold',
    currencyIcon: '🪙',
    rating: 4.7,
    ordersToday: 8900,
    tags: ['NetEase', 'Battle Royale', 'Fast Gold'],
    accountFields: [
      {
        id: 'uid',
        label: 'User ID (UID)',
        labelKh: 'User ID (លេខសម្គាល់)',
        placeholder: 'e.g. 10928374',
        placeholderKh: 'ឧទាហរណ៍ 10928374',
        type: 'text',
        helperText: 'Tap on your avatar on the main lobby to copy your UID',
        helperTextKh: 'ចុចលើ Avatar នៅ Lobby ដើម្បីចម្លង UID',
      },
    ],
    packages: [
      { id: 'bs-100', label: '100 Gold', amount: 100, bonus: 0, priceUSD: 0.95, priceKHR: 3895 },
      { id: 'bs-310', label: '300 + 20 Gold', amount: 320, bonus: 20, priceUSD: 2.85, priceKHR: 11685 },
      { id: 'bs-530', label: '500 + 50 Gold', amount: 550, bonus: 50, priceUSD: 4.75, priceKHR: 19475, popular: true, badge: 'STRIKE PASS' },
      { id: 'bs-1080', label: '1,000 + 120 Gold', amount: 1120, bonus: 120, priceUSD: 9.40, priceKHR: 38540 },
      { id: 'bs-2200', label: '2,000 + 280 Gold', amount: 2280, bonus: 280, priceUSD: 18.80, priceKHR: 77080, badge: 'HOT' },
    ],
  },
];

