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

export class ApiGamesProvider implements TopUpProvider {
  readonly name = 'apigames';

  private get baseUrl(): string {
    return config.topup.baseUrl || 'https://v1.apigames.id';
  }

  private get merchantId(): string {
    return config.topup.merchantId;
  }

  private get secret(): string {
    return config.topup.secret;
  }

  async verifyPlayer(params: VerifyPlayerParams): Promise<VerifyPlayerResult> {
    const { gameTitle, playerId, zoneId, serverRegion } = params;
    const cleanPlayerId = playerId.trim();

    try {
      const response = await fetch(`${this.baseUrl}/v2/check-username`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.secret,
        },
        body: JSON.stringify({
          merchant_id: this.merchantId,
          game: gameTitle,
          user_id: cleanPlayerId,
          zone_id: zoneId || undefined,
          server: serverRegion || undefined,
        }),
      });

      const data = (await response.json()) as {
        status: number | boolean;
        message?: string;
        data?: { username?: string; nickname?: string };
      };

      if (data.status === 1 || data.status === 200 || data.status === true) {
        const nickname = data.data?.username || data.data?.nickname || cleanPlayerId;
        return {
          isValid: true,
          playerId: cleanPlayerId,
          zoneId: zoneId || null,
          serverRegion: serverRegion || null,
          nickname,
          message: 'Player verified successfully via ApiGames Wholesale API',
        };
      }

      throw new BadRequestError(data.message || 'Player ID verification failed');
    } catch (err: any) {
      if (err instanceof BadRequestError) throw err;
      throw new BadRequestError(`ApiGames verification error: ${err?.message || 'Network error'}`);
    }
  }

  async fulfillOrder(params: FulfillOrderParams): Promise<FulfillOrderResult> {
    const { orderNumber, gameTitle, packageId, packageName, playerId, zoneId, serverRegion, playerNickname } = params;

    try {
      const response = await fetch(`${this.baseUrl}/v2/transaksi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.secret,
        },
        body: JSON.stringify({
          ref_id: orderNumber,
          merchant_id: this.merchantId,
          code: packageId,
          target: playerId.trim(),
          zone_id: zoneId || undefined,
          server: serverRegion || undefined,
        }),
      });

      const resData = (await response.json()) as {
        status: number | boolean;
        message?: string;
        data?: { trx_id?: string; status?: string };
      };

      if (resData.status === 1 || resData.status === 200 || resData.status === true) {
        const trxId = resData.data?.trx_id || `APIGAMES-${Date.now()}`;
        return {
          success: true,
          providerOrderId: trxId,
          deliveryProof: `ApiGames Gateway Ref #${trxId}: ${packageName} credited to ${playerNickname || playerId}`,
          message: `Successfully fulfilled top-up for ${playerNickname || playerId}`,
          status: 'completed',
        };
      }

      return {
        success: false,
        providerOrderId: '',
        deliveryProof: `ApiGames Error: ${resData.message || 'Transaction failed'}`,
        message: resData.message || 'ApiGames transaction failed',
        status: 'failed',
      };
    } catch (err: any) {
      return {
        success: false,
        providerOrderId: '',
        deliveryProof: `Network Exception: ${err?.message}`,
        message: 'ApiGames network connection error',
        status: 'failed',
      };
    }
  }

  async checkBalance(): Promise<ProviderBalanceResult> {
    try {
      const response = await fetch(`${this.baseUrl}/v2/merchant/balance`, {
        headers: { 'x-api-key': this.secret },
      });
      const data = (await response.json()) as { data?: { balance?: number } };
      return {
        balance: data.data?.balance || 0,
        currency: 'USD',
        provider: 'apigames',
      };
    } catch {
      return { balance: 0, currency: 'USD', provider: 'apigames' };
    }
  }
}

export const apiGamesProvider = new ApiGamesProvider();
