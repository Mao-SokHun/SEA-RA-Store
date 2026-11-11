export type Language = 'km' | 'en';
export type Currency = 'USD' | 'KHR';

export interface AccountField {
  id: string;
  label: string;
  labelKh: string;
  placeholder: string;
  placeholderKh: string;
  type: 'text' | 'number' | 'select';
  options?: { label: string; value: string }[];
  helperText?: string;
  helperTextKh?: string;
  required: boolean;
}

export interface PackageItem {
  id: string;
  name: string;
  currencyAmount: number;
  bonusAmount: number;
  priceUSD: number;
  priceKHR: number;
  originalPriceUSD?: number;
  badge?: string;
  popular?: boolean;
}

export interface GameItem {
  id: string;
  slug: string;
  name: string;
  nameKh?: string;
  publisher: string;
  category: 'moba' | 'battle-royale' | 'rpg' | 'shooter';
  categoryLabel: string;
  categoryLabelKh: string;
  coverImage: string;
  bannerImage: string;
  currencyName: string;
  currencyIcon: string;
  rating: number;
  ordersToday: number;
  tags: string[];
  accountFields: AccountField[];
  packages: PackageItem[];
  guideTitle: string;
  guideTitleKh: string;
  guideDescription: string;
  guideDescriptionKh: string;
}

export interface PaymentChannel {
  id: string;
  name: string;
  nameKh: string;
  subtitle: string;
  subtitleKh: string;
  badge?: string;
  badgeColor?: string;
  logo: string;
  type: 'khqr' | 'bank' | 'wallet' | 'crypto';
  fee: string;
  isPopular?: boolean;
  disabled?: boolean;
}

export interface TopUpOrder {
  orderNumber: string;
  game: GameItem;
  package: PackageItem;
  accountDetails: Record<string, string>;
  playerNickname: string;
  paymentMethod: string;
  totalUSD: number;
  totalKHR: number;
  status: 'pending' | 'processing' | 'completed';
  qrString?: string;
  qrCodeUrl?: string;
  deepLink?: string;
  createdAt: string;
  completedAt?: string;
  deliveryProof?: string;
}

export interface LiveActivityItem {
  id: string;
  maskedId: string;
  gameName: string;
  packageName: string;
  amountUSD: number;
  timeAgo: string;
  timeAgoKh: string;
  avatar: string;
}
