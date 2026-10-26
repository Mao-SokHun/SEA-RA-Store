import { config } from '../../../config';
import { prisma } from '../../../config/database';

export class TelegramService {
  /**
   * Send direct Telegram message to a specific Telegram Chat ID
   */
  async sendMessage(chatId: string, text: string): Promise<boolean> {
    const token = config.telegramBotToken;
    if (!token || !chatId) {
      return false;
    }

    try {
      const url = `https://api.telegram.org/bot${token}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
        }),
      });

      const data = (await response.json()) as { ok: boolean };
      return data.ok;
    } catch (err) {
      console.error('Failed to send Telegram message:', err);
      return false;
    }
  }

  /**
   * Notify user if they have linked Telegram and enabled notifications for this event
   */
  async notifyUser(
    userId: string | bigint,
    event: 'order' | 'payment' | 'chat' | 'dispute' | 'payout',
    message: string
  ): Promise<boolean> {
    try {
      const userIdBigInt = typeof userId === 'string' ? BigInt(userId) : userId;

      const settings = await prisma.telegramNotificationSettings.findUnique({
        where: { userId: userIdBigInt },
      });

      if (!settings || !settings.isActive || !settings.telegramChatId) {
        return false;
      }

      // Check specific preference
      const isEnabled =
        (event === 'order' && settings.notifyOnOrder) ||
        (event === 'payment' && settings.notifyOnPayment) ||
        (event === 'chat' && settings.notifyOnChat) ||
        (event === 'dispute' && settings.notifyOnDispute) ||
        (event === 'payout' && settings.notifyOnPayout);

      if (!isEnabled) {
        return false;
      }

      return await this.sendMessage(settings.telegramChatId, message);
    } catch (err) {
      console.error('Error notifying user via Telegram:', err);
      return false;
    }
  }
  // Temporary memory map for 15-minute Telegram link tokens
  private linkTokens = new Map<string, { userId: string; expiresAt: number }>();

  /**
   * Generate temporary Telegram link token (TTL: 15 minutes)
   */
  generateLinkToken(userId: string): { token: string; botUsername?: string } {
    const token = Math.random().toString(36).substring(2, 10).toUpperCase();
    this.linkTokens.set(token, {
      userId,
      expiresAt: Date.now() + 15 * 60 * 1000,
    });

    // Cleanup expired tokens
    const now = Date.now();
    for (const [key, value] of this.linkTokens.entries()) {
      if (value.expiresAt < now) {
        this.linkTokens.delete(key);
      }
    }

    return { token };
  }

  /**
   * Handle incoming Webhook from Telegram Bot
   * Automatically links Telegram account when user sends /start <TOKEN>
   */
  async handleWebhookUpdate(update: any): Promise<{ handled: boolean; message?: string }> {
    const message = update?.message;
    if (!message || !message.text) {
      return { handled: false };
    }

    const chatId = message.chat?.id?.toString();
    const text = message.text.trim();

    if (text.startsWith('/start')) {
      const parts = text.split(' ');
      const token = parts[1]?.trim().toUpperCase();

      if (token && this.linkTokens.has(token)) {
        const linkData = this.linkTokens.get(token)!;
        if (linkData.expiresAt > Date.now()) {
          const userIdBigInt = BigInt(linkData.userId);

          await prisma.telegramNotificationSettings.upsert({
            where: { userId: userIdBigInt },
            create: {
              userId: userIdBigInt,
              telegramChatId: chatId,
              isActive: true,
            },
            update: {
              telegramChatId: chatId,
              isActive: true,
            },
          });

          this.linkTokens.delete(token);

          await this.sendMessage(
            chatId,
            `🎉 <b>Account Linked Successfully!</b>\n\n` +
            `Your Telegram is now connected to your Game Marketplace account.\n` +
            `You will receive instant alerts for:\n` +
            `• New orders & Escrow confirmations\n` +
            `• Buyer / Seller chat messages\n` +
            `• Wallet payouts & dispute updates.`
          );

          return { handled: true, message: 'Account linked successfully' };
        }
      }

      await this.sendMessage(
        chatId,
        `👋 <b>Welcome to Game Marketplace Bot!</b>\n\n` +
        `To link your account, please go to your Profile Settings on the marketplace website and click <b>Connect Telegram</b>.`
      );
      return { handled: true, message: 'Welcome message sent' };
    }

    return { handled: false };
  }
}

export const telegramService = new TelegramService();
export default telegramService;
