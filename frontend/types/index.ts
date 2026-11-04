export type GameCategory = 'all' | 'mobile' | 'pc' | 'gift-card' | 'direct';

export interface GamePackage {
  id: string;
  name: string;
  amount: number;
  bonus?: number;
  priceUSD: number;
  priceKHR: number;
  popular?: boolean;
  badge?: string;
  badgeColor?: string;
}

export interface GameItem {
  id: string;
  name: string;
  slug: string;
  category: GameCategory;
  genre: string;
  rating: number;
  reviewsCount: string;
  badge?: string;
  badgeType?: 'hot' | 'official' | 'instant' | 'bonus';
  banner: string;
  poster: string;
  currencyName: string;
  currencyIcon: string;
  developer: string;
  requiresZoneId: boolean;
  zonePlaceholder?: string;
  packages: GamePackage[];
}

export interface PaymentMethod {
  id: string;
  name: string;
  category: 'khqr' | 'card' | 'crypto' | 'wallet';
  subText: string;
  feeText: string;
  iconType: 'bakong' | 'aba' | 'wing' | 'acleda' | 'visa' | 'crypto';
  popular?: boolean;
  badge?: string;
}

export interface LiveTransaction {
  id: string;
  userMasked: string;
  gameName: string;
  gameIcon: string;
  amountText: string;
  timeAgo: string;
}

export type OrderStatus = 'validating' | 'pending_payment' | 'processing' | 'delivered' | 'failed';

export interface OrderInvoice {
  orderId: string;
  game: GameItem;
  userId: string;
  zoneId?: string;
  verifiedIgn?: string;
  package: GamePackage;
  paymentMethod: PaymentMethod;
  amountUSD: number;
  amountKHR: number;
  status: OrderStatus;
  timestamp: string;
  qrPayload?: string;
}
