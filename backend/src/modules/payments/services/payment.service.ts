import crypto from 'crypto';
import { prisma } from '../../../config/database';
import { config } from '../../../config';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '../../../common/errors/AppError';
import { generateBakongKHQRString, generateQRCodeImage, calculateKHQRMD5 } from '../../../common/utils/khqr';
import { telegramService } from '../../notifications/services/telegram.service';
import { emitToOrderRoom } from '../../../common/socket/socketManager';
import { bakongService } from './bakong.service';
import { topUpService } from '../../topup/services/topup.service';
import { Prisma } from '@prisma/client';

export interface GenerateKHQRDTO {
  orderNumber: string;
  currency?: 'USD' | 'KHR';
}

export class PaymentService {
  /**
   * Generate Bakong KHQR String and Base64 QR Image for checkout
   */
  async generateKHQR(buyerId: string, data: GenerateKHQRDTO) {
    const buyerIdBigInt = BigInt(buyerId);

    const order = await prisma.order.findUnique({
      where: { orderNumber: data.orderNumber },
      include: {
        gameAccount: true,
        payment: true,
      },
    });

    if (!order) {
      throw new NotFoundError(`Order ${data.orderNumber} not found`);
    }

    if (order.buyerId !== buyerIdBigInt) {
      throw new ForbiddenError('You can only generate payment for your own orders');
    }

    if (order.status !== 'pending') {
      throw new BadRequestError(`Cannot generate payment for order with status "${order.status}"`);
    }

    // Check reservation expiry
    if (order.gameAccount.reservedUntil && order.gameAccount.reservedUntil < new Date()) {
      throw new BadRequestError('This order reservation has expired. Please create a new order.');
    }

    const amount = Number(order.totalAmount);
    const currency = data.currency || 'USD';

    // Generate standard EMVCo KHQR String
    const qrString = generateBakongKHQRString({
      orderNumber: order.orderNumber,
      amount,
      currency,
      merchantName: config.khqr.merchantName,
      merchantAccount: currency === 'KHR' ? config.khqr.bakongIdKhr : config.khqr.bakongId,
      merchantCity: config.khqr.merchantCity,
    });

    // Calculate MD5 hash for Bakong Open API verification
    const md5 = calculateKHQRMD5(qrString);
    const transactionId = md5;

    // Generate Base64 QR Code PNG image
    const qrImage = await generateQRCodeImage(qrString);

    // Record or update payment record
    await prisma.payment.upsert({
      where: { orderId: order.id },
      create: {
        orderId: order.id,
        transactionId,
        paymentMethod: 'bakong_khqr',
        amount: new Prisma.Decimal(amount),
        status: 'pending',
      },
      update: {
        transactionId,
        paymentMethod: 'bakong_khqr',
        amount: new Prisma.Decimal(amount),
        status: 'pending',
      },
    });

    const expiresInSeconds = order.gameAccount.reservedUntil
      ? Math.max(0, Math.floor((order.gameAccount.reservedUntil.getTime() - Date.now()) / 1000))
      : 900;

    return {
      orderNumber: order.orderNumber,
      transactionId,
      amount,
      currency,
      qrString,
      qrImage,
      md5,
      deepLink: `bakong://pay?qr=${encodeURIComponent(qrString)}`,
      expiresInSeconds,
    };
  }

  /**
   * Pay using buyer's platform wallet balance
   */
  async payWithWallet(buyerId: string, orderNumber: string) {
    const buyerIdBigInt = BigInt(buyerId);

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        gameAccount: true,
        payment: true,
      },
    });

    if (!order) {
      throw new NotFoundError(`Order ${orderNumber} not found`);
    }

    if (order.buyerId !== buyerIdBigInt) {
      throw new ForbiddenError('You can only pay for your own orders');
    }

    if (order.status !== 'pending') {
      throw new BadRequestError(`Cannot pay for order with status "${order.status}"`);
    }

    if (order.gameAccount.reservedUntil && order.gameAccount.reservedUntil < new Date()) {
      throw new BadRequestError('This order reservation has expired.');
    }

    // Check buyer wallet
    const buyerWallet = await prisma.wallet.findUnique({
      where: { userId: buyerIdBigInt },
    });

    if (!buyerWallet) {
      throw new BadRequestError('Buyer wallet not found');
    }

    const orderTotal = Number(order.totalAmount);
    const walletBalance = Number(buyerWallet.balance);

    if (walletBalance < orderTotal) {
      throw new BadRequestError(
        `Insufficient wallet balance. You have $${walletBalance.toFixed(2)}, but order total is $${orderTotal.toFixed(2)}. Please top up or pay with Bakong KHQR.`
      );
    }

    const transactionId = `TXN-WLT-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    // Execute atomic wallet deduction and order transition
    const result = await prisma.$transaction(async (tx) => {
      // 1. Move order to 'in_escrow' (Atomic guard: only transition if status is still 'pending')
      const orderCount = await tx.order.updateMany({
        where: {
          id: order.id,
          status: 'pending',
        },
        data: { status: 'in_escrow' },
      });

      if (orderCount.count === 0) {
        throw new BadRequestError('Order is not in pending status or has already been paid.');
      }

      // 2. Deduct wallet balance (Atomic CAS: ensure balance >= orderTotal)
      const deductCount = await tx.wallet.updateMany({
        where: {
          id: buyerWallet.id,
          balance: { gte: new Prisma.Decimal(orderTotal) },
        },
        data: {
          balance: { decrement: new Prisma.Decimal(orderTotal) },
        },
      });

      if (deductCount.count === 0) {
        throw new BadRequestError('Insufficient wallet balance or concurrent payment in progress');
      }

      const updatedWallet = await tx.wallet.findUniqueOrThrow({
        where: { id: buyerWallet.id },
      });

      // 3. Record ledger transaction
      await tx.walletTransaction.create({
        data: {
          walletId: buyerWallet.id,
          orderId: order.id,
          transactionType: 'payment',
          amount: new Prisma.Decimal(-orderTotal),
          balanceAfter: updatedWallet.balance,
        },
      });

      // 4. Upsert payment record as 'paid'
      await tx.payment.upsert({
        where: { orderId: order.id },
        create: {
          orderId: order.id,
          transactionId,
          paymentMethod: 'wallet',
          amount: new Prisma.Decimal(orderTotal),
          status: 'paid',
          paidAt: new Date(),
        },
        update: {
          transactionId,
          paymentMethod: 'wallet',
          amount: new Prisma.Decimal(orderTotal),
          status: 'paid',
          paidAt: new Date(),
        },
      });

      // 5. Update Game Account status to in_escrow to prevent auto-release cleanup
      await tx.gameAccount.update({
        where: { id: order.gameAccountId },
        data: {
          status: 'in_escrow',
          reservedUntil: null,
        },
      });

      // 6. Audit Log
      await tx.securityAuditLog.create({
        data: {
          userId: buyerIdBigInt,
          action: 'PAYMENT_WALLET_SUCCESS',
          metadata: JSON.stringify({ orderNumber, amount: orderTotal }),
        },
      });

      return {
        remainingBalance: Number(updatedWallet.balance),
      };
    });

    // Notify buyer and seller via Telegram asynchronously
    telegramService.notifyUser(
      order.buyerId,
      'payment',
      `✅ <b>Payment Successful!</b>\nYour payment of $${orderTotal.toFixed(2)} for order <code>#${orderNumber}</code> has been confirmed. You can now access your game account credentials.`
    );
    telegramService.notifyUser(
      order.sellerId,
      'order',
      `🔔 <b>Order Paid!</b>\nBuyer has paid $${orderTotal.toFixed(2)} for order <code>#${orderNumber}</code>. Funds are safely held in escrow.`
    );

    // Real-time WebSocket emission to order escrow room
    emitToOrderRoom(orderNumber, 'payment_success', {
      orderNumber,
      status: 'in_escrow',
      transactionId,
    });

    return {
      message: 'Payment completed successfully with Wallet balance. Order is now in escrow.',
      orderNumber,
      transactionId,
      status: 'in_escrow',
      remainingWalletBalance: result.remainingBalance,
    };
  }

  /**
   * Handle Webhook from Bakong Gateway with HMAC verification & Idempotency
   */
  async handleBakongWebhook(rawPayload: string, signature: string | undefined, payload: any) {
    // 1. Verify HMAC-SHA256 signature if webhook secret is configured
    if (!config.bakong.webhookSecret) {
      if (config.nodeEnv === 'production') {
        throw new UnauthorizedError('Bakong webhook secret is not configured on server');
      }
    } else {
      if (!signature) {
        throw new UnauthorizedError('Missing webhook signature');
      }
      const expectedSignature = crypto
        .createHmac('sha256', config.bakong.webhookSecret)
        .update(rawPayload)
        .digest('hex');

      const sigBuf = Buffer.from(signature, 'utf8');
      const expBuf = Buffer.from(expectedSignature, 'utf8');

      if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
        throw new UnauthorizedError('Invalid webhook signature');
      }
    }

    const { orderNumber, transactionId } = payload;
    if (!orderNumber) {
      throw new BadRequestError('Missing orderNumber in webhook payload');
    }

    const txnId = transactionId || `TXN-BK-${Date.now()}`;

    // 1. Check if this is an Account Order
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { payment: true },
    });

    if (order) {
      // Idempotency check: If order is already paid/in_escrow/completed, return success immediately
      if (order.status !== 'pending') {
        return { message: 'Order payment already processed (Idempotent response)' };
      }

      await prisma.$transaction(async (tx) => {
        // 1. Mark payment as paid
        await tx.payment.upsert({
          where: { orderId: order.id },
          create: {
            orderId: order.id,
            transactionId: txnId,
            paymentMethod: 'bakong_khqr',
            amount: order.totalAmount,
            status: 'paid',
            paidAt: new Date(),
          },
          update: {
            status: 'paid',
            paidAt: new Date(),
          },
        });

        // 2. Transition order to in_escrow (Atomic idempotency check: only if still pending)
        const updateCount = await tx.order.updateMany({
          where: {
            id: order.id,
            status: 'pending',
          },
          data: { status: 'in_escrow' },
        });

        if (updateCount.count === 0) {
          return; // Idempotent: already processed by a concurrent webhook call
        }

        // 3. Update Game Account status to in_escrow
        await tx.gameAccount.update({
          where: { id: order.gameAccountId },
          data: {
            status: 'in_escrow',
            reservedUntil: null,
          },
        });

        // 4. Security Audit Log
        await tx.securityAuditLog.create({
          data: {
            userId: order.buyerId,
            action: 'PAYMENT_WEBHOOK_RECEIVED',
            metadata: JSON.stringify({ orderNumber, transactionId: txnId }),
          },
        });
      });

      // Notify buyer and seller via Telegram asynchronously
      telegramService.notifyUser(
        order.buyerId,
        'payment',
        `✅ <b>KHQR Payment Received!</b>\nOrder <code>#${orderNumber}</code> is confirmed and placed in escrow. You can now access your game credentials.`
      );
      telegramService.notifyUser(
        order.sellerId,
        'order',
        `🔔 <b>KHQR Payment Confirmed!</b>\nBuyer has paid for order <code>#${orderNumber}</code>. Escrow funds are held securely.`
      );

      // Real-time WebSocket emission to order escrow room
      emitToOrderRoom(orderNumber, 'payment_success', {
        orderNumber,
        status: 'in_escrow',
        transactionId: txnId,
      });

      return { message: 'Payment confirmed and order moved to escrow' };
    }

    // 2. Check if this is a Top-Up Order
    const topUpOrder = await prisma.topUpOrder.findUnique({
      where: { orderNumber },
      include: { package: true, game: true },
    });

    if (topUpOrder) {
      if (topUpOrder.paymentStatus === 'paid') {
        return { message: 'Top-up order payment already processed (Idempotent response)' };
      }

      const fulfillResult = await topUpService.fulfillTopUp(orderNumber, txnId);

      if (topUpOrder.userId) {
        await prisma.securityAuditLog.create({
          data: {
            userId: topUpOrder.userId,
            action: 'TOPUP_PAYMENT_WEBHOOK_RECEIVED',
            metadata: JSON.stringify({
              orderNumber,
              transactionId: txnId,
              totalAmount: Number(topUpOrder.totalAmount),
            }),
          },
        });

        telegramService.notifyUser(
          topUpOrder.userId,
          'payment',
          `⚡ <b>Top-Up Successful!</b>\nYour payment for order <code>#${orderNumber}</code> (${topUpOrder.game.title} - ${topUpOrder.package.name}) has been confirmed and credited to player ${topUpOrder.playerNickname || topUpOrder.playerId}.`
        );
      }

      return {
        message: 'Top-up payment confirmed and in-game credit delivered',
        orderNumber,
        transactionId: txnId,
      };
    }

    throw new NotFoundError(`Order ${orderNumber} not found`);
  }

  /**
   * Simulate Payment for Development / Sandbox Testing
   */
  async simulatePayment(orderNumber: string, userId: string, userRole: string) {
    if (config.nodeEnv === 'production' && userRole !== 'admin') {
      throw new ForbiddenError('Payment simulation is disabled in production environment');
    }

    // 1. Check Account Order
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { payment: true },
    });

    if (order) {
      if (order.buyerId.toString() !== userId && userRole !== 'admin') {
        throw new ForbiddenError('You can only simulate payment for your own order');
      }

      if (order.status !== 'pending') {
        throw new BadRequestError(`Cannot simulate payment for order with status "${order.status}"`);
      }

      const transactionId = `TXN-SIM-${Date.now()}`;

      await prisma.$transaction(async (tx) => {
        await tx.payment.upsert({
          where: { orderId: order.id },
          create: {
            orderId: order.id,
            transactionId,
            paymentMethod: 'bakong_khqr',
            amount: order.totalAmount,
            status: 'paid',
            paidAt: new Date(),
          },
          update: {
            transactionId,
            status: 'paid',
            paidAt: new Date(),
          },
        });

        await tx.order.update({
          where: { id: order.id },
          data: { status: 'in_escrow' },
        });

        await tx.gameAccount.update({
          where: { id: order.gameAccountId },
          data: {
            status: 'in_escrow',
            reservedUntil: null,
          },
        });
      });

      // Real-time WebSocket emission to order escrow room
      emitToOrderRoom(orderNumber, 'payment_success', {
        orderNumber,
        status: 'in_escrow',
        transactionId,
      });

      return {
        message: 'Payment simulated successfully. Order is now in escrow.',
        orderNumber,
        status: 'in_escrow',
        transactionId,
      };
    }

    // 2. Check Top-Up Order
    const topUpOrder = await prisma.topUpOrder.findUnique({
      where: { orderNumber },
      include: { package: true, game: true },
    });

    if (topUpOrder) {
      if (topUpOrder.userId && topUpOrder.userId.toString() !== userId && userRole !== 'admin') {
        throw new ForbiddenError('You can only simulate payment for your own top-up order');
      }

      if (topUpOrder.paymentStatus === 'paid') {
        return {
          message: 'Top-up order has already been paid and processed',
          orderNumber,
          status: 'completed',
        };
      }

      const transactionId = `TXN-SIM-TU-${Date.now()}`;
      const fulfillResult = await topUpService.fulfillTopUp(orderNumber, transactionId);

      return {
        message: fulfillResult.message,
        orderNumber,
        status: fulfillResult.deliveryStatus,
        transactionId,
      };
    }

    throw new NotFoundError(`Order ${orderNumber} not found`);
  }

  private lastCheckTimestamps = new Map<string, number>();

  /**
   * Check real-time payment status from local database (Zero Bakong Quota Used!)
   */
  async getPaymentStatus(orderNumber: string) {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { payment: true },
    });

    if (order) {
      return {
        orderNumber: order.orderNumber,
        orderStatus: order.status,
        isPaid: ['paid', 'in_escrow', 'completed'].includes(order.status),
        paymentMethod: order.payment?.paymentMethod || null,
        paidAt: order.payment?.paidAt || null,
      };
    }

    const topUpOrder = await prisma.topUpOrder.findUnique({
      where: { orderNumber },
    });

    if (topUpOrder) {
      const isPaid = topUpOrder.paymentStatus === 'paid';
      return {
        orderNumber: topUpOrder.orderNumber,
        orderStatus: topUpOrder.deliveryStatus,
        isPaid,
        paymentMethod: topUpOrder.paymentMethod,
        paidAt: isPaid ? topUpOrder.updatedAt : null,
      };
    }

    throw new NotFoundError(`Order ${orderNumber} not found`);
  }

  /**
   * Manual Payment Verification with Bakong Open API (Triggered ONLY when user clicks 'Check Payment')
   * Consumes ONLY 1 Bakong request per click, with an 8-second debounce protection.
   */
  async checkBakongPayment(orderNumber: string) {
    // 1. Debounce cooldown (prevent rapid spam-clicking burning quota)
    const now = Date.now();
    const lastCheck = this.lastCheckTimestamps.get(orderNumber) || 0;
    const cooldownMs = 8000; // 8 seconds

    if (now - lastCheck < cooldownMs) {
      const waitSeconds = Math.ceil((cooldownMs - (now - lastCheck)) / 1000);
      return {
        isPaid: false,
        cooldown: true,
        waitSeconds,
        message: `សូមរង់ចាំ ${waitSeconds} វិនាទីសិន មុនពេលចុចពិនិត្យម្តងទៀត។`,
      };
    }

    // 2. Check if this is an Account Order
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { payment: true },
    });

    if (order) {
      // If already paid in database, return immediately without touching Bakong API
      if (['paid', 'in_escrow', 'completed'].includes(order.status)) {
        return {
          isPaid: true,
          orderStatus: order.status,
          message: 'ការទូទាត់ប្រាក់ត្រូវបានបញ្ជាក់រួចរាល់ហើយ!',
        };
      }

      const md5 = order.payment?.transactionId;
      if (!md5) {
        throw new BadRequestError('Payment QR code has not been generated for this order yet.');
      }

      this.lastCheckTimestamps.set(orderNumber, now);

      // Call Bakong Open API (Single USD check!)
      const checkResult = await bakongService.checkTransactionByMD5(md5);

      if (checkResult.isPaid) {
        await this.handleBakongWebhook(
          JSON.stringify({
            orderNumber: order.orderNumber,
            transactionId: checkResult.data?.hash || md5,
          }),
          undefined,
          {
            orderNumber: order.orderNumber,
            transactionId: checkResult.data?.hash || md5,
          }
        );

        return {
          isPaid: true,
          orderStatus: 'in_escrow',
          transactionId: checkResult.data?.hash || md5,
          message: 'ការទូទាត់ប្រាក់ទទួលបានជោគជ័យ! ប្រព័ន្ធបានដាក់ប្រាក់ក្នុង Escrow សុវត្ថិភាព។',
        };
      }

      return {
        isPaid: false,
        message: 'មិនទាន់ឃើញការផ្ទេរប្រាក់ពីគណនីរបស់អ្នកនៅឡើយទេ។ សូមពិនិត្យមើល App ធនាគាររបស់អ្នក រួចចុចម្តងទៀត។',
      };
    }

    // 3. Check if this is a Top-Up Order
    const topUpOrder = await prisma.topUpOrder.findUnique({
      where: { orderNumber },
    });

    if (topUpOrder) {
      if (topUpOrder.paymentStatus === 'paid') {
        return {
          isPaid: true,
          orderStatus: topUpOrder.deliveryStatus,
          message: 'ការទូទាត់ប្រាក់ត្រូវបានបញ្ជាក់រួចរាល់ហើយ!',
        };
      }

      const md5 = topUpOrder.transactionReference;
      if (!md5) {
        throw new BadRequestError('Payment reference not found for this top-up order.');
      }

      this.lastCheckTimestamps.set(orderNumber, now);

      // Call Bakong Open API (Single USD check!)
      const checkResult = await bakongService.checkTransactionByMD5(md5);

      if (checkResult.isPaid) {
        await this.handleBakongWebhook(
          JSON.stringify({
            orderNumber: topUpOrder.orderNumber,
            transactionId: checkResult.data?.hash || md5,
          }),
          undefined,
          {
            orderNumber: topUpOrder.orderNumber,
            transactionId: checkResult.data?.hash || md5,
          }
        );

        return {
          isPaid: true,
          orderStatus: 'completed',
          transactionId: checkResult.data?.hash || md5,
          message: 'ការទូទាត់ប្រាក់ទទួលបានជោគជ័យ! ទំនិញ/ពេជ្រត្រូវបានបញ្ចូលជូនអ្នករួចរាល់។',
        };
      }

      return {
        isPaid: false,
        message: 'មិនទាន់ឃើញការផ្ទេរប្រាក់ពីគណនីរបស់អ្នកនៅឡើយទេ។ សូមពិនិត្យមើល App ធនាគាររបស់អ្នក រួចចុចម្តងទៀត។',
      };
    }

    throw new NotFoundError(`Order ${orderNumber} not found`);
  }
}

export const paymentService = new PaymentService();
export default paymentService;
