# GameVerse • Game Top-Up Platform (Frontend)

Production-ready, ultra-responsive modern frontend for **GameVerse** (SEA RA Gaming Top-Up Platform), designed following the dark cyber gaming portal aesthetic.

## 🚀 Key Features

1. **Dark Cyber Gaming UI / Design System**:
   - Deep navy backgrounds (`#070B17` → `#0B1224`), glassmorphism cards (`#0F1A35` with `#2B6CFF35` borders).
   - Electric cyan accents (`#22D3EE` / `#3B82F6`), vibrant orange CTA buttons (`#FF7A18`), and gold badges.
   - Smooth carousel slides, hover lifts, and zero generic AI icons.

2. **Full Page Architecture (Top to Bottom)**:
   - **Sticky Navbar**: Brand logo crest, navigation tabs (`Home`, `Explore Games`, `Promotions`, `Orders`, `Support`), search bar with popover, bilingual switch (Khmer 🇰🇭 / English 🇺🇸), user avatar, notification bell, and cart.
   - **Hero Carousel**: Full-width panoramic battle banner (`SHADOWFALL: LEGACY`, `ROBLOX`, `MOBILE LEGENDS`), [Top Up Now] & [View Packages] buttons, carousel arrows and pagination dots.
   - **Top-Up Categories**: The 6 required category filter chips with icons.
   - **Featured Games**: 4-card grid with cover artwork, developer info, 5-star ratings, and cyan gradient action buttons.
   - **Trending Now**: Horizontal scroll row featuring player and order counts.
   - **Live Orders & Top Buyers**: Real-time recent transaction ticker and weekly VIP buyer leaderboard.
   - **Promotions & News**: 3 cards (Summer Sale, Esports Season, Publisher API Updates).
   - **Game Store Deals**: Compact panel showcasing discounted packages with DEAL badges.
   - **Why Choose Us**: 4 trust badges (3-sec instant delivery, 100% safe without password, 0% fee Bakong KHQR, 24/7 Khmer support).
   - **Footer**: 6 quick links, glowing center Shield Crest with social icons (Telegram, Discord, TikTok, Facebook), newsletter subscription input, and copyright.

3. **Interactive Top-Up Flow Cockpit**:
   - Dynamic account input fields based on `game.accountFields` (User ID, Zone ID, Server Region, Riot ID, etc.).
   - [Verify ID] button with real-time IGN check (`Verified Player: Slayer_ProKH ✓`).
   - Package selection grid with bonus amounts, USD and KHR (`$1 = 4,100 KHR`).
   - Payment method selection: Bakong KHQR (0% fee), ABA Pay, Wing, ACLEDA, USDT.
   - Promo code validation (`SEARAVIP` / `GAMEVERSE` gives 10% instant discount).
   - Order Status Modal with status timeline (`Pending` → `Paid` → `Processing` → `Delivered`), QR code generator, and `Test Simulate Payment` button for instant testing.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + Custom Neon Cyber Gaming Design Tokens
- **State Management**: Zustand (`src/store/useOrderStore.ts`)
- **Localization**: Bilingual Khmer / English dictionary (`src/i18n/translations.ts`)
- **Icons**: Lucide React
- **Animations / FX**: Canvas Confetti + CSS Keyframe Auras

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open browser
http://localhost:3000
```

---

## 🔌 How to Swap Mock Data for a Real Backend (FastAPI / Node.js)

All mock data is cleanly separated in `/src/data/`:
- `src/data/games.ts`: Contains the 10 games, account field definitions, and packages.
- `src/data/news.ts`: Contains news promotions, deals, live orders, and top buyers.
- `src/data/payments.ts`: Contains payment gateway configurations.

To connect to a live FastAPI or REST backend:
1. Update `src/store/useOrderStore.ts` where `fetch()` or `axios` calls are made.
2. In `verifyPlayerId()`:
   ```ts
   const response = await fetch(`${API_URL}/api/v1/games/verify`, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ gameId: activeGame.id, accountData }),
   });
   const data = await response.json();
   set({ verifiedNickname: data.nickname });
   ```
3. In `submitOrder()`:
   ```ts
   const response = await fetch(`${API_URL}/api/v1/orders/create`, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ gameId, packageId, accountData, paymentMethodId }),
   });
   const order = await response.json();
   set({ currentOrder: order, showSuccessModal: true });
   ```
