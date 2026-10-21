import { Router } from 'express';
import { gameController } from '../controllers/game.controller';
import { validate } from '../../../common/middleware/validate';
import { authenticate, authorize } from '../../../common/middleware/auth';
import { createGameValidator, updateGameValidator } from '../validators/game.validator';

const router = Router();

/**
 * @route   GET /api/v1/games
 * @desc    Get all active games with listing counts
 * @access  Public
 */
router.get('/', gameController.getAllGames);

/**
 * @route   GET /api/v1/games/:id
 * @desc    Get single game details
 * @access  Public
 */
router.get('/:id', gameController.getGameById);

/**
 * @route   POST /api/v1/games
 * @desc    Create a new game
 * @access  Private (Admin only)
 */
router.post('/', authenticate, authorize('admin'), createGameValidator, validate, gameController.createGame);

/**
 * @route   PATCH /api/v1/games/:id
 * @desc    Update a game
 * @access  Private (Admin only)
 */
router.patch('/:id', authenticate, authorize('admin'), updateGameValidator, validate, gameController.updateGame);

export default router;
