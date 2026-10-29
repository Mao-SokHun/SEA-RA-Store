import crypto from 'crypto';
import { prisma } from '../../../config/database';
import { config } from '../../../config';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../../common/errors/AppError';
import { generateBakongKHQRString, generateQRCodeImage, calculateKHQRMD5 } from '../../../common/utils/khqr';
import { Prisma } from '@prisma/client';
import { getTopUpProvider } from '../providers';

export interface GameInputConfig {
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

export interface GameTopUpMeta {
  currencyName: string;
  currencyNameKh: string;
  currencyIcon: string;
  inputConfig: GameInputConfig[];
  guideTitle: string;
  guideTitleKh: string;
  guideDescription: string;
  guideDescriptionKh: string;
}

// Game-specific top up configuration mapping
export const GAME_TOPUP_CONFIGS: Record<string, GameTopUpMeta> = {
  Roblox: {
    currencyName: 'Robux',
    currencyNameKh: 'Robux (រ៉ូប៊ុក)',
    currencyIcon: '⚡',
    inputConfig: [
      {
        key: 'playerId',
        label: 'Roblox Username',
        labelKh: 'ឈ្មោះគណនី Roblox (Username)',
        placeholder: 'ឧ. ProGamer_KH',
        type: 'text',
        required: true,
        helpText: 'Enter your exact Roblox username (not display name).',
        helpTextKh: 'សូមបញ្ចូលឈ្មោះ Username ពិតប្រាកដរបស់អ្នកនៅក្នុង Roblox។',
      },
    ],
    guideTitle: 'How to find your Roblox Username',
    guideTitleKh: 'របៀបមើលឈ្មោះ Username ក្នុង Roblox',
    guideDescription: 'Open Roblox app or website > Go to Settings/Profile > Copy the @Username under your avatar.',
    guideDescriptionKh: 'បើកកម្មវិធី Roblox > ចូលទៅកាន់ Profile > ចម្លងឈ្មោះនៅក្រោមរូប Avatar ដែលមានសញ្ញា @។',
  },
  'Mobile Legends: Bang Bang': {
    currencyName: 'Diamonds',
    currencyNameKh: 'Diamonds (ពេជ្រ)',
    currencyIcon: '💎',
    inputConfig: [
      {
        key: 'playerId',
        label: 'User ID',
        labelKh: 'User ID (លេខសម្គាល់)',
        placeholder: 'ឧ. 123456789',
        type: 'number',
        required: true,
        helpText: 'Your 8-10 digit Player ID.',
        helpTextKh: 'លេខសម្គាល់ Player ID មានពី ៨ ទៅ ១០ ខ្ទង់។',
      },
      {
        key: 'zoneId',
        label: 'Zone ID',
        labelKh: 'Zone ID (លេខក្នុងវង់ក្រចក)',
        placeholder: 'ឧ. 2026',
        type: 'number',
        required: true,
        helpText: '4-5 digit number inside parenthesis.',
        helpTextKh: 'លេខ ៤ ទៅ ៥ ខ្ទង់នៅក្នុងវង់ក្រចក ( )។',
      },
    ],
    guideTitle: 'How to find MLBB User ID & Zone ID',
    guideTitleKh: 'របៀបមើល User ID & Zone ID ក្នុង MLBB',
    guideDescription: 'Tap your avatar at the top-left of the main screen > ID is in Basic Info format: 123456789 (2026).',
    guideDescriptionKh: 'ចុចលើរូប Avatar នៅជ្រុងខាងឆ្វេងខាងលើ > មើលក្នុង Basic Info ទម្រង់: 123456789 (2026)។',
  },
  'Free Fire': {
    currencyName: 'Diamonds',
    currencyNameKh: 'Diamonds (ពេជ្រ)',
    currencyIcon: '💎',
    inputConfig: [
      {
        key: 'playerId',
        label: 'Player UID',
        labelKh: 'Player UID (លេខសម្គាល់)',
        placeholder: 'ឧ. 2938172645',
        type: 'number',
        required: true,
        helpText: 'Your Free Fire Player UID.',
        helpTextKh: 'លេខ UID គណនី Free Fire របស់អ្នក។',
      },
    ],
    guideTitle: 'How to find Free Fire UID',
    guideTitleKh: 'របៀបមើល UID ក្នុង Free Fire',
    guideDescription: 'Click your avatar at top-left > In Profile tab, click the copy icon next to your UID.',
    guideDescriptionKh: 'ចុចលើ Avatar នៅជ្រុងឆ្វេងខាងលើ > ក្នុងផ្ទាំង Profile ចុចលើប៊ូតុង Copy នៅជិត UID។',
  },
  'PUBG Mobile': {
    currencyName: 'Unknown Cash (UC)',
    currencyNameKh: 'UC (យូស៊ី)',
    currencyIcon: '🪙',
    inputConfig: [
      {
        key: 'playerId',
        label: 'Character ID',
        labelKh: 'Character ID (លេខសម្គាល់តួអង្គ)',
        placeholder: 'ឧ. 5123984719',
        type: 'number',
        required: true,
        helpText: 'Enter your 9-11 digit PUBG Mobile Character ID.',
        helpTextKh: 'បញ្ចូលលេខ Character ID មានពី ៩ ទៅ ១១ ខ្ទង់។',
      },
    ],
    guideTitle: 'How to find PUBG Mobile Character ID',
    guideTitleKh: 'របៀបមើល Character ID ក្នុង PUBG Mobile',
    guideDescription: 'Tap your profile picture top-right > Look below your nickname for the numeric Character ID.',
    guideDescriptionKh: 'ចុចលើរូប Profile នៅជ្រុងស្តាំខាងលើ > មើលលេខ Character ID នៅខាងក្រោមឈ្មោះ។',
  },
  'Genshin Impact': {
    currencyName: 'Genesis Crystals',
    currencyNameKh: 'Genesis Crystals (គ្រីស្តាល់)',
    currencyIcon: '✨',
    inputConfig: [
      {
        key: 'playerId',
        label: 'Genshin UID',
        labelKh: 'Genshin UID',
        placeholder: 'ឧ. 800123456',
        type: 'number',
        required: true,
      },
      {
        key: 'serverRegion',
        label: 'Server Region',
        labelKh: 'ម៉ាស៊ីនបម្រើ (Server)',
        placeholder: 'ជ្រើសរើស Server',
        type: 'select',
        options: ['Asia', 'America', 'Europe', 'TW_HK_MO'],
        required: true,
      },
    ],
    guideTitle: 'How to find Genshin Impact UID',
    guideTitleKh: 'របៀបមើល UID ក្នុង Genshin Impact',
    guideDescription: 'UID is permanently visible at the bottom-right corner of your screen during gameplay, or in Paimon menu.',
    guideDescriptionKh: 'លេខ UID បង្ហាញនៅជ្រុងខាងស្តាំខាងក្រោមអេក្រង់ ឬនៅក្នុង Paimon Menu។',
  },
  Valorant: {
    currencyName: 'Valorant Points (VP)',
    currencyNameKh: 'Valorant Points (VP)',
    currencyIcon: '🎯',
    inputConfig: [
      {
        key: 'playerId',
        label: 'Riot ID + Tagline',
        labelKh: 'Riot ID + Tagline (ឈ្មោះ #Tag)',
        placeholder: 'ឧ. PlayerName#SEA',
        type: 'text',
        required: true,
      },
    ],
    guideTitle: 'How to find Riot ID and Tag',
    guideTitleKh: 'របៀបមើល Riot ID និង Tag',
    guideDescription: 'Hover over your profile in the Valorant lobby to see your Riot ID and 4-digit tagline (e.g., Jett#1234).',
    guideDescriptionKh: 'ដាក់ Mouse លើរូប Profile ក្នុង Game Lobby ដើម្បីមើល Riot ID និង Tagline ឧ. Jett#1234។',
  },
  'Honor of Kings': {
    currencyName: 'Tokens',
    currencyNameKh: 'Tokens (កាក់ហ្គេម)',
    currencyIcon: '👑',
    inputConfig: [
      {
        key: 'playerId',
        label: 'Player ID (UID)',
        labelKh: 'Player ID (UID)',
        placeholder: 'ឧ. 9812739182',
        type: 'number',
        required: true,
      },
    ],
    guideTitle: 'How to find Honor of Kings Player ID',
    guideTitleKh: 'របៀបមើល Player ID ក្នុង Honor of Kings',
    guideDescription: 'Tap avatar top-left > Settings > View User ID number.',
    guideDescriptionKh: 'ចុចលើ Avatar ជ្រុងខាងឆ្វេង > Settings > មើលលេខ User ID។',
  },
  'Call of Duty: Mobile': {
    currencyName: 'CP (COD Points)',
    currencyNameKh: 'CP (ស៊ីភី)',
    currencyIcon: '🪙',
    inputConfig: [
      {
        key: 'playerId',
        label: 'Player UID / OpenID',
        labelKh: 'Player UID / OpenID',
        placeholder: 'ឧ. 6749182348123',
        type: 'text',
        required: true,
        helpText: 'Your 13-19 digit CODM UID in Basic Info.',
        helpTextKh: 'លេខ UID គណនី CODM របស់អ្នកក្នុង Basic Info។',
      },
    ],
    guideTitle: 'How to find CODM Player UID',
    guideTitleKh: 'របៀបមើល UID ក្នុង Call of Duty: Mobile',
    guideDescription: 'Tap avatar at top-left > Tap PLAYER PROFILE tab > Copy the numeric UID under your avatar.',
    guideDescriptionKh: 'ចុចលើ Avatar ជ្រុងខាងឆ្វេង > ចូល PLAYER PROFILE > ចម្លងលេខ UID នៅក្រោមរូប Avatar។',
  },
  'League of Legends: Wild Rift': {
    currencyName: 'Wild Cores',
    currencyNameKh: 'Wild Cores (វ៉ាយខ័រ)',
    currencyIcon: '💎',
    inputConfig: [
      {
        key: 'playerId',
        label: 'Riot ID & Tagline',
        labelKh: 'Riot ID & Tagline (ឈ្មោះ #Tag)',
        placeholder: 'ឧ. Yasuo#KH1',
        type: 'text',
        required: true,
        helpText: 'Enter your Riot ID and Tagline (e.g., Faker#SEA).',
        helpTextKh: 'បញ្ចូល Riot ID និង Tagline របស់អ្នក ឧ. Faker#SEA។',
      },
    ],
    guideTitle: 'How to find Wild Rift Riot ID',
    guideTitleKh: 'របៀបមើល Riot ID ក្នុង Wild Rift',
    guideDescription: 'Open Wild Rift > Tap profile avatar top-left > Copy your Riot ID with the hashtag #.',
    guideDescriptionKh: 'បើកហ្គេម Wild Rift > ចុចលើ Profile ជ្រុងឆ្វេង > ចម្លងឈ្មោះ Riot ID រួមជាមួយសញ្ញា #។',
  },
  'Blood Strike': {
    currencyName: 'Gold',
    currencyNameKh: 'Gold (មាស)',
    currencyIcon: '💰',
    inputConfig: [
      {
        key: 'playerId',
        label: 'User ID',
        labelKh: 'User ID (លេខសម្គាល់)',
        placeholder: 'ឧ. 19827361',
        type: 'number',
        required: true,
        helpText: 'Your 8-10 digit Blood Strike User ID.',
        helpTextKh: 'លេខ User ID គណនី Blood Strike របស់អ្នក។',
      },
    ],
    guideTitle: 'How to find Blood Strike User ID',
    guideTitleKh: 'របៀបមើល User ID ក្នុង Blood Strike',
    guideDescription: 'Tap profile picture at top-left of the lobby > Copy User ID displayed below your avatar.',
    guideDescriptionKh: 'ចុចលើ Profile ជ្រុងឆ្វេងលើនៃ Lobby > ចម្លង User ID ដែលបង្ហាញនៅខាងក្រោម Avatar។',
  },
};

export interface CreateTopUpOrderDTO {
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

export class TopUpService {
  /**
   * Get all games available for top-up with their metadata & active package counts
   */
  async getTopUpGames() {
    const games = await prisma.game.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            topUpPackages: {
              where: { isActive: true },
            },
          },
        },
      },
      orderBy: { id: 'asc' },
    });

    return games.map((game) => {
      const config = GAME_TOPUP_CONFIGS[game.title] || {
        currencyName: 'Game Currency',
        currencyNameKh: 'រូបិយប័ណ្ណហ្គេម',
        currencyIcon: '⚡',
        inputConfig: [
          {
            key: 'playerId',
            label: 'Player ID',
            labelKh: 'Player ID',
            placeholder: 'Enter Player ID',
            type: 'text',
            required: true,
          },
        ],
        guideTitle: 'Find Player ID',
        guideTitleKh: 'របៀបមើល Player ID',
        guideDescription: 'Check profile menu inside the game.',
        guideDescriptionKh: 'ពិនិត្យមើលក្នុង Menu Profile នៃហ្គេម។',
      };

      return {
        id: game.id.toString(),
        title: game.title,
        platform: game.platform,
        iconUrl: game.iconUrl,
        packageCount: game._count.topUpPackages,
        ...config,
      };
    });
  }

  /**
   * Get specific game top-up details and active packages
   */
  async getGameTopUpDetails(gameId: string) {
    const game = await prisma.game.findUnique({
      where: { id: BigInt(gameId) },
      include: {
        topUpPackages: {
          where: { isActive: true },
          orderBy: [{ sortOrder: 'asc' }, { price: 'asc' }],
        },
      },
    });

    if (!game) {
      throw new NotFoundError(`Game with ID ${gameId} not found`);
    }

    const config = GAME_TOPUP_CONFIGS[game.title] || {
      currencyName: 'Game Currency',
      currencyNameKh: 'រូបិយប័ណ្ណហ្គេម',
      currencyIcon: '⚡',
      inputConfig: [
        {
          key: 'playerId',
          label: 'Player ID',
          labelKh: 'Player ID',
          placeholder: 'Enter Player ID',
          type: 'text',
          required: true,
        },
      ],
      guideTitle: 'Find Player ID',
      guideTitleKh: 'របៀបមើល Player ID',
      guideDescription: 'Check profile menu inside the game.',
      guideDescriptionKh: 'ពិនិត្យមើលក្នុង Menu Profile នៃហ្គេម។',
    };

    return {
      id: game.id.toString(),
      title: game.title,
      platform: game.platform,
      iconUrl: game.iconUrl,
      ...config,
      packages: game.topUpPackages.map((pkg) => ({
        id: pkg.id.toString(),
        name: pkg.name,
        category: pkg.category,
        currencyAmount: pkg.currencyAmount,
        bonusAmount: pkg.bonusAmount,
        price: Number(pkg.price),
        originalPrice: pkg.originalPrice ? Number(pkg.originalPrice) : null,
        badge: pkg.badge,
        sortOrder: pkg.sortOrder,
      })),
    };
  }

  /**
   * Real-time verification of Game Player ID and retrieval of In-Game Nickname
   */
  async verifyPlayer(gameId: string, playerId: string, zoneId?: string, serverRegion?: string) {
    const game = await prisma.game.findUnique({
      where: { id: BigInt(gameId) },
    });

    if (!game || !game.isActive) {
      throw new NotFoundError('Game not found or currently inactive');
    }

    const cleanPlayerId = playerId.trim();
    if (!cleanPlayerId) {
      throw new BadRequestError('Player ID or Username is required');
    }

    // Delegate to configured TopUp Provider (Mock, SmileOne, or ApiGames)
    const provider = getTopUpProvider();
    return await provider.verifyPlayer({
      gameTitle: game.title,
      playerId: cleanPlayerId,
      zoneId: zoneId?.trim() || null,
      serverRegion: serverRegion || null,
    });
  }

  /**
   * Create a new top-up order (supports KHQR and Wallet payment)
   */
  async createTopUpOrder(userId: string | null, data: CreateTopUpOrderDTO) {
    const game = await prisma.game.findUnique({
      where: { id: BigInt(data.gameId) },
    });

    if (!game || !game.isActive) {
      throw new NotFoundError('Game is not available or currently inactive');
    }

    const pkg = await prisma.topUpPackage.findUnique({
      where: { id: BigInt(data.packageId) },
    });

    if (!pkg || !pkg.isActive) {
      throw new NotFoundError('Selected top-up package is not available');
    }

    // Security Guard: Prevent cross-game package exploitation
    if (pkg.gameId !== game.id) {
      throw new BadRequestError('Selected package does not belong to the chosen game');
    }

    const price = Number(pkg.price);
    const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
    const orderNumber = `TU-${Date.now().toString().slice(-6)}-${randomSuffix}`;

    // 1. If paying with Wallet
    if (data.paymentMethod === 'wallet') {
      if (!userId) {
        throw new UnauthorizedError('You must be logged in to pay with wallet balance');
      }

      const userBigInt = BigInt(userId);

      const result = await prisma.$transaction(async (tx) => {
        const wallet = await tx.wallet.findUnique({
          where: { userId: userBigInt },
        });

        if (!wallet || Number(wallet.balance) < price) {
          throw new BadRequestError(
            `Insufficient wallet balance. You have $${Number(wallet?.balance || 0).toFixed(2)}, but order total is $${price.toFixed(2)}.`
          );
        }

        const newBalance = Number(wallet.balance) - price;

        // Deduct wallet balance
        await tx.wallet.update({
          where: { userId: userBigInt },
          data: { balance: new Prisma.Decimal(newBalance) },
        });

        // Record wallet transaction
        await tx.walletTransaction.create({
          data: {
            walletId: wallet.id,
            transactionType: 'topup_purchase',
            amount: new Prisma.Decimal(-price),
            balanceAfter: new Prisma.Decimal(newBalance),
          },
        });

        // Create completed top-up order
        const txnRef = `TXN-WLT-${Date.now()}-${randomSuffix}`;
        const order = await tx.topUpOrder.create({
          data: {
            orderNumber,
            userId: userBigInt,
            gameId: game.id,
            packageId: pkg.id,
            playerId: data.playerId,
            zoneId: data.zoneId || null,
            serverRegion: data.serverRegion || null,
            playerNickname: data.playerNickname || data.playerId,
            contactPhone: data.contactPhone || null,
            contactEmail: data.contactEmail || null,
            subtotalAmount: new Prisma.Decimal(price),
            discountAmount: new Prisma.Decimal(0),
            totalAmount: new Prisma.Decimal(price),
            paymentMethod: 'wallet',
            paymentStatus: 'paid',
            deliveryStatus: 'completed',
            transactionReference: txnRef,
            deliveryProof: `Direct In-Game Credit API Ref: RELOAD-${Date.now()}-CONFIRMED`,
          },
          include: {
            game: true,
            package: true,
          },
        });

        return { order, newBalance };
      });

      return {
        orderNumber: result.order.orderNumber,
        status: 'completed',
        paymentStatus: 'paid',
        deliveryStatus: 'completed',
        gameTitle: game.title,
        packageName: pkg.name,
        totalAmount: price,
        playerId: data.playerId,
        playerNickname: result.order.playerNickname,
        deliveryProof: result.order.deliveryProof,
        paymentMethod: 'wallet',
        remainingWalletBalance: result.newBalance,
      };
    }

    // 2. If paying with Bakong KHQR
    const order = await prisma.topUpOrder.create({
      data: {
        orderNumber,
        userId: userId ? BigInt(userId) : null,
        gameId: game.id,
        packageId: pkg.id,
        playerId: data.playerId,
        zoneId: data.zoneId || null,
        serverRegion: data.serverRegion || null,
        playerNickname: data.playerNickname || data.playerId,
        contactPhone: data.contactPhone || null,
        contactEmail: data.contactEmail || null,
        subtotalAmount: new Prisma.Decimal(price),
        discountAmount: new Prisma.Decimal(0),
        totalAmount: new Prisma.Decimal(price),
        paymentMethod: 'bakong_khqr',
        paymentStatus: 'pending',
        deliveryStatus: 'pending',
        transactionReference: `TXN-KHQR-${Date.now()}-${randomSuffix}`,
      },
      include: {
        game: true,
        package: true,
      },
    });

    // Generate Bakong KHQR String and Base64 QR code image
    const qrString = generateBakongKHQRString({
      orderNumber: order.orderNumber,
      amount: price,
      currency: 'USD',
      merchantName: config.khqr.merchantName,
      merchantAccount: config.khqr.bakongId,
      merchantCity: config.khqr.merchantCity,
    });

    const md5 = calculateKHQRMD5(qrString);

    // Save MD5 hash in transactionReference so it can be checked
    await prisma.topUpOrder.update({
      where: { id: order.id },
      data: { transactionReference: md5 },
    });

    const qrImage = await generateQRCodeImage(qrString);

    return {
      orderNumber: order.orderNumber,
      status: 'pending',
      paymentStatus: 'pending',
      deliveryStatus: 'pending',
      gameTitle: game.title,
      packageName: pkg.name,
      totalAmount: price,
      playerId: data.playerId,
      playerNickname: order.playerNickname,
      paymentMethod: 'bakong_khqr',
      qrString,
      qrImage,
      md5,
      deepLink: `bakong://pay?qr=${encodeURIComponent(qrString)}`,
      expiresInSeconds: 900, // 15 mins
    };
  }

  /**
   * Get Top-Up Order Status by Order Number
   */
  async getOrderStatus(orderNumber: string) {
    const order = await prisma.topUpOrder.findUnique({
      where: { orderNumber },
      include: {
        game: true,
        package: true,
      },
    });

    if (!order) {
      throw new NotFoundError(`Top-Up Order ${orderNumber} not found`);
    }

    let qrString: string | undefined;
    let qrImage: string | undefined;

    if (order.paymentStatus === 'pending') {
      qrString = generateBakongKHQRString({
        orderNumber: order.orderNumber,
        amount: Number(order.totalAmount),
        currency: 'USD',
        merchantName: config.khqr.merchantName,
        merchantAccount: config.khqr.bakongId,
        merchantCity: config.khqr.merchantCity,
      });
      qrImage = await generateQRCodeImage(qrString);
    }

    return {
      orderNumber: order.orderNumber,
      gameTitle: order.game.title,
      gameIcon: order.game.iconUrl,
      packageName: order.package.name,
      packageCategory: order.package.category,
      currencyAmount: order.package.currencyAmount,
      totalAmount: Number(order.totalAmount),
      playerId: order.playerId,
      zoneId: order.zoneId,
      serverRegion: order.serverRegion,
      playerNickname: order.playerNickname,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      deliveryStatus: order.deliveryStatus,
      deliveryProof: order.deliveryProof,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      qrString,
      qrImage,
    };
  }

  /**
   * Fulfill Top-Up order by executing real or mock provider reload
   */
  async fulfillTopUp(orderNumber: string, externalTxnId?: string) {
    const order = await prisma.topUpOrder.findUnique({
      where: { orderNumber },
      include: {
        package: true,
        game: true,
      },
    });

    if (!order) {
      throw new NotFoundError(`Order ${orderNumber} not found`);
    }

    if (order.deliveryStatus === 'completed') {
      return {
        success: true,
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
        deliveryStatus: order.deliveryStatus,
        deliveryProof: order.deliveryProof,
        message: 'Order has already been fulfilled',
      };
    }

    const provider = getTopUpProvider();
    const result = await provider.fulfillOrder({
      orderNumber: order.orderNumber,
      gameTitle: order.game.title,
      packageId: order.package.id.toString(),
      packageName: order.package.name,
      currencyAmount: order.package.currencyAmount,
      playerId: order.playerId,
      zoneId: order.zoneId,
      serverRegion: order.serverRegion,
      playerNickname: order.playerNickname,
    });

    const updated = await prisma.topUpOrder.update({
      where: { orderNumber },
      data: {
        paymentStatus: 'paid',
        deliveryStatus: result.status,
        deliveryProof: result.deliveryProof,
        transactionReference: externalTxnId || result.providerOrderId || order.transactionReference,
        errorMessage: result.success ? null : result.message,
      },
      include: {
        game: true,
        package: true,
      },
    });

    return {
      success: result.success,
      orderNumber: updated.orderNumber,
      paymentStatus: updated.paymentStatus,
      deliveryStatus: updated.deliveryStatus,
      deliveryProof: updated.deliveryProof,
      message: result.message,
    };
  }

  /**
   * Simulate Bakong KHQR payment scan and trigger in-game currency delivery via Provider
   */
  async simulatePayment(orderNumber: string) {
    const order = await prisma.topUpOrder.findUnique({
      where: { orderNumber },
      include: {
        package: true,
        game: true,
      },
    });

    if (!order) {
      throw new NotFoundError(`Order ${orderNumber} not found`);
    }

    if (order.paymentStatus === 'paid') {
      return {
        success: true,
        message: 'Order has already been paid and processed',
        order,
      };
    }

    return await this.fulfillTopUp(orderNumber, `TXN-SIM-TU-${Date.now()}`);
  }

  /**
   * Get user's top-up order history
   */
  async getUserOrders(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const userBigInt = BigInt(userId);

    const [orders, total] = await Promise.all([
      prisma.topUpOrder.findMany({
        where: { userId: userBigInt },
        include: {
          game: true,
          package: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.topUpOrder.count({
        where: { userId: userBigInt },
      }),
    ]);

    return {
      orders: orders.map((o) => ({
        id: o.id.toString(),
        orderNumber: o.orderNumber,
        gameTitle: o.game.title,
        gameIcon: o.game.iconUrl,
        packageName: o.package.name,
        playerId: o.playerId,
        zoneId: o.zoneId,
        playerNickname: o.playerNickname,
        totalAmount: Number(o.totalAmount),
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        deliveryStatus: o.deliveryStatus,
        deliveryProof: o.deliveryProof,
        createdAt: o.createdAt,
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Track / Search orders for Guest Users without requiring login
   * Search by:
   * 1. Order Number (TU-xxxxxx)
   * 2. Player ID / UID
   * 3. Contact Phone Number
   */
  async trackGuestOrders(query: string, page = 1, limit = 20) {
    const trimmed = (query || '').trim();
    if (!trimmed || trimmed.length < 3) {
      throw new BadRequestError('Please provide at least 3 characters to search (Order Number, Player ID, or Phone)');
    }

    const skip = (page - 1) * limit;

    const whereClause: Prisma.TopUpOrderWhereInput = {
      OR: [
        { orderNumber: { contains: trimmed, mode: 'insensitive' } },
        { playerId: { contains: trimmed, mode: 'insensitive' } },
        { contactPhone: { contains: trimmed } },
      ],
    };

    const [orders, total] = await Promise.all([
      prisma.topUpOrder.findMany({
        where: whereClause,
        include: {
          game: true,
          package: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.topUpOrder.count({ where: whereClause }),
    ]);

    return {
      query: trimmed,
      orders: orders.map((o) => ({
        id: o.id.toString(),
        orderNumber: o.orderNumber,
        gameTitle: o.game.title,
        gameIcon: o.game.iconUrl,
        packageName: o.package.name,
        packageCategory: o.package.category,
        currencyAmount: o.package.currencyAmount,
        totalAmount: Number(o.totalAmount),
        playerId: o.playerId,
        zoneId: o.zoneId,
        serverRegion: o.serverRegion,
        playerNickname: o.playerNickname,
        contactPhone: o.contactPhone ? o.contactPhone.replace(/(\d{3})\d+(\d{3})/, '$1***$2') : null,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        deliveryStatus: o.deliveryStatus,
        deliveryProof: o.deliveryProof,
        createdAt: o.createdAt,
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export const topUpService = new TopUpService();
export default topUpService;
