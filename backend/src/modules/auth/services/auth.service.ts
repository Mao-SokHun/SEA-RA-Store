import bcrypt from 'bcryptjs';
import { prisma } from '../../../config/database';
import {
  AppError,
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '../../../common/errors/AppError';
import {
  hashToken,
  generateRandomToken,
  generateReferralCode,
} from '../../../common/utils/crypto';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../../../common/utils/jwt';

export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
  phone?: string;
  referralCode?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface LoginDTO {
  login: string; // username or email
  password: string;
  ipAddress?: string;
  userAgent?: string;
}

export class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterDTO) {
    const { username, email, password, phone, referralCode, ipAddress, userAgent } = data;

    // 1. Check if email exists
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      throw new ConflictError('An account with this email address already exists');
    }

    // 2. Check if username exists
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUsername) {
      throw new ConflictError('This username is already taken. Please choose another');
    }

    // 3. Check if phone exists (if provided)
    if (phone) {
      const existingPhone = await prisma.user.findUnique({
        where: { phone },
      });
      if (existingPhone) {
        throw new ConflictError('This phone number is already registered');
      }
    }

    // 4. Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 5. Generate unique referral code for this user
    let userReferralCode = generateReferralCode(username);
    while (await prisma.user.findUnique({ where: { referralCode: userReferralCode } })) {
      userReferralCode = generateReferralCode(username);
    }

    // 6. Check if user is being referred by another user
    let referrerId: bigint | null = null;
    if (referralCode) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode },
      });
      if (referrer) {
        referrerId = referrer.id;
      }
    }

    // 7. Atomic user creation transaction
    const newUser = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          username,
          email,
          passwordHash,
          phone: phone || null,
          referralCode: userReferralCode,
          role: 'buyer',
          status: 'active',
          lastLoginIp: ipAddress,
          lastLoginAt: new Date(),
        },
      });

      // Create primary wallet
      await tx.wallet.create({
        data: {
          userId: user.id,
          balance: 0,
        },
      });

      // Create default notification settings
      await tx.telegramNotificationSettings.create({
        data: {
          userId: user.id,
          notifyOnOrder: true,
          notifyOnPayment: true,
          notifyOnChat: true,
          notifyOnDispute: true,
          notifyOnPayout: true,
          isActive: true,
        },
      });

      // Record referral link if referred
      if (referrerId) {
        await tx.userReferral.create({
          data: {
            referrerId,
            refereeId: user.id,
            status: 'pending',
          },
        });
      }

      // Security audit log
      await tx.securityAuditLog.create({
        data: {
          userId: user.id,
          action: 'USER_REGISTER',
          ipAddress,
          userAgent,
          metadata: JSON.stringify({ email, username, referredBy: referrerId?.toString() }),
        },
      });

      return user;
    });

    // 8. Generate JWT tokens
    const jwtPayload = {
      sub: newUser.id.toString(),
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    };

    const accessToken = signAccessToken(jwtPayload);
    const refreshToken = signRefreshToken(jwtPayload);

    // 9. Store hashed refresh token in database
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.userRefreshToken.create({
      data: {
        userId: newUser.id,
        tokenHash,
        ipAddress,
        deviceInfo: userAgent,
        expiresAt,
      },
    });

    return {
      user: {
        id: newUser.id.toString(),
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        referralCode: newUser.referralCode,
        isEmailVerified: newUser.isEmailVerified,
        createdAt: newUser.createdAt,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  /**
   * Login with email/username and password
   */
  async login(data: LoginDTO) {
    const { login, password, ipAddress, userAgent } = data;

    // 1. Find user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: login, mode: 'insensitive' } },
          { username: { equals: login, mode: 'insensitive' } },
        ],
      },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid credentials. Please check your username/email and password.');
    }

    // 2. Check if account is banned or suspended
    if (user.status === 'banned') {
      throw new ForbiddenError('Your account has been permanently banned.');
    }
    if (user.status === 'suspended') {
      throw new ForbiddenError('Your account has been temporarily suspended. Please contact support.');
    }

    // 3. Check Account Lockout
    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      const remainingMinutes = Math.ceil((user.lockoutUntil.getTime() - Date.now()) / (60 * 1000));
      throw new ForbiddenError(
        `Too many failed attempts. Account is temporarily locked. Try again in ${remainingMinutes} minute(s).`
      );
    }

    // 4. Verify Password
    if (!user.passwordHash) {
      throw new UnauthorizedError('This account was created via social login. Please sign in with Google or Telegram.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      const failedAttempts = user.failedLoginAttempts + 1;
      let lockoutDate: Date | null = null;

      // Lock account after 5 consecutive failed attempts
      if (failedAttempts >= 5) {
        lockoutDate = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes lockout
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: failedAttempts,
          lockoutUntil: lockoutDate,
        },
      });

      await prisma.securityAuditLog.create({
        data: {
          userId: user.id,
          action: 'LOGIN_FAILED',
          ipAddress,
          userAgent,
          metadata: JSON.stringify({ failedAttempts, locked: !!lockoutDate }),
        },
      });

      throw new UnauthorizedError('Invalid credentials. Please check your username/email and password.');
    }

    // 5. Successful login: Reset failed attempts, update last login info
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockoutUntil: null,
        lastLoginAt: new Date(),
        lastLoginIp: ipAddress,
      },
    });

    // 6. Security Audit Log
    await prisma.securityAuditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN_SUCCESS',
        ipAddress,
        userAgent,
      },
    });

    // 7. Generate Tokens
    const jwtPayload = {
      sub: user.id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const accessToken = signAccessToken(jwtPayload);
    const refreshToken = signRefreshToken(jwtPayload);

    // 8. Store Refresh Token Hash
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.userRefreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        ipAddress,
        deviceInfo: userAgent,
        expiresAt,
      },
    });

    return {
      user: {
        id: user.id.toString(),
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        referralCode: user.referralCode,
        isEmailVerified: user.isEmailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  /**
   * Rotate Refresh Token (Refresh Token Mechanism)
   */
  async refreshToken(oldRefreshToken: string, ipAddress?: string, userAgent?: string) {
    if (!oldRefreshToken) {
      throw new UnauthorizedError('Refresh token is required');
    }

    // 1. Verify token signature
    const payload = verifyRefreshToken(oldRefreshToken);

    // 2. Verify hashed token exists in DB
    const oldHash = hashToken(oldRefreshToken);
    const storedToken = await prisma.userRefreshToken.findFirst({
      where: {
        tokenHash: oldHash,
        userId: BigInt(payload.sub),
      },
      include: { user: true },
    });

    if (!storedToken) {
      throw new UnauthorizedError('Invalid refresh token. Please sign in again.');
    }

    // Check if token naturally expired
    if (storedToken.expiresAt <= new Date()) {
      throw new UnauthorizedError('Refresh token has expired. Please sign in again.');
    }

    // If token was already revoked, this is a reuse attack: revoke all tokens for safety
    if (storedToken.isRevoked) {
      await prisma.userRefreshToken.updateMany({
        where: { userId: BigInt(payload.sub) },
        data: { isRevoked: true },
      });

      throw new UnauthorizedError('Refresh token has already been used and revoked. Please sign in again.');
    }

    // 3. Revoke the old refresh token atomically (Token Rotation with Atomic CAS)
    const updateCount = await prisma.userRefreshToken.updateMany({
      where: { id: storedToken.id, isRevoked: false },
      data: { isRevoked: true },
    });

    if (updateCount.count === 0) {
      throw new UnauthorizedError('Refresh token already rotated. Please use your newest session token.');
    }

    // 4. Issue new access token and new refresh token
    const jwtPayload = {
      sub: storedToken.user.id.toString(),
      username: storedToken.user.username,
      email: storedToken.user.email,
      role: storedToken.user.role,
    };

    const newAccessToken = signAccessToken(jwtPayload);
    const newRefreshToken = signRefreshToken(jwtPayload);

    // 5. Store new refresh token hash
    const newHash = hashToken(newRefreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prisma.userRefreshToken.create({
      data: {
        userId: storedToken.user.id,
        tokenHash: newHash,
        ipAddress,
        deviceInfo: userAgent,
        expiresAt,
      },
    });

    return {
      tokens: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    };
  }

  /**
   * Logout user (Revoke refresh token)
   */
  async logout(refreshToken?: string, userId?: string) {
    if (refreshToken) {
      const tokenHash = hashToken(refreshToken);
      await prisma.userRefreshToken.updateMany({
        where: { tokenHash },
        data: { isRevoked: true },
      });
    }

    if (userId) {
      await prisma.securityAuditLog.create({
        data: {
          userId: BigInt(userId),
          action: 'LOGOUT',
        },
      });
    }

    return { message: 'Logged out successfully' };
  }

  /**
   * Request password reset token
   */
  async forgotPassword(email: string, ipAddress?: string, userAgent?: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always respond with success to prevent user email enumeration
    if (!user) {
      return {
        message: 'If that email address is in our database, we will send a password reset link.',
      };
    }

    // 1. Invalidate any existing unused reset tokens for this user
    await prisma.passwordResetToken.updateMany({
      where: { userId: user.id, isUsed: false },
      data: { isUsed: true },
    });

    // 2. Generate new token
    const resetToken = generateRandomToken(32);
    const tokenHash = hashToken(resetToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour validity

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
        ipAddress,
      },
    });

    await prisma.securityAuditLog.create({
      data: {
        userId: user.id,
        action: 'PASSWORD_RESET_REQUESTED',
        ipAddress,
        userAgent,
      },
    });

    // In production, send via email service. For dev/testing, token is returned:
    return {
      message: 'If that email address is in our database, we will send a password reset link.',
      resetToken, // Provided for easy development testing
    };
  }

  /**
   * Reset password using token
   */
  async resetPassword(token: string, newPassword: string, ipAddress?: string) {
    const tokenHash = hashToken(token);

    const resetRecord = await prisma.passwordResetToken.findFirst({
      where: {
        tokenHash,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!resetRecord) {
      throw new BadRequestError('Invalid or expired password reset token');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await prisma.$transaction(async (tx) => {
      // 1. Update user password
      await tx.user.update({
        where: { id: resetRecord.userId },
        data: {
          passwordHash,
          passwordChangedAt: new Date(),
          failedLoginAttempts: 0,
          lockoutUntil: null,
        },
      });

      // 2. Mark token as used (Atomic CAS guard)
      const usedCount = await tx.passwordResetToken.updateMany({
        where: { id: resetRecord.id, isUsed: false },
        data: { isUsed: true },
      });

      if (usedCount.count === 0) {
        throw new BadRequestError('Password reset token has already been used.');
      }

      // 3. Invalidate ALL refresh tokens (force re-login on all devices)
      await tx.userRefreshToken.updateMany({
        where: { userId: resetRecord.userId },
        data: { isRevoked: true },
      });

      // 4. Security Audit Log
      await tx.securityAuditLog.create({
        data: {
          userId: resetRecord.userId,
          action: 'PASSWORD_RESET_COMPLETED',
          ipAddress,
        },
      });
    });

    return { message: 'Password has been successfully reset. Please log in with your new password.' };
  }

  /**
   * Get user profile with wallet and referral stats
   */
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: BigInt(userId) },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        referralCode: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        twoFactorEnabled: true,
        createdAt: true,
        wallet: {
          select: {
            balance: true,
            updatedAt: true,
          },
        },
        telegramSettings: {
          select: {
            telegramChatId: true,
            isActive: true,
          },
        },
        _count: {
          select: {
            sellingAccounts: true,
            buyerOrders: true,
            sellerOrders: true,
            referralsMade: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('User profile not found');
    }

    return {
      user: {
        id: user.id.toString(),
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        referralCode: user.referralCode,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        twoFactorEnabled: user.twoFactorEnabled,
        createdAt: user.createdAt,
        wallet: {
          balance: user.wallet?.balance ? Number(user.wallet.balance) : 0,
        },
        telegramLinked: !!user.telegramSettings?.telegramChatId,
        stats: {
          listingsCount: user._count.sellingAccounts,
          buyerOrdersCount: user._count.buyerOrders,
          sellerOrdersCount: user._count.sellerOrders,
          referralsCount: user._count.referralsMade,
        },
      },
    };
  }
}

export const authService = new AuthService();
export default authService;
