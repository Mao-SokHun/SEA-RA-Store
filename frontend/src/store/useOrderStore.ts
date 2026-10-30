import { create } from 'zustand';
import { GAMES, GameItem, GamePackage } from '@/data/games';
import { Language } from '@/i18n/translations';
import confetti from 'canvas-confetti';

export interface ActiveOrder {
  orderNumber: string;
  game: GameItem;
  package: GamePackage;
  accountData: Record<string, string>;
  playerNickname: string;
  paymentMethodId: string;
  totalUSD: number;
  totalKHR: number;
  status: 'pending' | 'paid' | 'processing' | 'delivered';
  qrCodeUrl: string;
  createdAt: string;
}

interface OrderStore {
  // Localization
  language: Language;
  setLanguage: (lang: Language) => void;

  // Filter & Search
  selectedCategoryId: string;
  setSelectedCategoryId: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Top-Up Cockpit Modal State
  isModalOpen: boolean;
  activeGame: GameItem | null;
  activePackage: GamePackage | null;
  accountData: Record<string, string>;
  isVerifying: boolean;
  verifiedNickname: string | null;
  verificationError: string | null;
  paymentMethodId: string;
  contactInfo: string;
  promoCode: string;
  promoDiscountPercent: number;
  promoMessage: string | null;

  // Actions
  openTopUp: (gameIdOrSlug: string, packageId?: string) => void;
  closeTopUp: () => void;
  setActivePackage: (pkg: GamePackage) => void;
  setAccountField: (fieldId: string, value: string) => void;
  verifyPlayerId: () => Promise<void>;
  setPaymentMethodId: (methodId: string) => void;
  setContactInfo: (contact: string) => void;
  setPromoCode: (code: string) => void;
  applyPromoCode: () => void;

  // Order Placement & QR State
  currentOrder: ActiveOrder | null;
  isSubmitting: boolean;
  isSimulating: boolean;
  showSuccessModal: boolean;
  submitOrder: () => void;
  simulatePaymentSuccess: () => void;
  closeSuccessModal: () => void;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  language: 'km',
  setLanguage: (language) => set({ language }),

  selectedCategoryId: 'all',
  setSelectedCategoryId: (selectedCategoryId) => set({ selectedCategoryId }),

  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  isModalOpen: false,
  activeGame: null,
  activePackage: null,
  accountData: {},
  isVerifying: false,
  verifiedNickname: null,
  verificationError: null,
  paymentMethodId: 'bakong_khqr',
  contactInfo: '',
  promoCode: '',
  promoDiscountPercent: 0,
  promoMessage: null,

  currentOrder: null,
  isSubmitting: false,
  isSimulating: false,
  showSuccessModal: false,

  openTopUp: (gameIdOrSlug, packageId) => {
    const game =
      GAMES.find((g) => g.id === gameIdOrSlug || g.slug === gameIdOrSlug) ||
      GAMES[0];

    const pkg =
      (packageId && game.packages.find((p) => p.id === packageId)) ||
      game.packages[0];

    // Seed mock account field defaults if available
    const initialAccount: Record<string, string> = {};
    game.accountFields.forEach((f) => {
      initialAccount[f.id] = f.id === 'server' && f.options ? f.options[0].value : '';
    });

    set({
      isModalOpen: true,
      activeGame: game,
      activePackage: pkg,
      accountData: initialAccount,
      verifiedNickname: null,
      verificationError: null,
      isVerifying: false,
      paymentMethodId: 'bakong_khqr',
      promoCode: '',
      promoDiscountPercent: 0,
      promoMessage: null,
    });
  },

  closeTopUp: () => {
    set({ isModalOpen: false });
  },

  setActivePackage: (activePackage) => set({ activePackage }),

  setAccountField: (fieldId, value) => {
    set((state) => ({
      accountData: { ...state.accountData, [fieldId]: value },
      verifiedNickname: null, // Reset verification when ID changes
      verificationError: null,
    }));
  },

  verifyPlayerId: async () => {
    const { activeGame, accountData } = get();
    if (!activeGame) return;

    const primaryField = activeGame.accountFields[0];
    const val = accountData[primaryField.id];

    if (!val || val.trim().length < 3) {
      set({
        verificationError:
          get().language === 'km'
            ? 'សូមបញ្ចូលលេខសម្គាល់គណនីឱ្យបានត្រឹមត្រូវ'
            : 'Please enter a valid account ID',
      });
      return;
    }

    set({ isVerifying: true, verificationError: null, verifiedNickname: null });

    // Mock API verification check with simulated network delay
    await new Promise((r) => setTimeout(r, 600));

    // Curated dynamic nickname generation based on game
    const nicknames: Record<string, string[]> = {
      '1': ['Slayer_ProKH', 'MythicGlory99', 'Vireak_Assassin', 'ShadowKing'],
      '2': ['FF_Headhunter', 'BooyahMaster', 'GarenaSniper'],
      '3': ['PUBG_Conqueror', 'ChickenDinner_KH', 'AWM_Demon'],
      '4': ['BloxFruits_Yoru', 'RobuxTycoon', 'MetaverseHero'],
      '5': ['Traveler_Teyvat', 'ZhongliShield', 'Arlecchino_Main'],
      '6': ['TenZ_Fan_KH', 'JettDuelist', 'RadiantViper'],
    };

    const pool = nicknames[activeGame.id] || ['GameVerse_VIP', 'Champion_KH', 'CyberNinja'];
    const chosen = pool[Math.floor(Math.random() * pool.length)];

    set({
      isVerifying: false,
      verifiedNickname: `${chosen} ✓`,
      verificationError: null,
    });
  },

  setPaymentMethodId: (paymentMethodId) => set({ paymentMethodId }),

  setContactInfo: (contactInfo) => set({ contactInfo }),

  setPromoCode: (promoCode) => set({ promoCode }),

  applyPromoCode: () => {
    const code = get().promoCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'SEARAVIP' || code === 'GAMEVERSE' || code === 'PROMO10') {
      set({
        promoDiscountPercent: 10,
        promoMessage:
          get().language === 'km'
            ? '✓ បានបញ្ចុះតម្លៃ 10% ជោគជ័យ!'
            : '✓ Promo Code applied! 10% OFF discount.',
      });
    } else {
      set({
        promoDiscountPercent: 0,
        promoMessage:
          get().language === 'km'
            ? '✕ កូដមិនត្រឹមត្រូវ ឬផុតកំណត់'
            : '✕ Invalid or expired promo code',
      });
    }
  },

  submitOrder: () => {
    const { activeGame, activePackage, accountData, verifiedNickname, paymentMethodId, promoDiscountPercent } = get();
    if (!activeGame || !activePackage) return;

    const discountMultiplier = (100 - promoDiscountPercent) / 100;
    const finalUSD = Number((activePackage.priceUSD * discountMultiplier).toFixed(2));
    const finalKHR = Math.round(activePackage.priceKHR * discountMultiplier);

    const orderNum = `GV-${Math.floor(100000 + Math.random() * 900000)}`;

    const order: ActiveOrder = {
      orderNumber: orderNum,
      game: activeGame,
      package: activePackage,
      accountData,
      playerNickname: verifiedNickname || accountData[activeGame.accountFields[0].id] || 'Guest',
      paymentMethodId,
      totalUSD: finalUSD,
      totalKHR: finalKHR,
      status: 'pending',
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=KHQR-${orderNum}-USD-${finalUSD}`,
      createdAt: new Date().toISOString(),
    };

    set({
      currentOrder: order,
      isModalOpen: false,
      showSuccessModal: true,
    });
  },

  simulatePaymentSuccess: () => {
    const { currentOrder } = get();
    if (!currentOrder) return;

    set({ isSimulating: true });

    setTimeout(() => {
      set({
        isSimulating: false,
        currentOrder: {
          ...currentOrder,
          status: 'paid',
        },
      });

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    }, 1200);
  },

  closeSuccessModal: () => {
    set({ showSuccessModal: false });
  },
}));
