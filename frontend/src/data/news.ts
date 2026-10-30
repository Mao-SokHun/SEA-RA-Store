export interface NewsItem {
  id: string;
  tag: string;
  tagColor: string;
  date: string;
  title: string;
  titleKh: string;
  summary: string;
  summaryKh: string;
  image: string;
  gameId?: string;
}

export interface DealItem {
  id: string;
  gameId: string;
  title: string;
  subtitle: string;
  badge: string;
  priceUSD: number;
  originalPriceUSD: number;
  image: string;
}

export interface LiveOrderTicker {
  id: string;
  maskedUser: string;
  gameName: string;
  packageName: string;
  amountUSD: number;
  timeAgo: string;
  timeAgoKh: string;
  avatar: string;
}

export interface TopBuyer {
  rank: number;
  name: string;
  totalSpentUSD: number;
  points: string;
  avatar: string;
  badge: string;
}

export const PROMOTIONS_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    tag: 'SUMMER SALE',
    tagColor: 'bg-[#22D3EE] text-black',
    date: '05. 23. 2026',
    title: 'GameVerse Mega Summer Top-Up Sale!',
    titleKh: 'ប្រូម៉ូសិនរដូវក្តៅ GameVerse Mega Top-Up!',
    summary: 'Get up to 40% bonus diamonds & robux on all verified Bakong KHQR instant reloads.',
    summaryKh: 'ទទួលបាន Bonus ពេជ្រ និង Robux រហូតដល់ 40% លើការបញ្ចូលលុយតាម Bakong KHQR គ្រប់ធនាគារ។',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    gameId: '1',
  },
  {
    id: 'news-2',
    tag: 'ESPORTS SEASON',
    tagColor: 'bg-[#FF7A18] text-white',
    date: '05. 20. 2026',
    title: 'MPL & PMGC Championship Bonus Active',
    titleKh: 'រដូវកាលប្រកួត MPL & PMGC បើកប្រាក់រង្វាន់ពិសេស',
    summary: 'Exclusive in-game items, avatar frames and 10% instant cashback for top supporters.',
    summaryKh: 'កាដូរពិសេសក្នុងហ្គេម ស៊ុម Avatar និង Cashback 10% ភ្លាមៗសម្រាប់អ្នកគាំទ្រទាំងអស់។',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
    gameId: '3',
  },
  {
    id: 'news-3',
    tag: 'UPDATE 1.3',
    tagColor: 'bg-[#3B82F6] text-white',
    date: '05. 15. 2026',
    title: 'Moonton & Garena Server API Optimization',
    titleKh: 'ការអាប់ដេតបង្កើនល្បឿន API Moonton & Garena',
    summary: 'Direct publisher API reload speed upgraded to under 3 seconds with 100% guarantee.',
    summaryKh: 'ល្បឿនបញ្ចូលស្វ័យប្រវត្តិតាម Direct API ត្រូវបានបង្កើនល្បឿនត្រឹមក្រោម 3 វិនាទី និងធានា ១០០%។',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
    gameId: '2',
  },
];

export const STORE_DEALS: DealItem[] = [
  {
    id: 'deal-1',
    gameId: '1',
    title: 'Mobile Legends Pass',
    subtitle: 'Moonton Official',
    badge: '35% OFF',
    priceUSD: 1.85,
    originalPriceUSD: 2.50,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'deal-2',
    gameId: '4',
    title: 'Roblox 800 Robux',
    subtitle: 'Roblox Direct',
    badge: 'HOT DEAL',
    priceUSD: 7.50,
    originalPriceUSD: 9.99,
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=400&q=80',
  },
];

export const LIVE_ORDERS_TICKER: LiveOrderTicker[] = [
  {
    id: 'ord-101',
    maskedUser: '098***432',
    gameName: 'Mobile Legends',
    packageName: 'Weekly Diamond Pass',
    amountUSD: 1.85,
    timeAgo: '8s ago',
    timeAgoKh: '8 វិនាទីមុន',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
  },
  {
    id: 'ord-102',
    maskedUser: '012***891',
    gameName: 'Roblox',
    packageName: '800 Robux Direct',
    amountUSD: 9.50,
    timeAgo: '24s ago',
    timeAgoKh: '24 វិនាទីមុន',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100',
  },
  {
    id: 'ord-103',
    maskedUser: '088***765',
    gameName: 'PUBG Mobile',
    packageName: '660 UC Royale Pass',
    amountUSD: 9.45,
    timeAgo: '42s ago',
    timeAgoKh: '42 វិនាទីមុន',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100',
  },
  {
    id: 'ord-104',
    maskedUser: '096***334',
    gameName: 'Free Fire',
    packageName: '520 Diamonds',
    amountUSD: 4.75,
    timeAgo: '1m ago',
    timeAgoKh: '1 នាទីមុន',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100',
  },
  {
    id: 'ord-105',
    maskedUser: '070***221',
    gameName: 'Valorant',
    packageName: '1,000 VP Code',
    amountUSD: 9.75,
    timeAgo: '2m ago',
    timeAgoKh: '2 នាទីមុន',
    avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=100',
  },
];

export const TOP_BUYERS: TopBuyer[] = [
  {
    rank: 1,
    name: 'GhostRunner',
    totalSpentUSD: 1845.50,
    points: '5.6K pts',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
    badge: '👑 CHAMPION',
  },
  {
    rank: 2,
    name: 'SovanVireak',
    totalSpentUSD: 980.20,
    points: '950 pts',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
    badge: '🔥 MASTER',
  },
  {
    rank: 3,
    name: 'Kiyo_ML',
    totalSpentUSD: 850.00,
    points: '850 pts',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120',
    badge: '💎 DIAMOND',
  },
  {
    rank: 4,
    name: 'StormGamer',
    totalSpentUSD: 720.40,
    points: '720 pts',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120',
    badge: '⚡ ELITE',
  },
  {
    rank: 5,
    name: 'Jerry_KH',
    totalSpentUSD: 590.00,
    points: '590 pts',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120',
    badge: '⭐ VIP',
  },
];
