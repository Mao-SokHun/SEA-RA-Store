import {
  User,
  Game,
  GameAccount,
  Order,
  DecryptedCredentials,
  KHQRPaymentData,
  Wallet,
  WithdrawalRequest,
  Dispute,
  ChatMessage,
  TopUpGame,
  TopUpGameDetails,
  TopUpPlayerVerifyResult,
  CreateTopUpOrderPayload,
  TopUpOrder,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

class ApiError extends Error {
  statusCode: number;
  errors?: any;

  constructor(message: string, statusCode: number, errors?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

// Helper to retrieve token from localStorage
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('nexus_access_token');
}

export function setStoredToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('nexus_access_token', token);
  } else {
    localStorage.removeItem('nexus_access_token');
  }
}

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // sends HTTP-only refresh cookies
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // If token expired, try to refresh once
      if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh-token')) {
        const refreshed = await tryRefreshToken();
        if (refreshed) {
          headers['Authorization'] = `Bearer ${getStoredToken()}`;
          const retryRes = await fetch(url, { ...options, headers, credentials: 'include' });
          const retryData = await retryRes.json();
          if (retryRes.ok) return retryData;
        }
      }

      throw new ApiError(
        data.message || `Request failed with status ${response.status}`,
        response.status,
        data.errors
      );
    }

    return data;
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(err.message || 'Network error occurred', 500);
  }
}

async function tryRefreshToken(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.data?.accessToken) {
        setStoredToken(data.data.accessToken);
        return true;
      }
    }
  } catch {
    // refresh failed
  }
  setStoredToken(null);
  return false;
}

// -------------------------------------------------------------
// API CLIENT METHODS
// -------------------------------------------------------------
export const api = {
  // Auth
  auth: {
    async register(payload: {
      username: string;
      email: string;
      password: string;
      role?: 'buyer' | 'seller';
      referralCode?: string;
    }) {
      const res = await request<{ user: User; accessToken: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res.data?.accessToken) {
        setStoredToken(res.data.accessToken);
      }
      return res.data;
    },

    async login(payload: { emailOrUsername?: string; email?: string; username?: string; password: string }) {
      const body = {
        email: payload.email || payload.emailOrUsername,
        username: payload.username || payload.emailOrUsername,
        password: payload.password,
      };
      const res = await request<{ user: User; accessToken: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      if (res.data?.accessToken) {
        setStoredToken(res.data.accessToken);
      }
      return res.data;
    },

    async logout() {
      try {
        await request('/auth/logout', { method: 'POST' });
      } finally {
        setStoredToken(null);
      }
    },

    async getMe(): Promise<User> {
      const res = await request<User>('/auth/me');
      return res.data;
    },
  },

  // Games Catalog
  games: {
    async list(): Promise<Game[]> {
      const res = await request<Game[]>('/games');
      return res.data;
    },
    async getById(id: string): Promise<Game> {
      const res = await request<Game>(`/games/${id}`);
      return res.data;
    },
  },

  // Account Listings
  accounts: {
    async list(params: {
      gameId?: string;
      tierRank?: string;
      minPrice?: number;
      maxPrice?: number;
      deliveryType?: string;
      search?: string;
      page?: number;
      limit?: number;
      sortBy?: string;
      order?: 'asc' | 'desc';
    } = {}): Promise<{ accounts: GameAccount[]; meta: any }> {
      const query = new URLSearchParams();
      if (params.gameId) query.set('gameId', params.gameId);
      if (params.tierRank) query.set('tierRank', params.tierRank);
      if (params.minPrice) query.set('minPrice', params.minPrice.toString());
      if (params.maxPrice) query.set('maxPrice', params.maxPrice.toString());
      if (params.deliveryType) query.set('deliveryType', params.deliveryType);
      if (params.search) query.set('search', params.search);
      if (params.page) query.set('page', params.page.toString());
      if (params.limit) query.set('limit', params.limit.toString());
      if (params.sortBy) query.set('sortBy', params.sortBy);
      if (params.order) query.set('order', params.order);

      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await request<GameAccount[]>(`/accounts${qs}`);
      return { accounts: res.data, meta: res.meta };
    },

    async getById(id: string): Promise<GameAccount> {
      const res = await request<GameAccount>(`/accounts/${id}`);
      return res.data;
    },

    async create(payload: {
      gameId: string;
      title: string;
      description?: string;
      price: number;
      tierRank: string;
      serverRegion: string;
      deliveryType?: 'instant' | 'manual';
      firstMailIncluded?: boolean;
      binds?: { provider: string; bindType: string; notes?: string }[];
      images?: { imageUrl: string; isCover: boolean }[];
      credentials: {
        loginIdentifier: string;
        password: string;
        twoFactorSecret?: string;
        recoveryEmail?: string;
        recoveryEmailPassword?: string;
        additionalNotes?: string;
      };
    }): Promise<GameAccount> {
      const res = await request<GameAccount>('/accounts', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return res.data;
    },
  },

  // Orders & Escrow
  orders: {
    async checkout(payload: {
      gameAccountId: string;
      warrantyPackage?: string;
      couponCode?: string;
    }): Promise<Order> {
      const res = await request<Order>('/orders/checkout', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return res.data;
    },

    async getMyOrders(): Promise<Order[]> {
      const res = await request<Order[]>('/orders/my-orders');
      return res.data;
    },

    async getByNumber(orderNumber: string): Promise<Order> {
      const res = await request<Order>(`/orders/${orderNumber}`);
      return res.data;
    },

    async getCredentials(orderNumber: string): Promise<DecryptedCredentials> {
      const res = await request<DecryptedCredentials>(`/orders/${orderNumber}/credentials`);
      return res.data;
    },

    async confirmReceived(orderNumber: string): Promise<Order> {
      const res = await request<Order>(`/orders/${orderNumber}/confirm-received`, {
        method: 'POST',
      });
      return res.data;
    },
  },

  // Payments
  payments: {
    async generateKHQR(orderNumber: string): Promise<KHQRPaymentData> {
      const res = await request<KHQRPaymentData>('/payments/khqr', {
        method: 'POST',
        body: JSON.stringify({ orderNumber }),
      });
      return res.data;
    },

    async getStatus(orderNumber: string): Promise<{
      orderNumber: string;
      orderStatus: string;
      isPaid: boolean;
      payment?: any;
    }> {
      const res = await request(`/payments/status/${orderNumber}`);
      return res.data;
    },

    async checkBakongPayment(orderNumber: string): Promise<{
      isPaid: boolean;
      orderStatus?: string;
      transactionId?: string;
      message: string;
      cooldown?: boolean;
      waitSeconds?: number;
    }> {
      const res = await request(`/payments/check-bakong/${orderNumber}`, {
        method: 'POST',
      });
      return res.data;
    },

    async payWithWallet(orderNumber: string): Promise<{ success: boolean; order: Order }> {
      const res = await request('/payments/pay-with-wallet', {
        method: 'POST',
        body: JSON.stringify({ orderNumber }),
      });
      return res.data;
    },

    // Developer simulation endpoint for seamless instant testing
    async simulateSuccess(orderNumber: string): Promise<{ success: boolean }> {
      const res = await request('/payments/simulate', {
        method: 'POST',
        body: JSON.stringify({ orderNumber, status: 'success' }),
      });
      return res.data;
    },
  },

  // Wallet
  wallet: {
    async get(): Promise<Wallet> {
      const res = await request<Wallet>('/wallet');
      return res.data;
    },

    async withdraw(payload: {
      amount: number;
      bankName: string;
      accountNumber: string;
      accountName: string;
    }): Promise<WithdrawalRequest> {
      const res = await request<WithdrawalRequest>('/wallet/withdraw', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return res.data;
    },

    async getTransactions(): Promise<any[]> {
      const res = await request<any[]>('/wallet/transactions');
      return res.data;
    },
  },

  // Disputes
  disputes: {
    async raise(payload: {
      orderNumber: string;
      reason: string;
      evidenceUrls?: string[];
    }): Promise<Dispute> {
      const res = await request<Dispute>('/disputes', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return res.data;
    },

    async getByOrder(orderNumber: string): Promise<Dispute> {
      const res = await request<Dispute>(`/disputes/order/${orderNumber}`);
      return res.data;
    },
  },

  // Chat History
  chat: {
    async getHistory(orderNumber: string): Promise<ChatMessage[]> {
      const res = await request<ChatMessage[]>(`/chat/${orderNumber}/history`);
      return res.data;
    },
  },

  // Admin Overview
  admin: {
    async getOverview(): Promise<any> {
      const res = await request<any>('/admin/analytics/overview');
      return res.data;
    },

    async getWithdrawals(): Promise<WithdrawalRequest[]> {
      const res = await request<WithdrawalRequest[]>('/admin/withdrawals');
      return res.data;
    },

    async approveWithdrawal(id: string, notes?: string) {
      return request(`/admin/withdrawals/${id}/approve`, {
        method: 'POST',
        body: JSON.stringify({ notes }),
      });
    },

    async rejectWithdrawal(id: string, reason: string) {
      return request(`/admin/withdrawals/${id}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
    },
  },

  // In-Game Direct Top-Up API
  topup: {
    async getGames(): Promise<TopUpGame[]> {
      const res = await request<TopUpGame[]>('/topup/games');
      return res.data;
    },

    async getGameDetails(gameId: string): Promise<TopUpGameDetails> {
      const res = await request<TopUpGameDetails>(`/topup/games/${gameId}`);
      return res.data;
    },

    async verifyPlayer(payload: {
      gameId: string;
      playerId: string;
      zoneId?: string;
      serverRegion?: string;
    }): Promise<TopUpPlayerVerifyResult> {
      const res = await request<TopUpPlayerVerifyResult>('/topup/check-player', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return res.data;
    },

    async createOrder(payload: CreateTopUpOrderPayload): Promise<TopUpOrder> {
      const res = await request<TopUpOrder>('/topup/orders', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return res.data;
    },

    async getOrderStatus(orderNumber: string): Promise<TopUpOrder> {
      const res = await request<TopUpOrder>(`/topup/orders/${orderNumber}`);
      return res.data;
    },

    async simulatePayment(orderNumber: string): Promise<any> {
      const res = await request<any>(`/topup/orders/${orderNumber}/simulate-payment`, {
        method: 'POST',
      });
      return res.data;
    },

    async getMyOrders(page = 1, limit = 20): Promise<{ orders: TopUpOrder[]; meta: any }> {
      const res = await request<{ orders: TopUpOrder[]; meta: any }>(
        `/topup/my-orders?page=${page}&limit=${limit}`
      );
      return res.data;
    },

    async trackGuestOrders(query: string, page = 1, limit = 20): Promise<{ query: string; orders: TopUpOrder[]; meta: any }> {
      const res = await request<{ query: string; orders: TopUpOrder[]; meta: any }>(
        `/topup/track-orders?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
      );
      return res.data;
    },
  },
};
