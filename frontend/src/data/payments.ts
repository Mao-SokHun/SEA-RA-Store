export interface PaymentMethod {
  id: string;
  name: string;
  nameKh: string;
  tag: string;
  tagKh: string;
  badge: string;
  badgeColor: string;
  iconBg: string;
  iconColor: string;
  type: 'qr' | 'direct' | 'crypto';
  feePercent: number;
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'bakong_khqr',
    name: 'Bakong KHQR (National QR)',
    nameKh: 'Bakong KHQR (គ្រប់ធនាគារក្នុងស្រុក)',
    tag: 'ABA, Wing, ACLEDA, Canadia, Chip Mong',
    tagKh: 'ស្កេនទូទាត់ភ្លាមៗតាម Mobile Banking គ្រប់ App',
    badge: '0% FEE',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    iconBg: 'bg-red-600/20 border border-red-500/40',
    iconColor: 'text-red-400',
    type: 'qr',
    feePercent: 0,
  },
  {
    id: 'aba_pay',
    name: 'ABA PAY Direct',
    nameKh: 'ABA PAY Direct',
    tag: 'Instant 1-Tap Mobile Redirect',
    tagKh: 'ទូទាត់ផ្ទាល់តាម ABA Mobile App',
    badge: 'INSTANT',
    badgeColor: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30',
    iconBg: 'bg-cyan-600/20 border border-cyan-500/40',
    iconColor: 'text-cyan-400',
    type: 'direct',
    feePercent: 0,
  },
  {
    id: 'wing_pay',
    name: 'Wing Bank / WingPay',
    nameKh: 'Wing Bank / WingPay',
    tag: 'Wing Bank App & Agent QR',
    tagKh: 'ទូទាត់រហ័សតាម Wing App',
    badge: 'FAST',
    badgeColor: 'bg-lime-500/15 text-lime-400 border border-lime-500/30',
    iconBg: 'bg-lime-600/20 border border-lime-500/40',
    iconColor: 'text-lime-400',
    type: 'direct',
    feePercent: 0,
  },
  {
    id: 'acleda_toanchet',
    name: 'ACLEDA ToanChet',
    nameKh: 'អេស៊ីលីដាទាន់ចិត្ត (ACLEDA)',
    tag: 'ACLEDA Bank Plc. Direct Gateway',
    tagKh: 'គណនីអេស៊ីលីដាផ្លូវការ',
    badge: 'SECURE',
    badgeColor: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    iconBg: 'bg-blue-600/20 border border-blue-500/40',
    iconColor: 'text-blue-400',
    type: 'direct',
    feePercent: 0,
  },
  {
    id: 'usdt_trc20',
    name: 'USDT (TRC-20 / TON)',
    nameKh: 'USDT (TRC-20 / TON Crypto)',
    tag: 'Binance, Telegram Wallet, Bybit',
    tagKh: 'ទូទាត់តាម Crypto ដោយស្វ័យប្រវត្តិ',
    badge: 'WEB3',
    badgeColor: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    iconBg: 'bg-emerald-600/20 border border-emerald-500/40',
    iconColor: 'text-emerald-400',
    type: 'crypto',
    feePercent: 0,
  },
];

