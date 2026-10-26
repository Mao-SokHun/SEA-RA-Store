import { config } from '../../../config';

export interface BakongTransactionData {
  hash: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  currency: string;
  description?: string;
  createdDateMs: number;
  acknowledged: boolean;
}

export interface CheckTransactionResult {
  checked: boolean;
  isPaid: boolean;
  data?: BakongTransactionData;
  message?: string;
  errorCode?: number;
}

export class BakongService {
  private readonly baseUrl = 'https://api-bakong.nbc.gov.kh/v1';

  /**
   * Verify if a transaction has been paid via Bakong Open API by its KHQR MD5 hash
   */
  async checkTransactionByMD5(md5: string): Promise<CheckTransactionResult> {
    const token = config.khqr.apiToken;

    if (!token) {
      return {
        checked: false,
        isPaid: false,
        message: 'Bakong API Token is not configured',
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/check_transaction_by_md5`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ md5 }),
      });

      const result = (await response.json()) as {
        responseCode: number;
        responseMessage?: string;
        errorCode?: number;
        data: BakongTransactionData | null;
      };

      // responseCode 0 means transaction confirmed and paid on Bakong network
      if (result.responseCode === 0 && result.data) {
        return {
          checked: true,
          isPaid: true,
          data: result.data,
          message: 'Transaction verified and confirmed by Bakong',
        };
      }

      // responseCode 1 means not paid yet, or daily limit reached
      return {
        checked: true,
        isPaid: false,
        message: result.responseMessage || 'Transaction not found or pending',
        errorCode: result.errorCode,
      };
    } catch (err: any) {
      console.warn(`Bakong Open API check failed for MD5 ${md5}:`, err?.message || err);
      return {
        checked: false,
        isPaid: false,
        message: 'Failed to contact Bakong Open API server',
      };
    }
  }

  /**
   * Get public Bakong merchant profile info
   */
  getMerchantProfile() {
    return {
      merchantName: config.khqr.merchantName,
      merchantCity: config.khqr.merchantCity,
      bakongId: config.khqr.bakongId,
      bakongIdKhr: config.khqr.bakongIdKhr,
      merchantId: config.khqr.merchantId,
    };
  }
}

export const bakongService = new BakongService();
export default bakongService;
