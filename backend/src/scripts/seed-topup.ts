import { prisma } from '../config/database';
import { Prisma } from '@prisma/client';

async function seedTopUpPackages() {
  console.log('💎 Seeding Top-Up Packages for popular games...');

  // 1. Ensure Games exist with proper iconUrl and metadata
  const gamesData = [
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
      title: 'Genshin Impact',
      platform: 'Cross-platform',
      iconUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=200',
      isActive: true,
    },
    {
      title: 'Valorant',
      platform: 'PC',
      iconUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200',
      isActive: true,
    },
    {
      title: 'Honor of Kings',
      platform: 'Mobile',
      iconUrl: 'https://images.unsplash.com/photo-1612287233207-6b22998a445b?w=200',
      isActive: true,
    },
  ];

  for (const g of gamesData) {
    const existing = await prisma.game.findFirst({ where: { title: g.title } });
    if (!existing) {
      await prisma.game.create({ data: g });
    }
  }

  const allGames = await prisma.game.findMany();
  const getGame = (name: string) => allGames.find((g) => g.title.toLowerCase().includes(name.toLowerCase()));

  const roblox = getGame('Roblox');
  const mlbb = getGame('Mobile Legends');
  const freeFire = getGame('Free Fire');
  const pubg = getGame('PUBG');
  const genshin = getGame('Genshin');
  const valorant = getGame('Valorant');
  const hok = getGame('Honor of Kings');

  const packages: Array<{
    gameId?: bigint;
    name: string;
    category: string;
    currencyAmount: number;
    bonusAmount: number;
    price: number;
    originalPrice: number;
    badge?: string;
    sortOrder: number;
  }> = [];

  // 1. Roblox (Robux)
  if (roblox) {
    packages.push(
      { gameId: roblox.id, name: '80 Robux', category: 'currency', currencyAmount: 80, bonusAmount: 0, price: 0.99, originalPrice: 1.20, badge: 'STARTER', sortOrder: 1 },
      { gameId: roblox.id, name: '400 Robux', category: 'currency', currencyAmount: 400, bonusAmount: 0, price: 4.50, originalPrice: 5.00, badge: 'POPULAR', sortOrder: 2 },
      { gameId: roblox.id, name: '800 Robux', category: 'currency', currencyAmount: 800, bonusAmount: 0, price: 8.90, originalPrice: 10.00, badge: 'HOT 🔥', sortOrder: 3 },
      { gameId: roblox.id, name: '1,700 Robux', category: 'currency', currencyAmount: 1700, bonusAmount: 0, price: 18.50, originalPrice: 21.00, badge: 'BEST VALUE', sortOrder: 4 },
      { gameId: roblox.id, name: '4,500 Robux', category: 'currency', currencyAmount: 4500, bonusAmount: 0, price: 47.00, originalPrice: 53.00, badge: 'WHALE', sortOrder: 5 },
      { gameId: roblox.id, name: '10,000 Robux', category: 'currency', currencyAmount: 10000, bonusAmount: 0, price: 95.00, originalPrice: 110.00, badge: 'ELITE VIP', sortOrder: 6 },
      { gameId: roblox.id, name: 'Roblox Premium 450 (Monthly)', category: 'pass', currencyAmount: 450, bonusAmount: 0, price: 4.99, originalPrice: 6.00, badge: 'MONTHLY PASS', sortOrder: 7 }
    );
  }

  // 2. MLBB (Diamonds)
  if (mlbb) {
    packages.push(
      { gameId: mlbb.id, name: '86 Diamonds (78 + 8 Bonus)', category: 'currency', currencyAmount: 86, bonusAmount: 8, price: 1.40, originalPrice: 1.70, badge: 'FAST', sortOrder: 1 },
      { gameId: mlbb.id, name: '172 Diamonds (156 + 16 Bonus)', category: 'currency', currencyAmount: 172, bonusAmount: 16, price: 2.80, originalPrice: 3.40, badge: 'POPULAR', sortOrder: 2 },
      { gameId: mlbb.id, name: '257 Diamonds (234 + 23 Bonus)', category: 'currency', currencyAmount: 257, bonusAmount: 23, price: 4.10, originalPrice: 5.00, badge: 'HOT 🔥', sortOrder: 3 },
      { gameId: mlbb.id, name: '706 Diamonds (625 + 81 Bonus)', category: 'currency', currencyAmount: 706, bonusAmount: 81, price: 10.90, originalPrice: 13.50, badge: 'BEST VALUE', sortOrder: 4 },
      { gameId: mlbb.id, name: '2,195 Diamonds (1860 + 335 Bonus)', category: 'currency', currencyAmount: 2195, bonusAmount: 335, price: 32.00, originalPrice: 39.00, badge: 'PRO PACK', sortOrder: 5 },
      { gameId: mlbb.id, name: 'Weekly Diamond Pass', category: 'pass', currencyAmount: 210, bonusAmount: 0, price: 1.85, originalPrice: 2.50, badge: '🔥 +400% VALUE', sortOrder: 6 },
      { gameId: mlbb.id, name: 'Twilight Pass', category: 'pass', currencyAmount: 1, bonusAmount: 0, price: 9.99, originalPrice: 12.00, badge: 'SEASON PASS', sortOrder: 7 }
    );
  }

  // 3. Free Fire (Diamonds)
  if (freeFire) {
    packages.push(
      { gameId: freeFire.id, name: '100 Diamonds', category: 'currency', currencyAmount: 100, bonusAmount: 10, price: 0.90, originalPrice: 1.20, badge: 'FAST', sortOrder: 1 },
      { gameId: freeFire.id, name: '310 Diamonds', category: 'currency', currencyAmount: 310, bonusAmount: 31, price: 2.70, originalPrice: 3.20, badge: 'POPULAR', sortOrder: 2 },
      { gameId: freeFire.id, name: '520 Diamonds', category: 'currency', currencyAmount: 520, bonusAmount: 52, price: 4.40, originalPrice: 5.20, badge: 'HOT 🔥', sortOrder: 3 },
      { gameId: freeFire.id, name: '1,060 Diamonds', category: 'currency', currencyAmount: 1060, bonusAmount: 106, price: 8.80, originalPrice: 10.50, badge: 'BEST VALUE', sortOrder: 4 },
      { gameId: freeFire.id, name: '2,180 Diamonds', category: 'currency', currencyAmount: 2180, bonusAmount: 218, price: 17.50, originalPrice: 21.00, badge: 'WHALE', sortOrder: 5 },
      { gameId: freeFire.id, name: 'Weekly Membership', category: 'pass', currencyAmount: 450, bonusAmount: 0, price: 1.90, originalPrice: 2.50, badge: 'PASS', sortOrder: 6 },
      { gameId: freeFire.id, name: 'Monthly Membership', category: 'pass', currencyAmount: 2600, bonusAmount: 0, price: 7.50, originalPrice: 9.50, badge: 'MEGA PASS', sortOrder: 7 }
    );
  }

  // 4. PUBG Mobile (UC)
  if (pubg) {
    packages.push(
      { gameId: pubg.id, name: '60 UC', category: 'currency', currencyAmount: 60, bonusAmount: 0, price: 0.95, originalPrice: 1.20, badge: 'STARTER', sortOrder: 1 },
      { gameId: pubg.id, name: '325 UC (300 + 25 Bonus)', category: 'currency', currencyAmount: 325, bonusAmount: 25, price: 4.80, originalPrice: 5.50, badge: 'POPULAR', sortOrder: 2 },
      { gameId: pubg.id, name: '660 UC (600 + 60 Bonus)', category: 'currency', currencyAmount: 660, bonusAmount: 60, price: 9.50, originalPrice: 11.00, badge: 'HOT 🔥', sortOrder: 3 },
      { gameId: pubg.id, name: '1,800 UC (1500 + 300 Bonus)', category: 'currency', currencyAmount: 1800, bonusAmount: 300, price: 23.50, originalPrice: 28.00, badge: 'BEST VALUE', sortOrder: 4 },
      { gameId: pubg.id, name: '3,850 UC', category: 'currency', currencyAmount: 3850, bonusAmount: 850, price: 46.00, originalPrice: 55.00, badge: 'WHALE', sortOrder: 5 },
      { gameId: pubg.id, name: 'Royale Pass Upgrade Card', category: 'pass', currencyAmount: 360, bonusAmount: 0, price: 5.40, originalPrice: 6.50, badge: 'PASS', sortOrder: 6 }
    );
  }

  // 5. Genshin Impact (Genesis Crystals)
  if (genshin) {
    packages.push(
      { gameId: genshin.id, name: '60 Genesis Crystals', category: 'currency', currencyAmount: 60, bonusAmount: 0, price: 0.95, originalPrice: 1.15, badge: 'STARTER', sortOrder: 1 },
      { gameId: genshin.id, name: '300 + 30 Genesis Crystals', category: 'currency', currencyAmount: 330, bonusAmount: 30, price: 4.80, originalPrice: 5.50, badge: 'POPULAR', sortOrder: 2 },
      { gameId: genshin.id, name: '980 + 110 Genesis Crystals', category: 'currency', currencyAmount: 1090, bonusAmount: 110, price: 14.50, originalPrice: 16.50, badge: 'HOT 🔥', sortOrder: 3 },
      { gameId: genshin.id, name: '1,980 + 260 Genesis Crystals', category: 'currency', currencyAmount: 2240, bonusAmount: 260, price: 28.50, originalPrice: 32.50, badge: 'BEST VALUE', sortOrder: 4 },
      { gameId: genshin.id, name: 'Blessing of the Welkin Moon', category: 'pass', currencyAmount: 3000, bonusAmount: 300, price: 4.70, originalPrice: 5.99, badge: '🔥 +600% VALUE', sortOrder: 5 }
    );
  }

  // 6. Valorant (Valorant Points)
  if (valorant) {
    packages.push(
      { gameId: valorant.id, name: '475 VP', category: 'currency', currencyAmount: 475, bonusAmount: 0, price: 4.80, originalPrice: 5.50, badge: 'STARTER', sortOrder: 1 },
      { gameId: valorant.id, name: '1,000 VP', category: 'currency', currencyAmount: 1000, bonusAmount: 0, price: 9.60, originalPrice: 11.00, badge: 'POPULAR', sortOrder: 2 },
      { gameId: valorant.id, name: '2,050 VP', category: 'currency', currencyAmount: 2050, bonusAmount: 50, price: 19.00, originalPrice: 22.00, badge: 'HOT 🔥', sortOrder: 3 },
      { gameId: valorant.id, name: '3,650 VP', category: 'currency', currencyAmount: 3650, bonusAmount: 150, price: 33.50, originalPrice: 38.00, badge: 'BEST VALUE', sortOrder: 4 }
    );
  }

  // 7. Honor of Kings (Tokens)
  if (hok) {
    packages.push(
      { gameId: hok.id, name: '80 Tokens', category: 'currency', currencyAmount: 80, bonusAmount: 0, price: 0.95, originalPrice: 1.20, badge: 'FAST', sortOrder: 1 },
      { gameId: hok.id, name: '240 Tokens', category: 'currency', currencyAmount: 240, bonusAmount: 0, price: 2.80, originalPrice: 3.30, badge: 'POPULAR', sortOrder: 2 },
      { gameId: hok.id, name: '400 Tokens', category: 'currency', currencyAmount: 400, bonusAmount: 0, price: 4.50, originalPrice: 5.20, badge: 'HOT 🔥', sortOrder: 3 },
      { gameId: hok.id, name: '800 Tokens', category: 'currency', currencyAmount: 800, bonusAmount: 0, price: 8.90, originalPrice: 10.50, badge: 'BEST VALUE', sortOrder: 4 },
      { gameId: hok.id, name: 'Weekly Card', category: 'pass', currencyAmount: 100, bonusAmount: 0, price: 1.99, originalPrice: 2.50, badge: 'PASS', sortOrder: 5 }
    );
  }

  for (const pkg of packages) {
    if (!pkg.gameId) continue;
    const existing = await prisma.topUpPackage.findFirst({
      where: {
        gameId: pkg.gameId,
        name: pkg.name,
      },
    });

    if (!existing) {
      await prisma.topUpPackage.create({
        data: {
          gameId: pkg.gameId,
          name: pkg.name,
          category: pkg.category,
          currencyAmount: pkg.currencyAmount,
          bonusAmount: pkg.bonusAmount,
          price: new Prisma.Decimal(pkg.price),
          originalPrice: pkg.originalPrice ? new Prisma.Decimal(pkg.originalPrice) : null,
          badge: pkg.badge,
          sortOrder: pkg.sortOrder,
          isActive: true,
        },
      });
      console.log(`  + Seeded package: ${pkg.name} ($${pkg.price})`);
    }
  }

  console.log('✅ Top-Up Packages seeded successfully!');
}

seedTopUpPackages()
  .catch((e) => {
    console.error('❌ Failed to seed top-up packages:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
