const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface VerifyPlayerPayload {
  gameId: string;
  playerId: string;
  zoneId?: string;
  serverRegion?: string;
}

export interface CreateOrderPayload {
  gameId: string;
  packageId: string;
  playerId: string;
  zoneId?: string;
  serverRegion?: string;
  playerNickname?: string;
  contactPhone?: string;
  paymentMethod: string;
}

export const api = {
  topup: {
    // 1. Verify Player ID with Backend
    async checkPlayer(payload: VerifyPlayerPayload) {
      try {
        const res = await fetch(`${API_BASE_URL}/topup/check-player`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || 'Player verification failed');
        }
        return await res.json();
      } catch (err: any) {
        throw err;
      }
    },

    // 2. Create Top-Up Order & Generate Bakong KHQR
    async createOrder(payload: CreateOrderPayload) {
      try {
        const res = await fetch(`${API_BASE_URL}/topup/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || 'Failed to create order');
        }
        return await res.json();
      } catch (err: any) {
        throw err;
      }
    },

    // 3. Simulate Payment for Demo/Testing
    async simulatePayment(orderNumber: string) {
      try {
        const res = await fetch(
          `${API_BASE_URL}/topup/orders/${orderNumber}/simulate-payment`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        return await res.json();
      } catch (err: any) {
        throw err;
      }
    },

    // 4. Get Order Status
    async getOrderStatus(orderNumber: string) {
      try {
        const res = await fetch(`${API_BASE_URL}/topup/orders/${orderNumber}`);
        return await res.json();
      } catch (err: any) {
        throw err;
      }
    },
  },
};
