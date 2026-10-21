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
}

export const telegramService = new TelegramService();
export default telegramService;
