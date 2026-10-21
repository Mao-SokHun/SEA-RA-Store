import { Request, Response, NextFunction } from 'express';
import { gameService } from '../services/game.service';
import { sendCreated, sendSuccess } from '../../../common/utils/response';

export class GameController {
  getAllGames = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const games = await gameService.getAllGames(includeInactive);
      sendSuccess(res, games, 'Games list retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  getGameById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const game = await gameService.getGameById(id);
      sendSuccess(res, game, 'Game retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  createGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const game = await gameService.createGame(req.body);
      sendCreated(res, game, 'Game created successfully');
    } catch (error) {
      next(error);
    }
  };

  updateGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const game = await gameService.updateGame(id, req.body);
      sendSuccess(res, game, 'Game updated successfully');
    } catch (error) {
      next(error);
    }
  };
}

export const gameController = new GameController();
export default gameController;
