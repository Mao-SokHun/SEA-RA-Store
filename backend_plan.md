# 🎮 Game Account Marketplace - Backend Development Plan

## 📋 Project Summary (ពីការអាន Files ទាំងអស់)

### Business Model (Hybrid Model)

- **B2C (Platform-Owned)**: Platform ទិញ Account យកមកលក់ផ្ទាល់ → ចំណូល 100% ចូល Platform
- **C2C (Marketplace)**: Users ដាក់លក់ Account → Platform កាត់ Commission 10% → Seller ទទួល 90% ចូល Wallet

### Core System Flow

1. **Listing** → Seller បង្កើត listing + credentials (AES-256-GCM encrypted)
2. **Checkout** → Buyer ទិញ → Account reserved 15 min (Redis Redlock)
3. **Payment** → KHQR/Bakong webhook verification
4. **Delivery** → Instant (decrypt credentials) / Manual (chat transfer)
5. **Settlement** → B2C: direct revenue / C2C: escrow → commission deduction → wallet credit
6. **Withdrawal** → Seller request → Admin approve → Bank transfer (ABA/Wing/ACLEDA)

---

## 🏗️ Tech Stack (From Specification)

| Component       | Technology                               |
| --------------- | ---------------------------------------- |
| Runtime         | Node.js (TypeScript)                     |
| Framework       | Express.js + Clean Architecture          |
| Database        | PostgreSQL 16+                           |
| ORM             | Prisma ORM                               |
| Cache & Locking | Redis (Redlock)                          |
| Real-time       | Socket.io                                |
| Object Storage  | Cloudflare R2 / AWS S3                   |
| Auth            | JWT Dual-Token + OAuth (Google/Telegram) |
| Encryption      | AES-256-GCM                              |
| API Docs        | Swagger / OpenAPI 3.0                    |

---

## 📊 Database Tables (22 Tables)

### Core Tables

1. `users` - User accounts (buyer/seller/admin)
2. `user_social_accounts` - OAuth Google & Telegram
3. `user_refresh_tokens` - JWT refresh token management
4. `password_reset_tokens` - Forget password flow
5. `security_audit_logs` - Security action logging
6. `telegram_notification_settings` - Telegram bot notifications

### Product Tables

7. `games` - Game catalog (MLBB, PUBG, Genshin, Valorant)
8. `game_accounts` - Account listings
9. `game_account_binds` - Bind status (clean/changeable/dead)
10. `account_credentials` - Encrypted credentials vault
11. `account_images` - Account screenshots

### Order & Payment Tables

12. `orders` - Order management with listing snapshot
13. `account_warranties` - Warranty packages (7d/30d/lifetime)
14. `payments` - Payment records
15. `wallets` - Seller digital wallets
16. `wallet_transactions` - Ledger transactions
17. `withdrawal_requests` - Bank withdrawal requests
18. `disputes` - Order disputes

### Marketing Tables

19. `coupons` - Discount coupons
20. `coupon_redemptions` - Coupon usage tracking
21. `user_referrals` - Referral system
22. `referral_rewards` - Referral rewards

---

## 🔨 9-Step Implementation Flow

### Step 1: Project Setup & Infrastructure ✅ COMPLETED

- Express TypeScript + Clean Architecture folder structure
- Neon Serverless PostgreSQL Connection Configured
- Environment config validation with strict typing
- Error handling, BigInt serialization, and response formatters

### Step 2: Database Migration & Seeding ✅ COMPLETED

- Prisma schema with 25 tables (including Seller KYC & Security Deposits)
- Prisma 7 with @prisma/adapter-pg connection pool
- Synced to Neon Cloud PostgreSQL
- Seed data injected (6 games, Admin user, Welcome Coupon, Wallets)

### Step 3: Authentication & Security Module ✅ COMPLETED

- Register & Login (bcrypt hashing, lockout protection after 5 failed attempts)
- JWT Dual-Token (Access 15m / Refresh 7d with Token Rotation & HTTP-only cookies)
- Referral code auto-generation and referrer tracking upon registration
- Auto-wallet creation upon user registration
- Password Reset Flow (secure token, invalidate tokens, password change)
- RBAC Middleware (buyer / seller / admin) & Security Audit Logs (`security_audit_logs`)

### Step 4: Game Catalog & Credential Vault ✅ COMPLETED

- Game/Category API (list, filter, admin create/update)
- CRUD Account Listings with multi-attribute filtering & pagination
- Auto-reset expired reservations sweep
- Zero-Knowledge AES-256-GCM Vault for account credentials
- Multi-image screenshots and multi-provider binds (clean/changeable/unchangeable)

### Step 5: Order & Concurrency Lock

- Checkout endpoint with Redis Redlock (15 min)
- Order state machine
- Auto-release worker (cron/keyspace notification)

### Step 6: Payment & Webhook (Bakong KHQR)

- KHQR generator
- Webhook verification (HMAC-SHA256, idempotency)
- Coupon engine & warranty fee calculation

### Step 7: Wallet & Escrow Engine

- Ledger accounting (B2C/C2C)
- Commission deduction (10%)
- Withdrawal management
- Double-entry rollback & referral distribution

### Step 8: Real-time Chat & Dispute

- WebSocket gateway (Socket.io)
- Dispute handling APIs
- Telegram Bot notifications

### Step 9: Testing & API Docs

- Swagger UI at /api/docs
- Integration & E2E tests
