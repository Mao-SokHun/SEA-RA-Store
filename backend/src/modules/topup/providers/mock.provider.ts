import { BadRequestError } from '../../../common/errors/AppError';
import {
  TopUpProvider,
  VerifyPlayerParams,
  VerifyPlayerResult,
  FulfillOrderParams,
  FulfillOrderResult,
  ProviderBalanceResult,
} from './topup-provider.interface';

export class MockTopUpProvider implements TopUpProvider {
  readonly name = 'mock';

  async verifyPlayer(params: VerifyPlayerParams): Promise<VerifyPlayerResult> {
    const { gameTitle, playerId, zoneId, serverRegion } = params;
    const cleanPlayerId = playerId.trim();

    if (!cleanPlayerId) {
      throw new BadRequestError('Player ID or Username is required');
    }

    let nickname = '';

    if (gameTitle.includes('Roblox')) {
      if (cleanPlayerId.length < 3 || cleanPlayerId.length > 20) {
        throw new BadRequestError('Roblox username must be between 3 and 20 characters');
      }
      nickname = cleanPlayerId.startsWith('@') ? cleanPlayerId.slice(1) : cleanPlayerId;
    } else if (gameTitle.includes('Mobile Legends')) {
      if (!zoneId || zoneId.trim().length < 3) {
        throw new BadRequestError('Zone ID is required for Mobile Legends');
      }
      if (cleanPlayerId.length < 6 || cleanPlayerId.length > 12) {
        throw new BadRequestError('Invalid MLBB User ID length (must be 6-12 digits)');
      }
      const sampleNames = [
        '⚔️ Kitsune_Slayer ⚔️',
        '꧁༺ProGamer_KH༻꧂',
        '⚡Shadow_Assassin⚡',
        '⭐Mythic_Glory⭐',
        '🔥Vampire_King🔥',
      ];
      const hash = Math.abs(cleanPlayerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
      nickname = sampleNames[hash % sampleNames.length];
    } else if (gameTitle.includes('Free Fire')) {
      if (cleanPlayerId.length < 6 || cleanPlayerId.length > 14) {
        throw new BadRequestError('Free Fire UID must be between 6 and 14 digits');
      }
      nickname = `FF_Elite_${cleanPlayerId.slice(-4)}`;
    } else if (gameTitle.includes('PUBG')) {
      if (cleanPlayerId.length < 7 || cleanPlayerId.length > 14) {
        throw new BadRequestError('PUBG Character ID must be between 7 and 14 digits');
      }
      nickname = `PUBG_Sniper_${cleanPlayerId.slice(-4)}`;
    } else if (gameTitle.includes('Genshin')) {
      if (cleanPlayerId.length !== 9) {
        throw new BadRequestError('Genshin Impact UID must be exactly 9 digits');
      }
      nickname = `Traveler_Lvl${(parseInt(cleanPlayerId.slice(-2)) % 30) + 30}`;
    } else {
      nickname = cleanPlayerId;
    }

    return {
      isValid: true,
      playerId: cleanPlayerId,
      zoneId: zoneId || null,
      serverRegion: serverRegion || null,
      nickname,
      message: 'Player account verified successfully (Mock Sandbox)',
    };
  }

  async fulfillOrder(params: FulfillOrderParams): Promise<FulfillOrderResult> {
    const providerOrderId = `MOCK-FULFILL-${Date.now()}`;
    const targetPlayer = params.playerNickname || params.playerId;
    const deliveryProof = `IN-GAME RELOAD CONFIRMED: Gateway Ref #${Date.now()}-SERVICED. ${params.packageName} added to ${targetPlayer}`;

    return {
      success: true,
      providerOrderId,
      deliveryProof,
      message: `Successfully credited ${params.packageName} to player ${targetPlayer}.`,
      status: 'completed',
    };
  }

  async checkBalance(): Promise<ProviderBalanceResult> {
    return {
      balance: 9999.0,
      currency: 'USD',
      provider: 'mock',
    };
  }
}

export const mockTopUpProvider = new MockTopUpProvider();
