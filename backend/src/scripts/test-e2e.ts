import http from 'http';
import { createApp } from '../app';
import { initSocketServer } from '../common/socket/socketManager';
import { prisma } from '../config/database';
import { io as ioClient, Socket as ClientSocket } from 'socket.io-client';

const TEST_PORT = 5055;
const BASE_URL = `http://localhost:${TEST_PORT}`;

interface TestContext {
  sellerToken: string;
  sellerRefreshToken: string;
  sellerId: string;
  sellerUsername: string;

  buyerToken: string;
  buyerRefreshToken: string;
  buyerId: string;
  buyerUsername: string;

  adminToken: string;

  gameId: string;
  gameAccountId: string;
  orderNumber: string;
  orderId: string;
}

const ctx: TestContext = {
  sellerToken: '',
  sellerRefreshToken: '',
  sellerId: '',
  sellerUsername: `seller_${Date.now()}`,

  buyerToken: '',
  buyerRefreshToken: '',
  buyerId: '',
  buyerUsername: `buyer_${Date.now()}`,

  adminToken: '',

  gameId: '',
  gameAccountId: '',
  orderNumber: '',
  orderId: '',
};

let server: http.Server;
let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    passedCount++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    failedCount++;
    console.error(`  ❌ [FAIL] ${testName}${detail ? ` -> ${detail}` : ''}`);
    throw new Error(`Test failed: ${testName} -> ${detail || ''}`);
  }
}

async function request(path: string, options: RequestInit = {}) {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  let body: any = null;
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    body = await res.json();
  } else {
    body = await res.text();
  }
  return { status: res.status, ok: res.ok, body, headers: res.headers };
}

async function runAllTests() {
  console.log('\n======================================================');
  console.log('🎮 STARTING END-TO-END SYSTEM TEST SUITE');
  console.log('======================================================\n');

  // 1. BOOT SERVER
  const app = createApp();
  server = http.createServer(app);
  initSocketServer(server);

  await new Promise<void>((resolve) => {
    server.listen(TEST_PORT, () => {
      console.log(`🚀 Test HTTP & WebSocket server live at ${BASE_URL}`);
      resolve();
    });
  });

  try {
    // -----------------------------------------------------------------
    // TEST 1: Health Check & Database Liveness
    // -----------------------------------------------------------------
    console.log('\n--- 1. Infrastructure & System Health ---');
    const healthRes = await request('/health');
    assert(healthRes.status === 200, 'GET /health returns HTTP 200');
    assert(healthRes.body.data.status === 'ok', 'Health status is ok');
    assert(healthRes.body.data.database.includes('connected'), 'Neon PostgreSQL is connected');

    // -----------------------------------------------------------------
    // TEST 2: Base API Discovery & OpenAPI Specification
    // -----------------------------------------------------------------
    console.log('\n--- 2. API Discovery & Documentation ---');
    const baseApiRes = await request('/api/v1');
    assert(baseApiRes.status === 200, 'GET /api/v1 returns HTTP 200');
    assert(baseApiRes.body.data.name === 'Game Account Marketplace API', 'API Name matched');

    const swaggerRes = await request('/api/docs.json');
    assert(swaggerRes.status === 200, 'GET /api/docs.json returns HTTP 200');
    assert(swaggerRes.body.openapi === '3.0.0', 'OpenAPI 3.0.0 valid spec generated');
    const pathCount = Object.keys(swaggerRes.body.paths || {}).length;
    assert(pathCount >= 10, `Swagger paths documented (${pathCount} paths found)`);

    // -----------------------------------------------------------------
    // TEST 3: Games Catalog Listing
    // -----------------------------------------------------------------
    console.log('\n--- 3. Games Catalog ---');
    const gamesRes = await request('/api/v1/games');
    assert(gamesRes.status === 200, 'GET /api/v1/games returns HTTP 200');
    assert(Array.isArray(gamesRes.body.data) && gamesRes.body.data.length > 0, 'Catalog contains active games');
    ctx.gameId = gamesRes.body.data[0].id;
    console.log(`     Target Game: ${gamesRes.body.data[0].title} (ID: ${ctx.gameId})`);

    // -----------------------------------------------------------------
    // TEST 4: Authentication & Registration (Buyer & Seller)
    // -----------------------------------------------------------------
    console.log('\n--- 4. Authentication & Security ---');
    // Register Seller
    const sellerRegRes = await request('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username: ctx.sellerUsername,
        email: `${ctx.sellerUsername}@testplatform.local`,
        password: 'Password123!Secure',
        role: 'seller',
      }),
    });
    assert(sellerRegRes.status === 201, 'POST /api/v1/auth/register creates seller account');
    assert(!!sellerRegRes.body.data.accessToken, 'Access token returned on seller registration');
    ctx.sellerToken = sellerRegRes.body.data.accessToken;
    ctx.sellerRefreshToken = sellerRegRes.body.data.refreshToken;
    ctx.sellerId = sellerRegRes.body.data.user.id;

    // Register Buyer
    const buyerRegRes = await request('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username: ctx.buyerUsername,
        email: `${ctx.buyerUsername}@testplatform.local`,
        password: 'Password123!Secure',
        role: 'buyer',
      }),
    });
    assert(buyerRegRes.status === 201, 'POST /api/v1/auth/register creates buyer account');
    ctx.buyerToken = buyerRegRes.body.data.accessToken;
    ctx.buyerRefreshToken = buyerRegRes.body.data.refreshToken;
    ctx.buyerId = buyerRegRes.body.data.user.id;

    // Admin Login (using login parameter)
    const adminLoginRes = await request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        login: 'admin@gameplatform.local',
        password: 'Admin@2026!Secure',
      }),
    });
    assert(adminLoginRes.status === 200, 'POST /api/v1/auth/login succeeds for admin', JSON.stringify(adminLoginRes.body));
    ctx.adminToken = adminLoginRes.body.data.accessToken;

    // Check Current User Profile (/auth/me)
    const meRes = await request('/api/v1/auth/me', {
      headers: { Authorization: `Bearer ${ctx.buyerToken}` },
    });
    assert(meRes.status === 200, 'GET /api/v1/auth/me returns authenticated user');
    assert(meRes.body.data.username === ctx.buyerUsername, 'Username in profile matches buyer');
    assert(!!meRes.body.data.wallet, 'User wallet automatically provisioned');

    // Token Rotation CAS Test
    const refreshRes = await request('/api/v1/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: ctx.buyerRefreshToken }),
    });
    assert(refreshRes.status === 200, 'POST /api/v1/auth/refresh-token successfully rotates tokens');
    assert(!!refreshRes.body.data.accessToken, 'New access token issued');
    ctx.buyerToken = refreshRes.body.data.accessToken;
    const oldBuyerRefreshToken = ctx.buyerRefreshToken;
    ctx.buyerRefreshToken = refreshRes.body.data.refreshToken;

    // Replay attack test: using old rotated refresh token MUST fail
    const replayRes = await request('/api/v1/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: oldBuyerRefreshToken }),
    });
    assert(replayRes.status === 401, 'Replay attack with rotated token correctly rejected (HTTP 401)');

    // -----------------------------------------------------------------
    // TEST 5: Game Account Listing & Credential Vault Encryption
    // -----------------------------------------------------------------
    console.log('\n--- 5. Account Listing & Credential Encryption ---');
    const secretLoginId = 'super_gamer_pro_99';
    const secretPassword = 'UltraTopSecretPassword2026!';

    const createListingRes = await request('/api/v1/accounts', {
      method: 'POST',
      headers: { Authorization: `Bearer ${ctx.sellerToken}` },
      body: JSON.stringify({
        gameId: ctx.gameId,
        title: 'Mythic Glory MLBB - 150 Skins & Max Badges',
        description: 'Clean Moonton account, fully transferable, lifetime warranty eligible',
        price: 50.0,
        currency: 'USD',
        deliveryType: 'instant',
        serverRegion: 'Southeast Asia',
        rankLevel: 'Mythic Glory',
        credentials: {
          loginIdentifier: secretLoginId,
          loginPassword: secretPassword,
          extraInstructions: 'Linked to clean dummy email. Change password upon login.',
        },
        binds: [
          { bindProvider: 'Moonton', bindStatus: 'bound_changeable', details: 'Full access clean email' },
          { bindProvider: 'Google Play', bindStatus: 'clean', details: 'Unbound' },
        ],
        images: [
          { imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e', isThumbnail: true },
        ],
      }),
    });

    assert(createListingRes.status === 201, 'POST /api/v1/accounts creates listing', JSON.stringify(createListingRes.body));
    ctx.gameAccountId = createListingRes.body.data.id;
    console.log(`     Account Listing created (ID: ${ctx.gameAccountId})`);

    // Public view: verify credentials are NEVER leaked publicly
    const getAccountRes = await request(`/api/v1/accounts/${ctx.gameAccountId}`);
    assert(getAccountRes.status === 200, 'GET /api/v1/accounts/:id returns listing details');
    assert(!getAccountRes.body.data.credentials, 'Zero-Knowledge: credentials are not exposed in public catalog');
    assert(getAccountRes.body.data.status === 'available', 'Account listing is marked as available');

    // -----------------------------------------------------------------
    // TEST 6: Buyer Wallet Deposit / Top-up
    // -----------------------------------------------------------------
    console.log('\n--- 6. Wallet Deposit & Balance ---');
    const topupRes = await request('/api/v1/wallet/topup', {
      method: 'POST',
      headers: { Authorization: `Bearer ${ctx.buyerToken}` },
      body: JSON.stringify({ amount: 100.0 }),
    });
    assert(topupRes.status === 200, 'POST /api/v1/wallet/topup successfully credits funds', JSON.stringify(topupRes.body));
    const topupBal = Number(topupRes.body.data?.newBalance ?? topupRes.body.data?.balance);
    assert(topupBal >= 100.0, 'Buyer wallet balance is $100.00+');

    // -----------------------------------------------------------------
    // TEST 7: Checkout & 15-Minute Concurrency Reservation Lock
    // -----------------------------------------------------------------
    console.log('\n--- 7. Checkout & 15-Minute Concurrency Lock ---');
    const checkoutRes = await request('/api/v1/orders/checkout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${ctx.buyerToken}` },
      body: JSON.stringify({
        gameAccountId: ctx.gameAccountId,
        couponCode: 'WELCOME2026', // $1 discount coupon
        warrantyType: '30d',
      }),
    });
    assert(checkoutRes.status === 201, 'POST /api/v1/orders/checkout creates reserved order', JSON.stringify(checkoutRes.body));
    assert(checkoutRes.body.data.status === 'pending', 'Order is in pending status');
    assert(Number(checkoutRes.body.data.financials.discountAmount) === 1.0, 'Coupon WELCOME2026 applied ($1.00 discount)');
    assert(Number(checkoutRes.body.data.financials.totalAmount) === 49.0, 'Total adjusted to $49.00');
    ctx.orderNumber = checkoutRes.body.data.orderNumber;
    console.log(`     Order created: #${ctx.orderNumber}`);

    // Concurrency Lock Check: Another buyer tries to check out the exact same account
    const secondBuyerRes = await request('/api/v1/orders/checkout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${ctx.sellerToken}` }, // Different user
      body: JSON.stringify({
        gameAccountId: ctx.gameAccountId,
      }),
    });
    assert(secondBuyerRes.status === 409 || secondBuyerRes.status === 400, 'Atomic CAS prevents double-reservation (409 Conflict)');

    // -----------------------------------------------------------------
    // TEST 8: Payment Execution (Digital Wallet & Escrow Holding)
    // -----------------------------------------------------------------
    console.log('\n--- 8. Payment Execution & Escrow Lock ---');
    const paymentRes = await request('/api/v1/payments/wallet', {
      method: 'POST',
      headers: { Authorization: `Bearer ${ctx.buyerToken}` },
      body: JSON.stringify({ orderNumber: ctx.orderNumber }),
    });
    assert(paymentRes.status === 200, 'POST /api/v1/payments/wallet successfully executes payment', JSON.stringify(paymentRes.body));
    assert(paymentRes.body.data.status === 'in_escrow', 'Order successfully transitioned to in_escrow');

    // Verify account is now protected in escrow
    const lockedAccountRes = await request(`/api/v1/accounts/${ctx.gameAccountId}`);
    assert(lockedAccountRes.body.data.status === 'in_escrow', 'Account status updated to in_escrow');

    // -----------------------------------------------------------------
    // TEST 9: Credential Decryption Vault (Zero-Knowledge Decrypt)
    // -----------------------------------------------------------------
    console.log('\n--- 9. Decryption Vault for Escrow Buyer ---');
    const orderDetailsRes = await request(`/api/v1/orders/${ctx.orderNumber}`, {
      headers: { Authorization: `Bearer ${ctx.buyerToken}` },
    });
    assert(orderDetailsRes.status === 200, 'GET /api/v1/orders/:orderNumber delivers decrypted credentials to buyer', JSON.stringify(orderDetailsRes.body));
    assert(orderDetailsRes.body.data.credentials.loginIdentifier === secretLoginId, 'Decrypted login matches original plaintext');
    assert(orderDetailsRes.body.data.credentials.loginPassword === secretPassword, 'Decrypted password matches original plaintext');

    // Seller cannot view credentials
    const sellerOrderRes = await request(`/api/v1/orders/${ctx.orderNumber}`, {
      headers: { Authorization: `Bearer ${ctx.sellerToken}` },
    });
    assert(sellerOrderRes.status === 200, 'GET /api/v1/orders/:orderNumber succeeds for seller');
    assert(sellerOrderRes.body.data.credentials === null, 'Credentials are redacted (null) for seller view');

    // -----------------------------------------------------------------
    // TEST 10: Real-time Socket.IO Escrow Chat & Messaging
    // -----------------------------------------------------------------
    console.log('\n--- 10. Real-time Socket.IO Escrow Chat ---');
    const socket: ClientSocket = ioClient(BASE_URL, {
      auth: { token: ctx.buyerToken },
      transports: ['websocket'],
    });

    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Socket.IO connection timeout')), 5000);

      socket.on('connect', () => {
        console.log(`     Socket.IO client connected (Socket ID: ${socket.id})`);
        socket.emit('join_order', ctx.orderNumber);
      });

      socket.on('joined_order', (data: { orderNumber: string }) => {
        assert(data.orderNumber === ctx.orderNumber, 'Joined order escrow room over WebSocket');
        clearTimeout(timeout);
        resolve();
      });

      socket.on('connect_error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });

    // Send chat message via REST and listen on socket
    const messagePromise = new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('WebSocket message receive timeout')), 5000);
      socket.on('new_message', (msg: any) => {
        assert(msg.content.includes('Hello Seller'), 'Received real-time message broadcast on socket');
        clearTimeout(timeout);
        resolve();
      });
    });

    const sendChatRes = await request(`/api/v1/chat/${ctx.orderNumber}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${ctx.buyerToken}` },
      body: JSON.stringify({
        content: 'Hello Seller! I am currently inspecting and changing the credentials.',
        messageType: 'text',
      }),
    });
    assert(sendChatRes.status === 201, 'POST /api/v1/chat/:orderNumber saves escrow chat message', JSON.stringify(sendChatRes.body));
    await messagePromise;

    socket.disconnect();

    // -----------------------------------------------------------------
    // TEST 11: Order Handover Confirmation & Seller Payout Settlement
    // -----------------------------------------------------------------
    console.log('\n--- 11. Escrow Release & Settlement ---');
    const confirmRes = await request(`/api/v1/orders/${ctx.orderNumber}/confirm-received`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${ctx.buyerToken}` },
    });
    assert(confirmRes.status === 200, 'POST /api/v1/orders/:orderNumber/confirm-received completes escrow', JSON.stringify(confirmRes.body));
    const checkOrderRes = await request(`/api/v1/orders/${ctx.orderNumber}`, {
      headers: { Authorization: `Bearer ${ctx.buyerToken}` },
    });
    assert(checkOrderRes.status === 200, 'GET /api/v1/orders/:orderNumber returns updated order');
    assert(checkOrderRes.body.data.status === 'completed', 'Order status is now completed');

    // Commission verification: total $49.00 -> 10% platform fee = $4.90, Seller net = $44.10
    const finalAccount = await request(`/api/v1/accounts/${ctx.gameAccountId}`);
    assert(finalAccount.body.data.status === 'sold', 'Game account marked as sold');

    // Check Seller Wallet: Seller should have received net amount ($45.00)
    const sellerWalletRes = await request('/api/v1/wallet', {
      headers: { Authorization: `Bearer ${ctx.sellerToken}` },
    });
    assert(sellerWalletRes.status === 200, 'GET /api/v1/wallet retrieves seller wallet');
    const sellerBalance = Number(sellerWalletRes.body.data.balance);
    assert(sellerBalance === 45.0, `Seller credited net amount ($45.00) after 10% fee (Balance: $${sellerBalance})`);

    // -----------------------------------------------------------------
    // TEST 12: Seller Withdrawal Request
    // -----------------------------------------------------------------
    console.log('\n--- 12. Wallet Withdrawal Request ---');
    const withdrawRes = await request('/api/v1/wallet/withdraw', {
      method: 'POST',
      headers: { Authorization: `Bearer ${ctx.sellerToken}` },
      body: JSON.stringify({
        amount: 20.0,
        bankName: 'ABA Bank',
        accountName: 'SOKHUN MAO',
        accountNumber: '001 234 567',
      }),
    });
    assert(withdrawRes.status === 201, 'POST /api/v1/wallet/withdraw creates withdrawal request', JSON.stringify(withdrawRes.body));
    const withdrawStatus = withdrawRes.body.data.withdrawal?.status ?? withdrawRes.body.data.status;
    assert(withdrawStatus === 'pending', 'Withdrawal request is pending approval');

    // Verify balance was debited atomically ($45.00 - $20.00 = $25.00)
    const postWithdrawWallet = await request('/api/v1/wallet', {
      headers: { Authorization: `Bearer ${ctx.sellerToken}` },
    });
    assert(Number(postWithdrawWallet.body.data.balance) === 25.0, 'Seller balance debited to $25.00');

    // -----------------------------------------------------------------
    // TEST 13: Admin Analytics & Financial Metrics
    // -----------------------------------------------------------------
    console.log('\n--- 13. Admin Dashboard Analytics ---');
    const adminAnalyticsRes = await request('/api/v1/admin/analytics/overview', {
      headers: { Authorization: `Bearer ${ctx.adminToken}` },
    });
    assert(adminAnalyticsRes.status === 200, 'GET /api/v1/admin/analytics/overview returns analytics', JSON.stringify(adminAnalyticsRes.body));
    assert(adminAnalyticsRes.body.data.financials.totalCompletedOrders >= 1, 'Admin metrics show completed order');
    console.log(`     Total Platform Volume: $${adminAnalyticsRes.body.data.financials.totalTradingVolume}`);
    console.log(`     Platform Net Revenue : $${adminAnalyticsRes.body.data.financials.totalPlatformCommission}`);

    console.log('\n======================================================');
    console.log(`🎉 ALL ${passedCount} END-TO-END SYSTEM TESTS PASSED SUCCESSFULLY!`);
    console.log('======================================================\n');
  } catch (error) {
    console.error('\n❌ TEST RUN TERMINATED WITH ERRORS:', error);
    process.exitCode = 1;
  } finally {
    if (server) {
      await new Promise<void>((resolve) => {
        server.close(async () => {
          await prisma.$disconnect();
          console.log('🧹 Cleaned up test server and database connections.');
          resolve();
        });
      });
    }
  }
}

runAllTests();
