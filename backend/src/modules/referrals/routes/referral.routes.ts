import { Router } from 'express';
import { referralController } from '../controllers/referral.controller';
import { authenticate } from '../../../common/middleware/auth';

const router = Router();

// Referral endpoints require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/referrals/me
 * @desc    Get user's referral code, statistics, earnings, and invited friends
 * @access  Private
 */
router.get('/me', referralController.getMyReferralOverview);

export default router;
