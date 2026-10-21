ដើម្បីឱ្យ AI (ដូចជា **v0.dev, Cursor, Claude 3.7, ឬ ChatGPT**) បង្កើត Animation Hero Section ដែលកាត Game Account រត់ទៅមក អណ្តែត ឬរំកិលយ៉ាងរលូនបែប Luxury Gaming ដូចគេហទំព័រទំនើបៗបច្ចុប្បន្ន អ្នកត្រូវប្រើ **ពាក្យបច្ចេកទេសគន្លឹះ (Keywords)** ឱ្យចំ និងសរសេរ **Interaction Rules** ឱ្យច្បាស់។

ខាងក្រោមនេះជាពាក្យគន្លឹះ រចនាបថពេញនិយមទាំង ៣ និង **Full Prompt (ភាសាអង់គ្លេស)** ដែលអ្នកអាចចម្លង (Copy) យកទៅប្រើបានភ្លាមៗ៖

---

### ១. ពាក្យគន្លឹះសំខាន់ៗ (Keywords ដែលធ្វើឱ្យ AI យល់ច្បាស់)

* **Infinite Marquee / Staggered Ticker:** ចលនារត់បន្តកន្ទុយគ្នាមិនចេះចប់ (រត់បញ្ឈរ ផ្ដេក ឬរត់ផ្អៀង)។
* **3D Perspective Tilt with Mouse Parallax:** កាតផ្អៀងតាមចលនា Mouse ពេលរំកិលទៅមក។
* **Ambient Floating / Levitation (Y-Axis Oscillation):** កាតអណ្តែតឡើងចុះយឺតៗ ដូចរបស់របរអណ្តែតក្នុងលំហ។
* **3D Coverflow Carousel (Autoplay Loop):** កាតរត់ស្លាយទៅមកមួយៗដោយស្វ័យប្រវត្តិ កាតកណ្តាលរីកធំ ហើយកាតសងខាងរាងតូច និងព្រិល (Depth of Field)។
* **Glassmorphism & Neon Glow:** ផ្ទៃថ្លាស្រអាប់ និងមានពន្លឺ Glow ជះចេញមកក្រៅតាម Rarity របស់ Item។

---

### ២. ជម្រើស Style Hero Animation ពេញនិយមទាំង ៣

#### Style A: 3-Column Staggered Floating Cards (ពេញនិយមខ្លាំងលើ Web3 & Luxury Gaming)

* នៅខាងស្តាំដៃនៃ Hero Section មានជួរកាត ៣ ជួរ (Columns) រត់បញ្ឈរឡើងចុះផ្ទុយទិសគ្នា (ជួរទី១ រត់ចុះ, ជួរទី២ រត់ឡើង, ជួរទី៣ រត់ចុះ)។
* ពេល Mouse ដាក់លើកាតណាមួយ ចលនានឹង **Pause** រួចកាតនោះរីកធំបន្តិច (Scale up + Gold Glow)។

#### Style B: 3D Floating Showcase with Mouse Parallax (កាតអណ្តែតបែប 3D Depth)

* មានកាតធំ 1 នៅចំកណ្តាល និងកាតរង 2-3 អណ្តែតនៅសងខាង (Layered Depth)។
* កាតទាំងអស់អណ្តែតឡើងចុះយឺតៗ (Float Animation) ហើយពេលយើងរំកិល Mouse កាតទាំងនោះនឹងរំកិលទៅមកតាមចម្ងាយជម្រៅ (3D Parallax Effect)។

#### Style C: 3D Coverflow Infinite Carousel (ស្លាយទៅមកដោយស្វ័យប្រវត្តិ)

* កាតហ្គេមរត់ស្លាយពីឆ្វេងទៅស្តាំជារង្វង់មូល ៣D ដោយកាតកណ្តាលបញ្ចេញពន្លឺភ្លឺច្បាស់ អាចចុច Previous/Next ឬឱ្យវា Autoplay ទៅមកបាន។

---

### ៣. គំរូ Prompts (English) សម្រាប់ Copy យកទៅប្រើ

#### 🎯 Prompt សម្រាប់ Style A: Multi-Column Staggered Infinite Marquee (ពេញនិយមបំផុត)

```text
Create a high-end, Cyber-Luxury Hero Section for a Game Account Marketplace using Next.js 15, Tailwind CSS, and Framer Motion.

Layout:
- Left Column (45% width): High-converting typography headline ("TRADE ELITE GAME ACCOUNTS WITH ZERO RISK"), dual CTA buttons ("Explore Marketplace" with metallic gold liquid sweep and "Sell Account" with glass border), and trust stats counters.
- Right Column (55% width): An ultra-modern 3D perspective display featuring 3 vertical columns of dynamic game account cards moving continuously.

Animation & Motion Details (Right Column):
1. Multi-Column Infinite Marquee:
   - Column 1: Moves smoothly downwards in an infinite loop.
   - Column 2: Moves smoothly upwards (reverse direction) with different speed.
   - Column 3: Moves downwards in an infinite loop.
   - Tilt the entire 3-column container slightly in 3D space (rotateZ: -6deg, rotateY: 12deg, perspective: 1200px) for a modern tech-depth look.
2. Hover & Interaction:
   - Hovering over any card pauses the marquee animation seamlessly.
   - The hovered card scales up slightly (scale: 1.05) with an electric gold/cyan border glow (#D4AF37 / #00F0FF) and spring damping physics.
3. Card Content & Styling:
   - Obsidian frosted glass background (#151A23 with backdrop-blur 16px).
   - Character/Skin key art thumbnail, game badge (MLBB, PUBG, Valorant, Genshin), Rank Pill (Mythic, Radiant), and Gold Price tag ($450, $850, $1,200).
   - Neon badge for "Instant Delivery" and "100% Escrow".

Ensure the animation is buttery smooth (60fps GPU-accelerated using transform translate3d) with responsive fallback for mobile screens (switch to horizontal marquee on small viewports).

```

---

#### 🎯 Prompt សម្រាប់ Style B: Floating 3D Cards with Mouse Parallax (បែបអណ្តែតទៅមកតាម Mouse)

```text
Build a cutting-edge Cyber-Luxury Hero Showcase in Next.js 15, Tailwind CSS, and Framer Motion featuring a floating interactive 3D game account visual.

Visual Concept:
- In the center/right of the Hero Section, create a multi-layered floating card deck that moves with ambient levitation and reacts dynamically to cursor coordinates.

Animation Specifications:
1. Ambient Floating Motion:
   - The primary featured account card performs an endless, gentle vertical floating oscillation (y: [-8, 8, -8] over 4 seconds with easeInOut cubic-bezier curve).
   - Two background secondary cards float with slight offset timing and depth blur (backdrop blur + opacity 75%) to create optical depth.
2. Gyroscopic Mouse Parallax (Framer Motion useMotionValue & useSpring):
   - Track mouse cursor position relative to the hero section center.
   - Tilt the cards smoothly on both X and Y axes (rotateX: -15deg to 15deg, rotateY: -15deg to 15deg).
   - Foreground badges and weapon highlights pop out in z-space (translateZ: 30px) creating an immersive 3D parallax depth effect.
3. Card Aesthetics:
   - Dark Obsidian canvas (#0B0E14), frosted glass cards (#151A23, 1px gold border rgba(212,175,55,0.2)).
   - Shimmering foil reflection running across the card on hover.
   - Floating micro-tags: "Radiant Rank", "Clean Moonton Bind", "Verified Escrow".

```

---

### 💡 គន្លឹះបន្ថែមពេលយកទៅប្រើ៖

1. ប្រសិនបើអ្នកប្រើ **v0.dev**: គ្រាន់តែ Paste **Prompt Style A** ចូល វានឹងបង្កើតជា UI Component ចេញមកមានទាំងចលនារត់ចុះឡើងៗភ្លាមៗ។
2. ប្រសិនបើអ្នកប្រើក្នុង **Cursor (Next.js Project)**: ត្រូវប្រាប់ AI ឱ្យប្រើ `transform: translate3d` និង Framer Motion `animate={{ y: ["0%", "-50%"] }}` ជាមួយ `transition={{ repeat: Infinity, ease: "linear", duration: 20 }}` ដើម្បីធានាថាកាតរត់ម៉ដ្ឋរលូន មិនទាក់ (Lag) លើគ្រប់ Browser!


Viewed .env:1-52
Edited .env
Viewed Plateform%20Sell%20Account%20Game.sql:151-340
Ran command: `npm install pg @types/pg`
Ran command: `node -e "const { Client } = require('pg'); const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_NOe0nzEWkC2m@ep-spring-mouse-b3s31942-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require' }); client.connect().then(() => client.query('SELECT version();')).then(res => { console.log('CONNECTED TO NEON SUCCESSFULLY:', res.rows[0].version); client.end(); }).catch(err => { console.error('CONNECTION ERROR:', err.message); client.end(); });"`
Ran command: `node -e "const { Client } = require('pg'); const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_NOe0nzEWkC2m@ep-spring-mouse-b3s31942-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require' }); client.connect().then(() => client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\';')).then(res => { console.log('EXISTING TABLES:', res.rows.map(r => r.table_name)); client.end(); }).catch(err => { console.error('ERROR:', err.message); client.end(); });"`
Created schema.prisma
Ran command: `npx prisma db push`
Edited schema.prisma
Created prisma.config.ts
Ran command: `npx prisma db push`
Used tool: manage_task
Used tool: schedule

កំពុងរៀបចំ និងរត់ Migration តារាងទាំង ២៥ ចូលទៅកាន់ Neon PostgreSQL Database...

Ran command: `npx prisma generate`
Ran command: `node -e "const { Client } = require('pg'); const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_NOe0nzEWkC2m@ep-spring-mouse-b3s31942-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require' }); client.connect().then(() => client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\' ORDER BY table_name;')).then(res => { console.log('TABLES CREATED IN NEON (' + res.rows.length + '):', res.rows.map(r => r.table_name)); client.end(); }).catch(err => { console.error('ERROR:', err.message); client.end(); });"`
Created database.ts
Ran command: `npx ts-node -e "import { prisma } from './src/config/database'; prisma.user.count().then(count => { console.log('PRISMA CLIENT CONNECTED SUCCESSFULLY! User count:', count); process.exit(0); }).catch(err => { console.error('Prisma connection error:', err); process.exit(1); });"`
Ran command: `npm install -D tsx`
Ran command: `npx tsx -e "import { prisma } from './src/config/database'; prisma.user.count().then(count => { console.log('PRISMA CLIENT CONNECTED SUCCESSFULLY! User count:', count); process.exit(0); }).catch(err => { console.error('Prisma connection error:', err); process.exit(1); });"`
Ran command: `npm install @prisma/adapter-pg`
Created database.ts
Ran command: `npx tsx -e "import { prisma } from './src/config/database'; prisma.user.count().then(count => { console.log('PRISMA CLIENT CONNECTED SUCCESSFULLY! User count:', count); process.exit(0); }).catch(err => { console.error('Prisma connection error:', err); process.exit(1); });"`
Viewed package.json:1-55
Edited package.json
Created seed.ts
Edited package.json
Ran command: `npm run db:seed`
Used tool: manage_task
Ran command: `npx tsx -e "import { prisma } from './src/config/database'; Promise.all([prisma.game.findMany({ select: { id: true, title: true, platform: true } }), prisma.user.findMany({ select: { id: true, username: true, email: true, role: true } }), prisma.coupon.findMany()]).then(([games, users, coupons]) => { console.log('GAMES:', games); console.log('USERS:', users); console.log('COUPONS:', coupons); process.exit(0); });"`
Created json.ts
Created response.ts
Created errorHandler.ts
Created notFoundHandler.ts
Created app.ts
Created server.ts
Ran command: `npx tsx src/server.ts`
Viewed index.ts:1-100
Viewed index.ts:101-129
Edited index.ts
Ran command: `npx tsx src/server.ts`
Used tool: manage_task
Read URL: http://localhost:5000/health
Viewed content.md:1-7
Read URL: http://localhost:5000/api/v1
Viewed content.md:1-7
Used tool: manage_task

ខ្ញុំបានរៀបចំ និងភ្ជាប់ **Neon PostgreSQL Database** ចូលទៅកាន់ Backend បានជោគជ័យ ១០០% រួចរាល់ហើយ! 🎉

---

### 📋 សង្ខេបលទ្ធផលការងារ (Database Setup)

#### 1. ⚙️ ការកំណត់ Connection String
- បាន configure ចូលទៅក្នុង [`.env`](file:///d:/Plateform%20Sell%20Account%20Game/backend/.env) ទាំង **Pooled Connection** និង **Direct Connection**:
  - `DATABASE_URL`: សម្រាប់ queries តាមរយៈ Connection Pooler
  - `DIRECT_URL`: សម្រាប់ DDL migrations និង administrative operations

#### 2. 🗄️ បង្កើត Prisma Schema & Migration (តារាងទាំង ២៥ ត្រូវបាន Sync ទៅ Neon)
បានរៀបចំ [`prisma/schema.prisma`](file:///d:/Plateform%20Sell%20Account%20Game/backend/prisma/schema.prisma) គ្រប់គ្រាន់តាម SQL Schema និង Specification រួមមាន៖

| ល.រ | ក្រុមតារាង (Modules) | ឈ្មោះតារាង (Tables ក្នុង Neon) |
|---|---|---|
| **1** | **Users & Security** | `users`, `user_social_accounts`, `user_refresh_tokens`, `password_reset_tokens`, `security_audit_logs`, `telegram_notification_settings` |
| **2** | **Game Catalog** | `games`, `game_accounts`, `game_account_binds`, `account_credentials`, `account_images` |
| **3** | **Order & Escrow** | `orders`, `account_warranties`, `payments`, `disputes`, `chat_messages` |
| **4** | **Financial & Wallet** | `wallets`, `wallet_transactions`, `withdrawal_requests` |
| **5** | **Marketing & Rewards** | `coupons`, `coupon_redemptions`, `user_referrals`, `referral_rewards` |
| **6** | **Seller Compliance** | `seller_kyc_verifications`, `seller_security_deposits` |

#### 3. 🌱 Seed ទិន្នន័យដំបូងចូល Database
បានបង្កើត [`prisma/seed.ts`](file:///d:/Plateform%20Sell%20Account%20Game/backend/prisma/seed.ts) និង inject ទិន្នន័យ៖
- **Games (៦ ហ្គេមពេញនិយម)**: Mobile Legends, PUBG Mobile, Free Fire, Honor of Kings, Genshin Impact, Valorant
- **Admin Account**: `admin@gameplatform.local` (Password: `Admin@2026!Secure`) + Admin Wallet
- **Welcome Coupon**: `WELCOME2026` (Discount $1.00)

#### 4. 🚀 Test Server & Live Neon Connection
- បានបង្កើត Server [`src/server.ts`](file:///d:/Plateform%20Sell%20Account%20Game/backend/src/server.ts) និង Express App [`src/app.ts`](file:///d:/Plateform%20Sell%20Account%20Game/backend/src/app.ts) (រួមទាំង Socket.io)
- បានតេស្ត endpoint `GET http://localhost:5000/health`:
  ```json
  {
    "success": true,
    "message": "System is healthy",
    "data": {
      "status": "ok",
      "database": "connected (Neon PostgreSQL)",
      "environment": "development"
    }
  }
  ```

---

### 💻 Npm Commands ដែលអាចប្រើបានឥឡូវនេះ៖
- `npm run dev`: បើក dev server ជាមួយ live reload (`tsx watch src/server.ts`)
- `npm run db:push`: Update schema ទៅ Neon
- `npm run db:seed`: Seed sample data
- `npm run db:studio`: បើក Prisma Studio UI ដើម្បីមើលទិន្នន័យលើ Browser

---

### ➡️ ជំហានបន្ទាប់៖
តើបងចង់ឱ្យខ្ញុំបន្តទៅកាន់ **Authentication Module** (Register, Login, JWT Access/Refresh tokens, Google OAuth, Telegram Bot linking) ដែរឬទេ?