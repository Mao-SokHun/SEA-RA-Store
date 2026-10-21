import { prisma } from '../src/config/database';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Seed Games
  const games = [
    {
      title: 'Mobile Legends: Bang Bang',
      platform: 'Mobile',
      iconUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200',
      isActive: true,
    },
    {
      title: 'PUBG Mobile',
      platform: 'Mobile',
      iconUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=200',
      isActive: true,
    },
    {
      title: 'Free Fire',
      platform: 'Mobile',
      iconUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200',
      isActive: true,
    },
    {
      title: 'Honor of Kings',
      platform: 'Mobile',
      iconUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=200',
      isActive: true,
    },
    {
      title: 'Genshin Impact',
      platform: 'Cross-platform',
      iconUrl: 'https://images.unsplash.com/photo-1612287233207-6b22998a445b?w=200',
      isActive: true,
    },
    {
      title: 'Valorant',
      platform: 'PC',
      iconUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200',
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
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Admin@2026!Secure', salt);

    const admin = await prisma.user.create({
      data: {
        username: 'admin',
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
        balance: 0,
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
