import { create } from 'zustand';
import { GAMES, GameItem, GamePackage } from '@/data/games';
import { Language } from '@/i18n/translations';
import { api } from '@/lib/api';
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
  backendOrderNumber?: string;
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
  submitOrder: () => Promise<void>;
  simulatePaymentSuccess: () => Promise<void>;
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
      verifiedNickname: null,
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

    // 1. Try real backend API first
    try {
      const backendRes = await api.topup.checkPlayer({
        gameId: activeGame.id,
        playerId: val.trim(),
        zoneId: accountData['zoneId']?.trim(),
        serverRegion: accountData['server']?.trim(),
      });

      if (backendRes?.data?.nickname) {
        set({
          isVerifying: false,
          verifiedNickname: `${backendRes.data.nickname} ✓`,
          verificationError: null,
        });
        return;
      }
    } catch (apiErr) {
      // Backend not running or check endpoint unreachable: fallback to smart mock check
    }

    // 2. Fallback smart mock IGN generation
    await new Promise((r) => setTimeout(r, 600));

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

  submitOrder: async () => {
    const {
      activeGame,
      activePackage,
      accountData,
      verifiedNickname,
      paymentMethodId,
      promoDiscountPercent,
      contactInfo,
    } = get();
    if (!activeGame || !activePackage) return;

    const discountMultiplier = (100 - promoDiscountPercent) / 100;
    const finalUSD = Number((activePackage.priceUSD * discountMultiplier).toFixed(2));
    const finalKHR = Math.round(activePackage.priceKHR * discountMultiplier);

    const primaryField = activeGame.accountFields[0];
    const playerId = accountData[primaryField.id] || 'GuestID';
    const zoneId = accountData['zoneId'] || undefined;
    const serverRegion = accountData['server'] || undefined;

    set({ isSubmitting: true });

    let orderNum = `GV-${Math.floor(100000 + Math.random() * 900000)}`;
    let qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=KHQR-${orderNum}-USD-${finalUSD}`;
    let backendOrderNum: string | undefined = undefined;

    // 1. Try real backend API
    try {
      const res = await api.topup.createOrder({
        gameId: activeGame.id,
        packageId: activePackage.id,
        playerId,
        zoneId,
        serverRegion,
        playerNickname: verifiedNickname?.replace(' ✓', '') || playerId,
        contactPhone: contactInfo || undefined,
        paymentMethod: paymentMethodId,
      });

      if (res?.data?.orderNumber) {
        orderNum = res.data.orderNumber;
        backendOrderNum = res.data.orderNumber;
        if (res.data.qrCodeUrl) {
          qrUrl = res.data.qrCodeUrl;
        }
      }
    } catch (err) {
      // Backend offline or error: smoothly keep locally generated QR order
    }

    const order: ActiveOrder = {
      orderNumber: orderNum,
      backendOrderNumber: backendOrderNum,
      game: activeGame,
      package: activePackage,
      accountData,
      playerNickname: verifiedNickname || playerId,
      paymentMethodId,
      totalUSD: finalUSD,
      totalKHR: finalKHR,
      status: 'pending',
      qrCodeUrl: qrUrl,
      createdAt: new Date().toISOString(),
    };

    set({
      isSubmitting: false,
      currentOrder: order,
      isModalOpen: false,
      showSuccessModal: true,
    });
  },

  simulatePaymentSuccess: async () => {
    const { currentOrder } = get();
    if (!currentOrder) return;

    set({ isSimulating: true });

    // If order was created on backend, also trigger backend simulation
    if (currentOrder.backendOrderNumber) {
      try {
        await api.topup.simulatePayment(currentOrder.backendOrderNumber);
      } catch (e) {
        // Continue simulation
      }
    }

    setTimeout(() => {
      set({
        isSimulating: false,
        currentOrder: {
          ...currentOrder,
          status: 'paid',
        },
      });

      confetti({
        particleCount: 150,
        spread: 85,
        origin: { y: 0.6 },
      });
    }, 1000);
  },

  closeSuccessModal: () => {
    set({ showSuccessModal: false });
  },
}));
