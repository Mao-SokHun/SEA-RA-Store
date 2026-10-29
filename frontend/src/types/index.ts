export type UserRole = 'buyer' | 'seller' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'locked';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  referralCode?: string;
  twoFactorEnabled?: boolean;
  wallet?: {
    id: string;
    balance: number | string;
  };
  sellerProfile?: {
    reputationScore: number;
    totalSales: number;
    successRate: number;
    verifiedBonds: number;
  };
  createdAt: string;
}

export interface Game {
  id: string;
  title: string;
  slug?: string;
  platform: 'mobile' | 'pc' | 'console' | 'crossplay';
  iconUrl?: string;
  coverUrl?: string;
  isActive: boolean;
  _count?: {
    accounts?: number;
  };
}

export type BindHealth = 'clean' | 'changeable' | 'unchangeable';
export type ListingStatus = 'available' | 'reserved' | 'sold' | 'suspended';

export interface GameAccountBind {
  id: string;
  provider: string; // 'moonton' | 'google' | 'facebook' | 'apple' | 'riot' | 'steam'
  bindType: BindHealth;
  notes?: string;
}

export interface AccountImage {
  id: string;
  imageUrl: string;
  isCover: boolean;
  caption?: string;
}

export interface GameAccount {
  id: string;
  gameId: string;
  sellerId: string;
  title: string;
  description?: string;
  price: number;
  originalPrice?: number;
  tierRank: string;
  serverRegion: string;
  status: ListingStatus;
  deliveryType: 'instant' | 'manual';
  escrowScore?: number;
  firstMailIncluded?: boolean;
  warrantyPackage?: 'none' | '7_days' | '30_days' | 'lifetime';
  game?: Game;
  seller?: {
    id: string;
    username: string;
    reputationScore?: number;
    sellerOrdersCount?: number;
  };
  binds?: GameAccountBind[];
  images?: AccountImage[];
  createdAt: string;
  reservedUntil?: string | null;
}

export type OrderStatus =
  | 'pending'
  | 'in_escrow'
  | 'inspection'
  | 'completed'
  | 'cancelled'
  | 'in_dispute'
  | 'refunded';

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  sellerId: string;
  gameAccountId: string;
  totalAmount: number;
  platformFee: number;
  sellerNetAmount: number;
  status: OrderStatus;
  deliveryType: 'instant' | 'manual';
  paymentMethod?: string;
  listingSnapshot?: {
    title: string;
    gameTitle: string;
    tierRank: string;
    serverRegion: string;
    price: number;
    coverImage?: string;
  };
  gameAccount?: GameAccount;
  buyer?: {
    id: string;
    username: string;
  };
  seller?: {
    id: string;
    username: string;
  };
  inspectionExpiresAt?: string;
  createdAt: string;
  completedAt?: string;
}

export interface DecryptedCredentials {
  loginIdentifier: string;
  password: string;
  twoFactorSecret?: string;
  recoveryEmail?: string;
  recoveryEmailPassword?: string;
  additionalNotes?: string;
}

export interface KHQRPaymentData {
  orderNumber: string;
  amount: number;
  currency: string;
  qrString: string;
  qrImage: string;
  md5Hash: string;
  expiresAt: string;
}

export interface WalletTransaction {
  id: string;
  transactionType: 'credit' | 'debit' | 'commission' | 'withdrawal' | 'refund' | 'escrow_hold' | 'escrow_release';
  amount: number;
  balanceAfter: number;
  orderId?: string;
  orderNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface Wallet {
  id: string;
  balance: number;
  pendingEscrowBalance?: number;
  transactions?: WalletTransaction[];
}

export interface WithdrawalRequest {
  id: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  adminNotes?: string;
  createdAt: string;
}

export interface Dispute {
  id: string;
  orderId: string;
  orderNumber?: string;
  raisedBy: 'buyer' | 'seller';
  reason: string;
  evidenceUrls?: string[];
  status: 'opened' | 'under_review' | 'resolved_refund_buyer' | 'resolved_payout_seller' | 'dismissed';
  adminNotes?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  orderNumber: string;
  senderId: string;
  senderUsername: string;
  senderRole: 'buyer' | 'seller' | 'admin' | 'system';
  content: string;
  attachmentUrl?: string;
  createdAt: string;
}

// -------------------------------------------------------------
// TOP-UP TYPES
// -------------------------------------------------------------
export interface TopUpInputConfig {
  key: string;
  label: string;
  labelKh: string;
  placeholder: string;
  type: 'text' | 'number' | 'select';
  options?: string[];
  required: boolean;
  helpText?: string;
  helpTextKh?: string;
}

export interface TopUpGame {
  id: string;
  title: string;
  platform: string;
  iconUrl?: string;
  packageCount?: number;
  currencyName?: string;
  currencyNameKh?: string;
  currencyIcon?: string;
  inputConfig?: TopUpInputConfig[];
  guideTitle?: string;
  guideTitleKh?: string;
  guideDescription?: string;
  guideDescriptionKh?: string;
}

export interface TopUpPackage {
  id: string;
  name: string;
  category: string;
  currencyAmount: number;
  bonusAmount: number;
  price: number;
  originalPrice?: number | null;
  badge?: string;
  sortOrder: number;
}

export interface TopUpGameDetails extends TopUpGame {
  packages: TopUpPackage[];
}

export interface TopUpPlayerVerifyResult {
  isValid: boolean;
  playerId: string;
  zoneId?: string | null;
  serverRegion?: string | null;
  nickname: string;
  message: string;
}

export interface CreateTopUpOrderPayload {
  gameId: string;
  packageId: string;
  playerId: string;
  zoneId?: string;
  serverRegion?: string;
  playerNickname?: string;
  contactPhone?: string;
  contactEmail?: string;
  paymentMethod: 'bakong_khqr' | 'wallet';
}

export interface TopUpOrder {
  orderNumber: string;
  status: 'pending' | 'completed' | 'failed';
  paymentStatus: 'pending' | 'paid' | 'failed';
  deliveryStatus: 'pending' | 'processing' | 'completed' | 'failed';
  gameTitle: string;
  gameIcon?: string;
  packageName: string;
  packageCategory?: string;
  currencyAmount?: number;
  totalAmount: number;
  playerId: string;
  zoneId?: string | null;
  serverRegion?: string | null;
  playerNickname?: string;
  paymentMethod: 'bakong_khqr' | 'wallet';
  deliveryProof?: string;
  qrString?: string;
  qrImage?: string;
  deepLink?: string;
  expiresInSeconds?: number;
  remainingWalletBalance?: number;
  createdAt?: string;
  updatedAt?: string;
}

