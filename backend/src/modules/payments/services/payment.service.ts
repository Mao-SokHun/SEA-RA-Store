import crypto from 'crypto';
import { prisma } from '../../../config/database';
import { config } from '../../../config';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '../../../common/errors/AppError';
import { generateBakongKHQRString, generateQRCodeImage } from '../../../common/utils/khqr';
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

    // Generate unique transaction ID
    const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
    const transactionId = `TXN-KHQR-${Date.now()}-${randomSuffix}`;

    // Generate standard EMVCo KHQR String
    const qrString = generateBakongKHQRString({
      orderNumber: order.orderNumber,
      amount,
      currency,
      merchantName: 'GAME MARKETPLACE',
      merchantAccount: 'gameplatform@dev',
    });

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

      // 5. Audit Log
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
    if (config.bakong.webhookSecret) {
      if (!signature) {
        throw new UnauthorizedError('Missing webhook signature');
      }
      const expectedSignature = crypto
        .createHmac('sha256', config.bakong.webhookSecret)
        .update(rawPayload)
        .digest('hex');

      if (signature !== expectedSignature) {
        throw new UnauthorizedError('Invalid webhook signature');
      }
    }

    const { orderNumber, transactionId } = payload;
    if (!orderNumber) {
      throw new BadRequestError('Missing orderNumber in webhook payload');
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { payment: true },
    });

    if (!order) {
      throw new NotFoundError(`Order ${orderNumber} not found`);
    }

    // Idempotency check: If order is already paid/in_escrow/completed, return success immediately
    if (order.status !== 'pending') {
      return { message: 'Order payment already processed (Idempotent response)' };
    }

    const txnId = transactionId || `TXN-BK-${Date.now()}`;

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

      // 3. Security Audit Log
      await tx.securityAuditLog.create({
        data: {
          userId: order.buyerId,
          action: 'PAYMENT_WEBHOOK_RECEIVED',
          metadata: JSON.stringify({ orderNumber, transactionId: txnId }),
        },
      });
    });

    return { message: 'Payment confirmed and order moved to escrow' };
  }

  /**
   * Simulate Payment for Development / Sandbox Testing
   */
  async simulatePayment(orderNumber: string, userId: string, userRole: string) {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { payment: true },
    });

    if (!order) {
      throw new NotFoundError(`Order ${orderNumber} not found`);
    }

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
    });

    return {
      message: 'Payment simulated successfully. Order is now in escrow.',
      orderNumber,
      status: 'in_escrow',
      transactionId,
    };
  }

  /**
   * Check real-time payment status (Polled by frontend checkout modal)
   */
  async getPaymentStatus(orderNumber: string) {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { payment: true },
    });

    if (!order) {
      throw new NotFoundError(`Order ${orderNumber} not found`);
    }

    return {
      orderNumber: order.orderNumber,
      orderStatus: order.status,
      isPaid: ['paid', 'in_escrow', 'completed'].includes(order.status),
      paymentMethod: order.payment?.paymentMethod || null,
      paidAt: order.payment?.paidAt || null,
    };
  }
}

export const paymentService = new PaymentService();
export default paymentService;
