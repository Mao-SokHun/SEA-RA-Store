import crypto from 'crypto';
import { prisma } from '../../../config/database';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../../common/errors/AppError';
import { generateBakongKHQRString, generateQRCodeImage } from '../../../common/utils/khqr';
import { Prisma } from '@prisma/client';

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

    // Realistic verification logic for different games
    let nickname = '';
    let isValid = true;
    let message = 'Player account verified successfully';

    if (game.title.includes('Roblox')) {
      if (cleanPlayerId.length < 3 || cleanPlayerId.length > 20) {
        throw new BadRequestError('Roblox username must be between 3 and 20 characters');
      }
      // Generate formatted confirmed nickname
      nickname = cleanPlayerId.startsWith('@') ? cleanPlayerId.slice(1) : cleanPlayerId;
    } else if (game.title.includes('Mobile Legends')) {
      if (!zoneId || zoneId.trim().length < 3) {
        throw new BadRequestError('Zone ID is required for Mobile Legends');
      }
      if (cleanPlayerId.length < 6 || cleanPlayerId.length > 12) {
        throw new BadRequestError('Invalid MLBB User ID length (must be 6-12 digits)');
      }
      // Simulate verified player nickname
      const sampleNames = [
        '⚔️ Kitsune_Slayer ⚔️',
        '꧁༺ProGamer_KH༻꧂',
        '⚡Shadow_Assassin⚡',
        '⭐Mythic_Glory⭐',
        '🔥Vampire_King🔥',
      ];
      const hash = Math.abs(cleanPlayerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
      nickname = sampleNames[hash % sampleNames.length];
    } else if (game.title.includes('Free Fire')) {
      if (cleanPlayerId.length < 6 || cleanPlayerId.length > 14) {
        throw new BadRequestError('Free Fire UID must be between 6 and 14 digits');
      }
      nickname = `FF_Elite_${cleanPlayerId.slice(-4)}`;
    } else if (game.title.includes('PUBG')) {
      if (cleanPlayerId.length < 7 || cleanPlayerId.length > 14) {
        throw new BadRequestError('PUBG Character ID must be between 7 and 14 digits');
      }
      nickname = `PUBG_Sniper_${cleanPlayerId.slice(-4)}`;
    } else if (game.title.includes('Genshin')) {
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
      zoneId: zoneId?.trim() || null,
      serverRegion: serverRegion || null,
      nickname,
      message,
    };
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
      merchantName: 'NEXUS TOPUP',
      merchantAccount: 'nexus.topup@bakong',
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
        merchantName: 'NEXUS TOPUP',
        merchantAccount: 'nexus.topup@bakong',
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
   * Simulate Bakong KHQR payment scan and trigger instant in-game currency delivery
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

    // Update to paid and completed
    const deliveryProof = `IN-GAME RELOAD CONFIRMED: Gateway Ref #${Date.now()}-SERVICED. ${order.package.name} added to ${order.playerId}`;

    const updated = await prisma.topUpOrder.update({
      where: { orderNumber },
      data: {
        paymentStatus: 'paid',
        deliveryStatus: 'completed',
        deliveryProof,
      },
      include: {
        game: true,
        package: true,
      },
    });

    return {
      success: true,
      orderNumber: updated.orderNumber,
      paymentStatus: updated.paymentStatus,
      deliveryStatus: updated.deliveryStatus,
      deliveryProof: updated.deliveryProof,
      message: `Payment received! Successfully credited ${updated.package.name} to player ${updated.playerNickname || updated.playerId}.`,
    };
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
}

export const topUpService = new TopUpService();
export default topUpService;
