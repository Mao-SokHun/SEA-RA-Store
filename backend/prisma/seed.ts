import { prisma } from '../src/config/database';
import bcrypt from 'bcryptjs';
import { encryptAES } from '../src/common/utils/crypto';
import { Prisma } from '@prisma/client';

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Seed Games
  const games = [
    {
      title: 'Roblox',
      platform: 'Cross-platform',
      iconUrl: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=200',
      isActive: true,
    },
    {
      title: 'Mobile Legends: Bang Bang',
      platform: 'Mobile',
      iconUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200',
      isActive: true,
    },
    {
      title: 'Free Fire',
      platform: 'Mobile',
      iconUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200',
      isActive: true,
    },
    {
      title: 'PUBG Mobile',
      platform: 'Mobile',
      iconUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=200',
      isActive: true,
    },
    {
      title: 'Valorant',
      platform: 'PC',
      iconUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200',
      isActive: true,
    },
    {
      title: 'Genshin Impact',
      platform: 'Cross-platform',
      iconUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=200',
      isActive: true,
    },
    {
      title: 'Honor of Kings',
      platform: 'Mobile',
      iconUrl: 'https://images.unsplash.com/photo-1612287233207-6b22998a445b?w=200',
      isActive: true,
    },
  ];

  for (const game of games) {
    const existing = await prisma.game.findFirst({
      where: { title: game.title },
    });
    if (!existing) {
      await prisma.game.create({ data: game });
      console.log(`  + Seeded game: ${game.title}`);
    }
  }

  // 2. Seed Default Admin User
  const adminEmail = 'admin@gameplatform.local';
  let admin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!admin) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Admin@2026!Secure', salt);

    admin = await prisma.user.create({
      data: {
        username: 'nexus_admin',
        email: adminEmail,
        passwordHash,
        referralCode: 'ADMIN-VIP-001',
        isEmailVerified: true,
        isPhoneVerified: true,
        role: 'admin',
        status: 'active',
      },
    });

    // Create wallet for admin
    await prisma.wallet.create({
      data: {
        userId: admin.id,
        balance: 1000.0,
      },
    });

    console.log('  + Seeded Admin user: admin@gameplatform.local');
  }

  // 3. Seed Default Coupons
  const defaultCoupon = await prisma.coupon.findUnique({
    where: { code: 'WELCOME2026' },
  });

  if (!defaultCoupon) {
    const validUntil = new Date();
    validUntil.setFullYear(validUntil.getFullYear() + 1);

    await prisma.coupon.create({
      data: {
        code: 'WELCOME2026',
        discountType: 'fixed_amount',
        discountValue: 1.0, // $1.00 off
        minOrderAmount: 5.0,
        usageLimit: 1000,
        perUserLimit: 1,
        validUntil,
        isActive: true,
      },
    });
    console.log('  + Seeded Welcome Coupon: WELCOME2026 ($1 OFF)');
  }

  // 4. Seed Popular Game Accounts (including Roblox)
  const robloxGame = await prisma.game.findFirst({ where: { title: 'Roblox' } });
  const mlbbGame = await prisma.game.findFirst({ where: { title: 'Mobile Legends: Bang Bang' } });
  const ffGame = await prisma.game.findFirst({ where: { title: 'Free Fire' } });
  const pubgGame = await prisma.game.findFirst({ where: { title: 'PUBG Mobile' } });

  const sampleAccounts = [
    {
      gameId: robloxGame?.id,
      title: 'Roblox • Blox Fruits Max Lv 2550 + Perm Kitsune & Dough V2',
      description: 'Blox Fruits Max Level 2550 with Godhuman, Cursed Dual Katana, Perm Kitsune, Dough V2 Awaken, Soul Guitar. 10,000 Robux accessories inventory. 100% clean email, phone unset.',
      price: 35.0,
      rankLevel: 'Max Lv 2550 (30M Bounty)',
      serverRegion: 'Global',
      deliveryType: 'instant',
      loginId: 'roblox_pro_buyer@gmail.com',
      password: 'RobloxSecret2026!',
      images: [
        'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=800&q=80',
      ],
      bindProvider: 'roblox',
      bindNote: 'Clean original email, phone number unset, 2FA unset',
    },
    {
      gameId: robloxGame?.id,
      title: 'Roblox • Adopt Me Mega Neon Shadow Dragon + Pet Sim 99 Huge Pets',
      description: 'Mega Neon FR Shadow Dragon, Neon Bat Dragon, 15+ Huge Pets in Pet Simulator 99, 25,000 Robux spent avatar, age 13+ verified.',
      price: 65.0,
      rankLevel: 'Whale Collector',
      serverRegion: 'Global',
      deliveryType: 'instant',
      loginId: 'adoptme_whale@gmail.com',
      password: 'AdoptMeSecret2026!',
      images: [
        'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
      ],
      bindProvider: 'roblox',
      bindNote: 'Original email included, pin unset',
    },
    {
      gameId: mlbbGame?.id,
      title: 'Mobile Legends • Mythic Immortal 145★ All Collector Skins + 850 Skins',
      description: 'Full Collector Skins (Gusion, Lesley, Aldous, Granger), All Exorcist, 11.11, Aspire skins. Max Emblems, Winrate 72%. Moonton all binds clean.',
      price: 89.0,
      rankLevel: 'Mythic Immortal',
      serverRegion: 'Asia (Cambodia)',
      deliveryType: 'instant',
      loginId: 'mlbb_immortal@gmail.com',
      password: 'MlbbSecret2026!',
      images: [
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
      ],
      bindProvider: 'moonton',
      bindNote: 'Moonton clean bind, changeable to buyer email',
    },
    {
      gameId: ffGame?.id,
      title: 'Free Fire • Old Season 1 Sakura + Hip Hop Bundle + All Max EVO Guns',
      description: 'Rare OG Account: S1 Sakura, S2 Hip Hop, Old Bunny Bundle, MP40 Cobra Lv 7, AK Dragon Lv 7, M1014 Green Flame Lv 7. Clean Google Login.',
      price: 49.0,
      rankLevel: 'Heroic Rank',
      serverRegion: 'Asia',
      deliveryType: 'instant',
      loginId: 'freefire_og@gmail.com',
      password: 'FFSecret2026!',
      images: [
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
      ],
      bindProvider: 'google',
      bindNote: 'Clean Gmail, no 2FA',
    },
    {
      gameId: pubgGame?.id,
      title: 'PUBG Mobile • Glacier M416 Lv 7 Max + Pharaoh X-Suit 6-Star',
      description: 'M416 Glacier Lv 7 On-Hit Effect & Loot Crate, Pharaoh X-Suit 6-Star, Blood Raven X-Suit, Fool M416 Lv 4, Conqueror Frame C1S1.',
      price: 110.0,
      rankLevel: 'Conqueror',
      serverRegion: 'Asia',
      deliveryType: 'instant',
      loginId: 'pubg_conqueror@gmail.com',
      password: 'PubgSecret2026!',
      images: [
        'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
      ],
      bindProvider: 'twitter',
      bindNote: 'Single Twitter bind, email changeable',
    },
  ];

  if (admin) {
    for (const acc of sampleAccounts) {
      if (!acc.gameId) continue;
      const existingAccount = await prisma.gameAccount.findFirst({
        where: { title: acc.title },
      });

      if (!existingAccount) {
        const encryptedId = encryptAES(acc.loginId);
        const encryptedPass = encryptAES(acc.password);

        const newAccount = await prisma.gameAccount.create({
          data: {
            sellerId: admin.id,
            gameId: acc.gameId,
            title: acc.title,
            description: acc.description,
            price: new Prisma.Decimal(acc.price),
            serverRegion: acc.serverRegion,
            rankLevel: acc.rankLevel,
            deliveryType: acc.deliveryType,
            isPlatformOwned: true,
            status: 'available',
          },
        });

        // Add credential vault
        await prisma.accountCredential.create({
          data: {
            gameAccountId: newAccount.id,
            keyVersion: 1,
            initializationVector: encryptedPass.iv,
            authTag: encryptedPass.authTag,
            encryptedLoginIdentifier: encryptedId.encryptedData,
            encryptedLoginPassword: encryptedPass.encryptedData,
            extraInstructions: 'Please change password and add your own 2FA immediately after inspecting.',
          },
        });

        // Add bind
        await prisma.gameAccountBind.create({
          data: {
            gameAccountId: newAccount.id,
            bindProvider: acc.bindProvider,
            bindStatus: 'clean',
            note: acc.bindNote,
          },
        });

        // Add image
        await prisma.accountImage.create({
          data: {
            gameAccountId: newAccount.id,
            imageUrl: acc.images[0],
            isPrimary: true,
          },
        });

        console.log(`  + Seeded account listing: ${acc.title}`);
      }
    }
  }

  console.log('✅ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
