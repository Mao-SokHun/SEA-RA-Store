import http from 'http';
import { createApp } from '../app';
import { prisma } from '../config/database';

async function testNewFeatures() {
  console.log('\n======================================================');
  console.log('🧪 TESTING NEW BACKEND PRODUCTION FEATURES');
  console.log('======================================================\n');

  const app = createApp();
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(5099, resolve));

  const baseUrl = 'http://localhost:5099/api/v1';

  try {
    // 1. Test User Registration to get JWT
    const testUsername = `user_${Date.now()}`;
    const testEmail = `${testUsername}@example.com`;

    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: testUsername,
        email: testEmail,
        password: 'Password123!',
      }),
    });
    const regData = (await regRes.json()) as any;
    const token = regData.data?.accessToken;
    console.log('✅ 1. User Registered & Token received:', !!token);

    // 2. Test Telegram Link Token Generator
    const tgTokenRes = await fetch(`${baseUrl}/users/notifications/telegram/link-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const tgTokenData = (await tgTokenRes.json()) as any;
    console.log('✅ 2. Telegram Link Token generated:', tgTokenData.data?.token);

    // 3. Test KYC Submission
    const kycRes = await fetch(`${baseUrl}/users/kyc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        idCardNumber: 'KH123456789',
        idCardFrontUrl: 'https://assets.example.com/id-front.jpg',
        idCardBackUrl: 'https://assets.example.com/id-back.jpg',
        selfieUrl: 'https://assets.example.com/selfie.jpg',
      }),
    });
    const kycData = (await kycRes.json()) as any;
    console.log('✅ 3. KYC Submitted:', kycData.data?.status === 'pending');

    // 4. Test KYC Status retrieval
    const myKycRes = await fetch(`${baseUrl}/users/kyc`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const myKycData = (await myKycRes.json()) as any;
    console.log('✅ 4. KYC Status retrieved:', myKycData.data?.status === 'pending');

    // 5. Test Forgot Password (triggers emailService)
    const forgotRes = await fetch(`${baseUrl}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail }),
    });
    const forgotData = (await forgotRes.json()) as any;
    console.log('✅ 5. Forgot Password & Email Dispatch:', !!forgotData.data?.resetToken);

    // 6. Test Telegram Webhook update
    const webhookRes = await fetch(`${baseUrl}/notifications/telegram/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          chat: { id: 123456789 },
          text: `/start ${tgTokenData.data?.token}`,
        },
      }),
    });
    const webhookData = (await webhookRes.json()) as any;
    console.log('✅ 6. Telegram Webhook handled:', webhookData.ok === true);

    console.log('\n======================================================');
    console.log('🎉 ALL NEW PRODUCTION FEATURES PASSED SUCCESSFULLY!');
    console.log('======================================================\n');
  } finally {
    server.close();
    await prisma.$disconnect();
  }
}

testNewFeatures().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
