import bcrypt from 'bcryptjs';
import { prisma } from '../../../config/database';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../../common/errors/AppError';

export interface UpdateProfileDTO {
  phone?: string;
}

export interface ChangePasswordDTO {
  oldPassword: string;
  newPassword: string;
}

export interface UpdateTelegramSettingsDTO {
  telegramChatId?: string;
  notifyOnOrder?: boolean;
  notifyOnPayment?: boolean;
  notifyOnChat?: boolean;
  notifyOnDispute?: boolean;
  notifyOnPayout?: boolean;
  isActive?: boolean;
}

export interface SubmitKYCDTO {
  idCardNumber: string;
  idCardFrontUrl: string;
  idCardBackUrl: string;
  selfieUrl: string;
}

export class UserService {
  /**
   * Update basic profile info
   */
  async updateProfile(userId: string, data: UpdateProfileDTO) {
    const userIdBigInt = BigInt(userId);

    const user = await prisma.user.findUnique({ where: { id: userIdBigInt } });
    if (!user) throw new NotFoundError('User not found');

    if (data.phone && data.phone !== user.phone) {
      const existingPhone = await prisma.user.findUnique({
        where: { phone: data.phone },
      });
      if (existingPhone && existingPhone.id !== userIdBigInt) {
        throw new BadRequestError('Phone number is already associated with another account');
      }
    }

    const updated = await prisma.user.update({
      where: { id: userIdBigInt },
      data: {
        phone: data.phone || user.phone,
      },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    return {
      message: 'Profile updated successfully',
      user: {
        ...updated,
        id: updated.id.toString(),
      },
    };
  }

  /**
   * Change password & auto-revoke active refresh tokens
   */
  async changePassword(userId: string, data: ChangePasswordDTO) {
    const userIdBigInt = BigInt(userId);

    const user = await prisma.user.findUnique({ where: { id: userIdBigInt } });
    if (!user) throw new NotFoundError('User not found');

    if (!user.passwordHash) {
      throw new BadRequestError('This account was created via social login. You cannot change password.');
    }

    const isOldPasswordValid = await bcrypt.compare(data.oldPassword, user.passwordHash);
    if (!isOldPasswordValid) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    if (data.oldPassword === data.newPassword) {
      throw new BadRequestError('New password must be different from current password');
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(data.newPassword, salt);

    await prisma.$transaction(async (tx) => {
      // 1. Update password
      await tx.user.update({
        where: { id: userIdBigInt },
        data: {
          passwordHash: newHash,
          passwordChangedAt: new Date(),
        },
      });

      // 2. Revoke all active refresh tokens (Security enforcement)
      await tx.userRefreshToken.updateMany({
        where: { userId: userIdBigInt, isRevoked: false },
        data: { isRevoked: true },
      });

      // 3. Security Audit Log
      await tx.securityAuditLog.create({
        data: {
          userId: userIdBigInt,
          action: 'PASSWORD_CHANGED',
        },
      });
    });

    return { message: 'Password changed successfully. All active sessions have been logged out for security.' };
  }

  /**
   * Get Telegram notification settings
   */
  async getTelegramSettings(userId: string) {
    const userIdBigInt = BigInt(userId);

    let settings = await prisma.telegramNotificationSettings.findUnique({
      where: { userId: userIdBigInt },
    });

    if (!settings) {
      settings = await prisma.telegramNotificationSettings.create({
        data: {
          userId: userIdBigInt,
          isActive: true,
          notifyOnOrder: true,
          notifyOnPayment: true,
          notifyOnChat: true,
          notifyOnDispute: true,
          notifyOnPayout: true,
        },
      });
    }

    return {
      telegramLinked: !!settings.telegramChatId,
      telegramChatId: settings.telegramChatId,
      isActive: settings.isActive,
      notifyOnOrder: settings.notifyOnOrder,
      notifyOnPayment: settings.notifyOnPayment,
      notifyOnChat: settings.notifyOnChat,
      notifyOnDispute: settings.notifyOnDispute,
      notifyOnPayout: settings.notifyOnPayout,
    };
  }

  /**
   * Update Telegram notification preferences or link chat ID
   */
  async updateTelegramSettings(userId: string, data: UpdateTelegramSettingsDTO) {
    const userIdBigInt = BigInt(userId);

    const updated = await prisma.telegramNotificationSettings.upsert({
      where: { userId: userIdBigInt },
      create: {
        userId: userIdBigInt,
        telegramChatId: data.telegramChatId,
        notifyOnOrder: data.notifyOnOrder !== undefined ? data.notifyOnOrder : true,
        notifyOnPayment: data.notifyOnPayment !== undefined ? data.notifyOnPayment : true,
        notifyOnChat: data.notifyOnChat !== undefined ? data.notifyOnChat : true,
        notifyOnDispute: data.notifyOnDispute !== undefined ? data.notifyOnDispute : true,
        notifyOnPayout: data.notifyOnPayout !== undefined ? data.notifyOnPayout : true,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
      update: {
        ...(data.telegramChatId !== undefined ? { telegramChatId: data.telegramChatId } : {}),
        ...(data.notifyOnOrder !== undefined ? { notifyOnOrder: data.notifyOnOrder } : {}),
        ...(data.notifyOnPayment !== undefined ? { notifyOnPayment: data.notifyOnPayment } : {}),
        ...(data.notifyOnChat !== undefined ? { notifyOnChat: data.notifyOnChat } : {}),
        ...(data.notifyOnDispute !== undefined ? { notifyOnDispute: data.notifyOnDispute } : {}),
        ...(data.notifyOnPayout !== undefined ? { notifyOnPayout: data.notifyOnPayout } : {}),
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
      },
    });

    return {
      message: 'Telegram notification settings updated successfully',
      settings: {
        telegramLinked: !!updated.telegramChatId,
        telegramChatId: updated.telegramChatId,
        isActive: updated.isActive,
        notifyOnOrder: updated.notifyOnOrder,
        notifyOnPayment: updated.notifyOnPayment,
        notifyOnChat: updated.notifyOnChat,
        notifyOnDispute: updated.notifyOnDispute,
        notifyOnPayout: updated.notifyOnPayout,
      },
    };
  }

  /**
   * Submit or re-submit KYC for Seller verification
   */
  async submitKYC(userId: string, data: SubmitKYCDTO) {
    const userIdBigInt = BigInt(userId);

    const existing = await prisma.sellerKYCVerification.findUnique({
      where: { userId: userIdBigInt },
    });

    if (existing && existing.status === 'approved') {
      throw new BadRequestError('Your KYC identity has already been verified and approved.');
    }

    const kyc = await prisma.sellerKYCVerification.upsert({
      where: { userId: userIdBigInt },
      create: {
        userId: userIdBigInt,
        idCardNumber: data.idCardNumber,
        idCardFrontUrl: data.idCardFrontUrl,
        idCardBackUrl: data.idCardBackUrl,
        selfieUrl: data.selfieUrl,
        status: 'pending',
        rejectionReason: null,
      },
      update: {
        idCardNumber: data.idCardNumber,
        idCardFrontUrl: data.idCardFrontUrl,
        idCardBackUrl: data.idCardBackUrl,
        selfieUrl: data.selfieUrl,
        status: 'pending',
        rejectionReason: null,
        updatedAt: new Date(),
      },
    });

    await prisma.securityAuditLog.create({
      data: {
        userId: userIdBigInt,
        action: 'KYC_SUBMITTED',
        metadata: JSON.stringify({ id: kyc.id.toString(), idCardNumber: data.idCardNumber }),
      },
    });

    return {
      message: 'KYC documents submitted successfully. Verification will be completed within 24 hours.',
      kyc: {
        id: kyc.id.toString(),
        status: kyc.status,
        submittedAt: kyc.updatedAt,
      },
    };
  }

  /**
   * Get current user's KYC verification status
   */
  async getMyKYC(userId: string) {
    const userIdBigInt = BigInt(userId);

    const kyc = await prisma.sellerKYCVerification.findUnique({
      where: { userId: userIdBigInt },
    });

    if (!kyc) {
      return {
        hasSubmitted: false,
        status: 'unverified',
        kyc: null,
      };
    }

    return {
      hasSubmitted: true,
      status: kyc.status,
      kyc: {
        id: kyc.id.toString(),
        idCardNumber: kyc.idCardNumber,
        idCardFrontUrl: kyc.idCardFrontUrl,
        idCardBackUrl: kyc.idCardBackUrl,
        selfieUrl: kyc.selfieUrl,
        status: kyc.status,
        rejectionReason: kyc.rejectionReason,
        verifiedAt: kyc.verifiedAt,
        createdAt: kyc.createdAt,
      },
    };
  }

  /**
   * Admin: List all KYC submissions
   */
  async adminListKYC(statusFilter?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = statusFilter && statusFilter !== 'all' ? { status: statusFilter } : {};

    const [total, list] = await Promise.all([
      prisma.sellerKYCVerification.count({ where }),
      prisma.sellerKYCVerification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              phone: true,
              role: true,
              createdAt: true,
            },
          },
        },
      }),
    ]);

    return {
      submissions: list.map((k) => ({
        id: k.id.toString(),
        userId: k.userId.toString(),
        user: {
          ...k.user,
          id: k.user.id.toString(),
        },
        idCardNumber: k.idCardNumber,
        idCardFrontUrl: k.idCardFrontUrl,
        idCardBackUrl: k.idCardBackUrl,
        selfieUrl: k.selfieUrl,
        status: k.status,
        rejectionReason: k.rejectionReason,
        verifiedAt: k.verifiedAt,
        createdAt: k.createdAt,
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
   * Admin: Review and Approve/Reject KYC
   */
  async adminReviewKYC(kycId: string, action: 'approve' | 'reject', reason?: string, adminId?: string) {
    const kycIdBigInt = BigInt(kycId);
    const adminIdBigInt = adminId ? BigInt(adminId) : null;

    const kyc = await prisma.sellerKYCVerification.findUnique({
      where: { id: kycIdBigInt },
      include: { user: true },
    });

    if (!kyc) {
      throw new NotFoundError('KYC record not found');
    }

    if (action === 'reject' && !reason) {
      throw new BadRequestError('Rejection reason is required when rejecting KYC verification.');
    }

    const isApprove = action === 'approve';

    await prisma.$transaction(async (tx) => {
      // 1. Update KYC record
      await tx.sellerKYCVerification.update({
        where: { id: kycIdBigInt },
        data: {
          status: isApprove ? 'approved' : 'rejected',
          rejectionReason: isApprove ? null : reason,
          verifiedAt: isApprove ? new Date() : null,
        },
      });

      // 2. If approved and user was 'buyer', upgrade role to 'seller'
      if (isApprove && kyc.user.role === 'buyer') {
        await tx.user.update({
          where: { id: kyc.userId },
          data: { role: 'seller' },
        });
      }

      // 3. Audit Log
      await tx.securityAuditLog.create({
        data: {
          userId: adminIdBigInt,
          action: isApprove ? 'KYC_APPROVED' : 'KYC_REJECTED',
          metadata: JSON.stringify({
            kycId: kyc.id.toString(),
            targetUserId: kyc.userId.toString(),
            action,
            reason: reason || null,
          }),
        },
      });
    });

    return {
      message: `KYC verification has been ${isApprove ? 'approved' : 'rejected'} successfully.`,
      status: isApprove ? 'approved' : 'rejected',
    };
  }
}

export const userService = new UserService();
export default userService;
