import crypto from 'crypto';
import { config } from '../../../config';
import { BadRequestError } from '../../../common/errors/AppError';
import {
  TopUpProvider,
  VerifyPlayerParams,
  VerifyPlayerResult,
  FulfillOrderParams,
  FulfillOrderResult,
  ProviderBalanceResult,
} from './topup-provider.interface';

// Map platform game names to SmileOne product codes
const SMILEONE_PRODUCT_MAP: Record<string, string> = {
  'Mobile Legends: Bang Bang': 'mobilelegends',
  'Free Fire': 'freefire',
  'PUBG Mobile': 'pubg',
  'Genshin Impact': 'genshin',
  'Honor of Kings': 'honorofkings',
  Roblox: 'roblox',
};

export class SmileOneProvider implements TopUpProvider {
  readonly name = 'smileone';

  private get baseUrl(): string {
    return config.topup.baseUrl || 'https://api.smile.one';
  }

  private get merchantId(): string {
    return config.topup.merchantId;
  }

  private get apiKey(): string {
    return config.topup.apiKey;
  }

  private get secret(): string {
    return config.topup.secret;
  }

  /**
   * Generate MD5 signature according to SmileOne API specification
   */
  private generateSignature(params: Record<string, any>): string {
    // Sort keys alphabetically
    const keys = Object.keys(params).sort();
    const queryString = keys
      .filter((k) => params[k] !== undefined && params[k] !== null && params[k] !== '')
      .map((k) => `${k}=${params[k]}`)
      .join('&');

    return crypto
      .createHash('md5')
      .update(`${queryString}&key=${this.secret}`)
      .digest('hex');
  }

  /**
   * Verify player account and retrieve in-game nickname directly from SmileOne
   */
  async verifyPlayer(params: VerifyPlayerParams): Promise<VerifyPlayerResult> {
    const { gameTitle, playerId, zoneId, serverRegion } = params;
    const cleanPlayerId = playerId.trim();
    const product = SMILEONE_PRODUCT_MAP[gameTitle] || gameTitle.toLowerCase().replace(/[^a-z0-9]/g, '');

    const time = Math.floor(Date.now() / 1000).toString();
    const payload: Record<string, any> = {
      uid: this.merchantId,
      email: this.apiKey,
      product,
      userid: cleanPlayerId,
      time,
    };

    if (zoneId) {
      payload.zoneid = zoneId.trim();
    }
    if (serverRegion) {
      payload.server = serverRegion.trim();
    }

    payload.sign = this.generateSignature(payload);

    try {
      const response = await fetch(`${this.baseUrl}/smilecoin/api/queryrole`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = (await response.json()) as {
        status: number;
        message?: string;
        username?: string;
        role_name?: string;
        data?: { username?: string; role_name?: string };
      };

      if (resData.status === 200) {
        const nickname = resData.username || resData.role_name || resData.data?.username || resData.data?.role_name || cleanPlayerId;
        return {
          isValid: true,
          playerId: cleanPlayerId,
          zoneId: zoneId || null,
          serverRegion: serverRegion || null,
          nickname,
          message: 'Player verified successfully via SmileOne Official API',
        };
      }

      throw new BadRequestError(
        resData.message || `Player ID not found on ${gameTitle} server. Please double-check your ID.`
      );
    } catch (err: any) {
      if (err instanceof BadRequestError) throw err;
      console.error('SmileOne API queryrole error:', err);
      throw new BadRequestError(`Failed to verify player with SmileOne: ${err?.message || 'Network error'}`);
    }
  }

  /**
   * Execute real-time diamond / in-game currency reload
   */
  async fulfillOrder(params: FulfillOrderParams): Promise<FulfillOrderResult> {
    const { orderNumber, gameTitle, packageId, packageName, playerId, zoneId, serverRegion, playerNickname } = params;
    const product = SMILEONE_PRODUCT_MAP[gameTitle] || gameTitle.toLowerCase().replace(/[^a-z0-9]/g, '');
    const time = Math.floor(Date.now() / 1000).toString();

    const payload: Record<string, any> = {
      uid: this.merchantId,
      email: this.apiKey,
      product,
      productid: packageId,
      userid: playerId.trim(),
      orderno: orderNumber,
      time,
    };

    if (zoneId) {
      payload.zoneid = zoneId.trim();
    }
    if (serverRegion) {
      payload.server = serverRegion.trim();
    }

    payload.sign = this.generateSignature(payload);

    try {
      const response = await fetch(`${this.baseUrl}/smilecoin/api/createorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = (await response.json()) as {
        status: number;
        message?: string;
        order_id?: string;
        data?: { order_id?: string };
      };

      if (resData.status === 200) {
        const providerOrderId = resData.order_id || resData.data?.order_id || `SMILE-${Date.now()}`;
        return {
          success: true,
          providerOrderId,
          deliveryProof: `SmileOne Reload Ref #${providerOrderId}: Credited ${packageName} to ${playerNickname || playerId}`,
          message: `Successfully fulfilled top-up for ${playerNickname || playerId} via SmileOne`,
          status: 'completed',
        };
      }

      return {
        success: false,
        providerOrderId: '',
        deliveryProof: `SmileOne Error: ${resData.message || 'Fulfillment failed'}`,
        message: resData.message || 'SmileOne fulfillment failed',
        status: 'failed',
      };
    } catch (err: any) {
      console.error('SmileOne API createorder error:', err);
      return {
        success: false,
        providerOrderId: '',
        deliveryProof: `Network Exception: ${err?.message}`,
        message: 'Network error connecting to SmileOne API',
        status: 'failed',
      };
    }
  }

  async checkBalance(): Promise<ProviderBalanceResult> {
    const time = Math.floor(Date.now() / 1000).toString();
    const payload = {
      uid: this.merchantId,
      email: this.apiKey,
      time,
      sign: '',
    };
    payload.sign = this.generateSignature(payload);

    try {
      const response = await fetch(`${this.baseUrl}/smilecoin/api/querypoint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { status: number; point?: number };
      return {
        balance: data.point || 0,
        currency: 'USD',
        provider: 'smileone',
      };
    } catch {
      return { balance: 0, currency: 'USD', provider: 'smileone' };
    }
  }

  /**
   * Fetch active product catalog and pricing directly from SmileOne
   */
  async getProductList(gameTitle: string): Promise<any[]> {
    const product = SMILEONE_PRODUCT_MAP[gameTitle] || gameTitle.toLowerCase().replace(/[^a-z0-9]/g, '');
    const time = Math.floor(Date.now() / 1000).toString();
    const payload: Record<string, any> = {
      uid: this.merchantId,
      email: this.apiKey,
      product,
      time,
    };
    payload.sign = this.generateSignature(payload);

    try {
      const response = await fetch(`${this.baseUrl}/smilecoin/api/productlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { status: number; data?: any[] };
      if (data.status === 200 && Array.isArray(data.data)) {
        return data.data;
      }
      return [];
    } catch (err) {
      console.error('SmileOne getProductList error:', err);
      return [];
    }
  }
}

export const smileOneProvider = new SmileOneProvider();
