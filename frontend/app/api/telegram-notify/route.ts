import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      orderNumber,
      gameTitle,
      packageName,
      totalUSD,
      totalKHR,
      playerId,
      zoneId,
      playerNickname,
      paymentMethod = 'Bakong KHQR',
      status = 'completed',
      deliveryProof,
    } = body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN || '9078489897:AAFuu6jO-80gT-ztJyUrOOHy7k3l_DyP_pw';
    const chatId = process.env.TELEGRAM_CHAT_ID || '-1004391101380,8168197067';

    // If bot token or chat ID not set, log and return graceful response
    if (!botToken || !chatId) {
      console.log('ℹ️ [Next.js Telegram Notify] Mock Alert (TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured):');
      console.log(`Order: #${orderNumber} | Game: ${gameTitle} | Amount: $${totalUSD}`);
      return NextResponse.json({
        success: true,
        configured: false,
        message: 'Credentials not configured; logged locally.',
      });
    }

    const khrFormatted = (totalKHR || Math.round(Number(totalUSD) * 4100)).toLocaleString();
    const zoneStr = zoneId ? ` (Zone: <code>${zoneId}</code>)` : '';
    const dateStr = new Date().toLocaleString('en-US', { timeZone: 'Asia/Phnom_Penh' });

    const htmlText = [
      status === 'completed'
        ? `⚡ <b>[SEA RA PRESTIGE] ORDER FULFILLED!</b> 💎`
        : `🔔 <b>[SEA RA PRESTIGE] NEW ORDER CREATED</b>`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `🧾 <b>Order ID:</b> <code>${orderNumber}</code>`,
      `🎮 <b>Game:</b> <b>${gameTitle || 'Game'}</b>`,
      `📦 <b>Package:</b> ${packageName || 'In-Game Package'}`,
      `💰 <b>Amount:</b> $${Number(totalUSD).toFixed(2)} USD (${khrFormatted} ៛)`,
      `👤 <b>Player ID:</b> <code>${playerId}</code>${zoneStr}`,
      `🏷️ <b>Nickname:</b> ${playerNickname || 'N/A'}`,
      `💳 <b>Payment:</b> ${paymentMethod}`,
      `✅ <b>Status:</b> ${status === 'completed' ? '<b>INJECTED SUCCESS (< 3s)</b>' : 'PENDING'}`,
      deliveryProof ? `📋 <b>Proof:</b> <code>${deliveryProof}</code>` : '',
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `⏰ <i>${dateStr} (ICT)</i>`,
      `🏪 <b>Store:</b> SEA RA PRESTIGE OFFICIAL`,
    ]
      .filter(Boolean)
      .join('\n');

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sea-ra-prestige.vercel.app';
    const targetIds = chatId.split(',').map((s) => s.trim()).filter(Boolean);

    const promises = targetIds.map(async (cid) => {
      const telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: cid,
          text: htmlText,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '🔍 View Customer Receipt',
                  url: `${appUrl}/track-order?order=${orderNumber}`,
                },
              ],
            ],
          },
        }),
      });
      return telegramRes.ok;
    });

    const results = await Promise.all(promises);
    return NextResponse.json({ success: true, delivered: results.some(Boolean) });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Internal server error';
    console.error('❌ [Next.js Telegram Notify] Internal error:', error);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
