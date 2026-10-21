# 🎮 Game Account Marketplace Platform

A production-ready, hybrid B2C & C2C Game Account Trading Platform built with Node.js, Express, TypeScript, Prisma ORM, and Neon Serverless PostgreSQL.

---

## 🏗️ Architecture & Features

- **Hybrid Business Model**:
  - **B2C (Platform-Owned)**: Verified stock purchased & sold directly with instant delivery.
  - **C2C (Escrow Trading)**: Community marketplace with 15-minute reservation timer, automated escrow, and 10% platform commission.
- **Enterprise Security**:
  - AES-256-GCM encrypted credentials vault for game account login secrets.
  - Dual-token JWT (Access 15m / Refresh 7d) with automatic Token Rotation and HTTP-only cookies.
  - Brute force lockout protection (15 minutes after 5 failed attempts).
  - Comprehensive audit logging (`security_audit_logs`).
- **Database & Cloud Infrastructure**:
  - **Neon Serverless PostgreSQL** with connection pooling.
  - 25 strongly typed relational tables via Prisma ORM.
  - Socket.io live escrow order chat and notifications gateway.

---

## 🗄️ Database Tables (25 Models)

1. **Users & Security**: `users`, `user_social_accounts`, `user_refresh_tokens`, `password_reset_tokens`, `security_audit_logs`, `telegram_notification_settings`
2. **Game Catalog**: `games`, `game_accounts`, `game_account_binds`, `account_credentials`, `account_images`
3. **Orders & Escrow**: `orders`, `account_warranties`, `payments`, `disputes`, `chat_messages`
4. **Wallets & Finance**: `wallets`, `wallet_transactions`, `withdrawal_requests`
5. **Marketing & Referrals**: `coupons`, `coupon_redemptions`, `user_referrals`, `referral_rewards`
6. **Seller Compliance**: `seller_kyc_verifications`, `seller_security_deposits`

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js >= 18
- Neon PostgreSQL Account / Database URL

### 2. Installation
```bash
cd backend
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env` and fill in your credentials:
```bash
cp .env.example .env
```

### 4. Database Setup & Seeding
```bash
# Push Prisma schema to Neon
npm run db:push

# Seed popular games and initial admin account
npm run db:seed
```

### 5. Running the Backend
```bash
# Development mode with live reload
npm run dev

# Build for production
npm run build
npm start
```

---

## 📡 API Endpoints

- **Health Check**: `GET /health`
- **API Base**: `GET /api/v1`
- **Auth Endpoints**:
  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/login`
  - `POST /api/v1/auth/refresh-token`
  - `POST /api/v1/auth/logout`
  - `POST /api/v1/auth/forgot-password`
  - `POST /api/v1/auth/reset-password`
  - `GET /api/v1/auth/me`
