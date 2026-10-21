import { prisma } from '../../../config/database';
import { NotFoundError, ForbiddenError } from '../../../common/errors/AppError';
import { emitToOrderRoom } from '../../../common/socket/socketManager';
import { telegramService } from '../../notifications/services/telegram.service';

export interface SendMessageDTO {
  content: string;
  messageType?: 'text' | 'image' | 'system';
}

export class ChatService {
  /**
   * Verify whether the user has authorization to view or chat in this order's escrow room
   */
  private async getOrderAndVerifyAccess(orderNumber: string, userId: string, userRole: string) {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        buyer: { select: { id: true, username: true } },
        seller: { select: { id: true, username: true } },
      },
    });

    if (!order) {
      throw new NotFoundError(`Order with number "${orderNumber}" not found`);
    }

    const userIdBigInt = BigInt(userId);
    const isBuyer = order.buyerId === userIdBigInt;
    const isSeller = order.sellerId === userIdBigInt;
    const isAdmin = userRole === 'admin';

    if (!isBuyer && !isSeller && !isAdmin) {
      throw new ForbiddenError('You are not a participant in this order escrow room');
    }

    return { order, isBuyer, isSeller, isAdmin };
  }

  /**
   * Send a chat message in an order escrow room
   */
  async sendMessage(orderNumber: string, senderId: string, userRole: string, data: SendMessageDTO) {
    const { order } = await this.getOrderAndVerifyAccess(orderNumber, senderId, userRole);
    const senderIdBigInt = BigInt(senderId);

    // Prevent duplicate identical messages sent within 1.5 seconds
    const recentDuplicate = await prisma.chatMessage.findFirst({
      where: {
        orderId: order.id,
        senderId: senderIdBigInt,
        content: data.content,
        createdAt: { gte: new Date(Date.now() - 1500) },
      },
      include: {
        sender: { select: { id: true, username: true, role: true } },
      },
    });

    if (recentDuplicate) {
      return {
        id: recentDuplicate.id.toString(),
        orderNumber,
        senderId: recentDuplicate.senderId.toString(),
        senderName: recentDuplicate.sender.username,
        senderRole: recentDuplicate.sender.role,
        messageType: recentDuplicate.messageType,
        content: recentDuplicate.content,
        isRead: recentDuplicate.isRead,
        createdAt: recentDuplicate.createdAt,
      };
    }

    const message = await prisma.chatMessage.create({
      data: {
        orderId: order.id,
        senderId: senderIdBigInt,
        content: data.content,
        messageType: data.messageType || 'text',
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
      },
    });

    const formattedMessage = {
      id: message.id.toString(),
      orderNumber,
      senderId: message.senderId.toString(),
      senderName: message.sender.username,
      senderRole: message.sender.role,
      messageType: message.messageType,
      content: message.content,
      isRead: message.isRead,
      createdAt: message.createdAt,
    };

    // Emit live to Socket.io room
    emitToOrderRoom(orderNumber, 'new_message', formattedMessage);

    // Notify recipient via Telegram if message is from human
    const recipientId = order.buyerId === senderIdBigInt ? order.sellerId : order.buyerId;
    telegramService.notifyUser(
      recipientId,
      'chat',
      `💬 <b>New Escrow Chat Message!</b>\nOrder <code>#${orderNumber}</code> from @${message.sender.username}: "${data.content.slice(0, 100)}"`
    );

    return formattedMessage;
  }

  /**
   * Get chat history for an order escrow room
   */
  async getChatHistory(
    orderNumber: string,
    userId: string,
    userRole: string,
    page: number = 1,
    limit: number = 50
  ) {
    const { order } = await this.getOrderAndVerifyAccess(orderNumber, userId, userRole);
    const userIdBigInt = BigInt(userId);
    const skip = (page - 1) * limit;

    const [total, messages] = await Promise.all([
      prisma.chatMessage.count({ where: { orderId: order.id } }),
      prisma.chatMessage.findMany({
        where: { orderId: order.id },
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              role: true,
            },
          },
        },
      }),
    ]);

    // Mark unread messages sent by the counterparty as read
    await prisma.chatMessage.updateMany({
      where: {
        orderId: order.id,
        senderId: { not: userIdBigInt },
        isRead: false,
      },
      data: { isRead: true },
    });

    return {
      messages: messages.map((m) => ({
        id: m.id.toString(),
        orderNumber,
        senderId: m.senderId.toString(),
        senderName: m.sender.username,
        senderRole: m.sender.role,
        messageType: m.messageType,
        content: m.content,
        isRead: m.isRead,
        createdAt: m.createdAt,
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * System broadcast into order room (e.g. Escrow paid, Dispute raised)
   */
  async sendSystemMessage(orderNumber: string, content: string) {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      select: { id: true, sellerId: true },
    });

    if (!order) return;

    // Use sellerId or admin as system fallback sender
    const message = await prisma.chatMessage.create({
      data: {
        orderId: order.id,
        senderId: order.sellerId,
        messageType: 'system',
        content,
      },
    });

    emitToOrderRoom(orderNumber, 'new_message', {
      id: message.id.toString(),
      orderNumber,
      senderId: 'SYSTEM',
      senderName: 'SYSTEM',
      senderRole: 'system',
      messageType: 'system',
      content,
      isRead: false,
      createdAt: message.createdAt,
    });
  }
}

export const chatService = new ChatService();
export default chatService;
