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
}

export const userService = new UserService();
export default userService;
