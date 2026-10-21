import { prisma } from '../../../config/database';
import { BadRequestError, NotFoundError } from '../../../common/errors/AppError';
import { Prisma } from '@prisma/client';

export interface CreateCouponDTO {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  perUserLimit?: number;
  validFrom?: string;
  validUntil: string;
}

export class CouponService {
  /**
   * Validate a coupon code against order amount and buyer
   */
  async validateCoupon(code: string, orderAmount: number, buyerId?: string) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      throw new NotFoundError(`Coupon code "${code}" is invalid`);
    }

    const now = new Date();
    if (!coupon.isActive) {
      throw new BadRequestError('This coupon is no longer active');
    }

    if (coupon.validFrom > now) {
      throw new BadRequestError('This coupon is not yet valid');
    }

    if (coupon.validUntil < now) {
      throw new BadRequestError('This coupon has expired');
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestError('This coupon has reached its maximum total redemptions');
    }

    const minOrder = Number(coupon.minOrderAmount || 0);
    if (orderAmount < minOrder) {
      throw new BadRequestError(
        `Order amount of $${orderAmount.toFixed(2)} does not meet minimum order of $${minOrder.toFixed(2)}`
      );
    }

    // Check per-user limit
    if (buyerId) {
      const redemptionsCount = await prisma.couponRedemption.count({
        where: {
          couponId: coupon.id,
          userId: BigInt(buyerId),
        },
      });

      if (redemptionsCount >= coupon.perUserLimit) {
        throw new BadRequestError(`You have already reached the redemption limit for this coupon`);
      }
    }

    // Calculate discount
    let discount = 0;
    const discountVal = Number(coupon.discountValue);

    if (coupon.discountType === 'percentage') {
      discount = (orderAmount * discountVal) / 100;
      if (coupon.maxDiscountAmount) {
        discount = Math.min(discount, Number(coupon.maxDiscountAmount));
      }
    } else {
      discount = Math.min(orderAmount, discountVal);
    }

    return {
      isValid: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: Number(coupon.discountValue),
        calculatedDiscount: Number(discount.toFixed(2)),
        finalPrice: Number(Math.max(0, orderAmount - discount).toFixed(2)),
      },
    };
  }

  /**
   * Get active coupons for public promotions
   */
  async getActiveCoupons() {
    const now = new Date();
    const coupons = await prisma.coupon.findMany({
      where: {
        isActive: true,
        validFrom: { lte: now },
        validUntil: { gte: now },
      },
      select: {
        code: true,
        discountType: true,
        discountValue: true,
        minOrderAmount: true,
        maxDiscountAmount: true,
        validUntil: true,
      },
      take: 10,
    });

    return coupons.map((c) => ({
      code: c.code,
      discountType: c.discountType,
      discountValue: Number(c.discountValue),
      minOrderAmount: Number(c.minOrderAmount || 0),
      maxDiscountAmount: c.maxDiscountAmount ? Number(c.maxDiscountAmount) : null,
      validUntil: c.validUntil,
    }));
  }

  /**
   * Admin: Create a new promotional coupon
   */
  async createCoupon(data: CreateCouponDTO) {
    const code = data.code.trim().toUpperCase();

    const existing = await prisma.coupon.findUnique({ where: { code } });
    if (existing) {
      throw new BadRequestError(`Coupon with code "${code}" already exists`);
    }

    const coupon = await prisma.coupon.create({
      data: {
        code,
        discountType: data.discountType,
        discountValue: new Prisma.Decimal(data.discountValue),
        minOrderAmount: data.minOrderAmount ? new Prisma.Decimal(data.minOrderAmount) : new Prisma.Decimal(0),
        maxDiscountAmount: data.maxDiscountAmount ? new Prisma.Decimal(data.maxDiscountAmount) : null,
        usageLimit: data.usageLimit || null,
        perUserLimit: data.perUserLimit || 1,
        validFrom: data.validFrom ? new Date(data.validFrom) : new Date(),
        validUntil: new Date(data.validUntil),
        isActive: true,
      },
    });

    return {
      message: `Coupon "${code}" created successfully`,
      coupon: {
        id: coupon.id.toString(),
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: Number(coupon.discountValue),
        validUntil: coupon.validUntil,
      },
    };
  }
}

export const couponService = new CouponService();
export default couponService;
