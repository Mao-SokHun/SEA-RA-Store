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

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

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

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://frontend-silk-one-22.vercel.app';

    const telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
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

    if (!telegramRes.ok) {
      const errText = await telegramRes.text();
      console.error('❌ [Next.js Telegram Notify] Telegram API error:', errText);
      return NextResponse.json({ success: false, error: errText }, { status: 502 });
    }

    return NextResponse.json({ success: true, delivered: true });
  } catch (error: any) {
    console.error('❌ [Next.js Telegram Notify] Internal error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
