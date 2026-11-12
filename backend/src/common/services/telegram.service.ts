import { config } from '../../config';

export interface TelegramOrderPayload {
  orderNumber: string;
  gameTitle: string;
  packageName: string;
  totalUSD: number;
  totalKHR?: number;
  playerId: string;
  zoneId?: string | null;
  serverRegion?: string | null;
  playerNickname?: string | null;
  paymentMethod: string;
  deliveryStatus: 'pending' | 'completed' | 'failed';
  deliveryProof?: string | null;
  contactPhone?: string | null;
  errorMessage?: string | null;
}

export class TelegramService {
  private botToken: string;
  private chatId: string;
  private frontendUrl: string;

  constructor() {
    this.botToken = config.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN || '';
    this.chatId = config.telegramChatId || process.env.TELEGRAM_CHAT_ID || '';
    this.frontendUrl = config.frontendUrl || 'https://sea-ra-prestige.vercel.app';
  }

  /**
   * Check if Telegram Bot credentials are configured
   */
  public isConfigured(): boolean {
    return Boolean(this.botToken && this.chatId);
  }

  /**
   * Send raw message via Telegram Bot API
   */
  public async sendMessage(htmlText: string, replyMarkup?: any): Promise<boolean> {
    if (!this.isConfigured()) {
      console.log('ℹ️ [TelegramService] Mock Log (Credentials not configured):');
      console.log(htmlText.replace(/<[^>]*>?/gm, ''));
      return false;
    }

    try {
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      const targetIds = this.chatId
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const promises = targetIds.map(async (cid) => {
        const payload: any = {
          chat_id: cid,
          text: htmlText,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        };

        if (replyMarkup) {
          payload.reply_markup = replyMarkup;
        }

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errJson = await res.json();
          console.error(`❌ [TelegramService] Failed to send to ${cid}:`, errJson);
          return false;
        }
        return true;
      });

      const results = await Promise.all(promises);
      return results.some(Boolean);
    } catch (err) {
      console.error('❌ [TelegramService] Network error sending Telegram message:', err);
      return false;
    }
  }

  /**
   * Send notification when a new order is placed
   */
  public async notifyNewOrder(order: TelegramOrderPayload): Promise<boolean> {
    const khrFormatted = (order.totalKHR || Math.round(order.totalUSD * 4100)).toLocaleString();
    const zoneStr = order.zoneId ? ` (Zone: <code>${order.zoneId}</code>)` : '';
    const dateStr = new Date().toLocaleString('en-US', { timeZone: 'Asia/Phnom_Penh' });

    const message = [
      `🔔 <b>[SEA RA PRESTIGE] NEW ORDER CREATED</b>`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `🧾 <b>Order ID:</b> <code>${order.orderNumber}</code>`,
      `🎮 <b>Game:</b> <b>${order.gameTitle}</b>`,
      `📦 <b>Package:</b> ${order.packageName}`,
      `💰 <b>Amount:</b> $${order.totalUSD.toFixed(2)} USD (${khrFormatted} ៛)`,
      `👤 <b>Player ID:</b> <code>${order.playerId}</code>${zoneStr}`,
      `🏷️ <b>Nickname:</b> ${order.playerNickname || 'N/A'}`,
      `💳 <b>Payment:</b> ${order.paymentMethod.toUpperCase()}`,
      `⏳ <b>Status:</b> AWAITING PAYMENT (KHQR Generated)`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `⏰ <i>${dateStr} (ICT)</i>`,
    ].join('\n');

    const keyboard = {
      inline_keyboard: [
        [
          {
            text: '🔍 Track Order Receipt',
            url: `${this.frontendUrl}/track-order?order=${order.orderNumber}`,
          },
        ],
      ],
    };

    return this.sendMessage(message, keyboard);
  }

  /**
   * Send notification when an order is successfully paid and diamonds delivered
   */
  public async notifyOrderCompleted(order: TelegramOrderPayload): Promise<boolean> {
    const khrFormatted = (order.totalKHR || Math.round(order.totalUSD * 4100)).toLocaleString();
    const zoneStr = order.zoneId ? ` (Zone: <code>${order.zoneId}</code>)` : '';
    const dateStr = new Date().toLocaleString('en-US', { timeZone: 'Asia/Phnom_Penh' });

    const message = [
      `⚡ <b>[SEA RA PRESTIGE] ORDER FULFILLED!</b> 💎`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `🧾 <b>Order ID:</b> <code>${order.orderNumber}</code>`,
      `🎮 <b>Game:</b> <b>${order.gameTitle}</b>`,
      `📦 <b>Package:</b> ${order.packageName}`,
      `💰 <b>Amount:</b> $${order.totalUSD.toFixed(2)} USD (${khrFormatted} ៛)`,
      `👤 <b>Player ID:</b> <code>${order.playerId}</code>${zoneStr}`,
      `🏷️ <b>Nickname:</b> ${order.playerNickname || 'N/A'}`,
      `💳 <b>Payment Gateway:</b> Bakong KHQR (0% Fee)`,
      `✅ <b>Delivery Status:</b> <b>INJECTED SUCCESS (< 3s)</b>`,
      `📋 <b>API Proof:</b> <code>${order.deliveryProof || 'DIRECT-RELOAD-CONFIRMED'}</code>`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `⏰ <i>${dateStr} (ICT)</i>`,
      `🏪 <b>Store:</b> SEA RA PRESTIGE OFFICIAL`,
    ].join('\n');

    const keyboard = {
      inline_keyboard: [
        [
          {
            text: '🔍 View Customer Receipt',
            url: `${this.frontendUrl}/track-order?order=${order.orderNumber}`,
          },
        ],
      ],
    };

    return this.sendMessage(message, keyboard);
  }

  /**
   * Send notification when an order fails or needs manual review
   */
  public async notifyOrderFailed(order: TelegramOrderPayload, reason: string): Promise<boolean> {
    const dateStr = new Date().toLocaleString('en-US', { timeZone: 'Asia/Phnom_Penh' });

    const message = [
      `⚠️ <b>[SEA RA PRESTIGE] ORDER ALERT / MANUAL REVIEW</b>`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `🧾 <b>Order ID:</b> <code>${order.orderNumber}</code>`,
      `🎮 <b>Game:</b> ${order.gameTitle}`,
      `📦 <b>Package:</b> ${order.packageName}`,
      `👤 <b>Player ID:</b> <code>${order.playerId}</code>`,
      `❌ <b>Failure Reason:</b> ${reason}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `⏰ <i>${dateStr} (ICT)</i>`,
      `👉 <i>Please review in admin console or Smile.One portal.</i>`,
    ].join('\n');

    return this.sendMessage(message);
  }
}

export const telegramService = new TelegramService();
export default telegramService;
