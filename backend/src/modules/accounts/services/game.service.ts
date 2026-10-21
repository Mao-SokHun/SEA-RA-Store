import { prisma } from '../../../config/database';
import { NotFoundError, ConflictError } from '../../../common/errors/AppError';

export interface CreateGameDTO {
  title: string;
  platform: string;
  iconUrl?: string;
  isActive?: boolean;
}

export interface UpdateGameDTO {
  title?: string;
  platform?: string;
  iconUrl?: string;
  isActive?: boolean;
}

export class GameService {
  /**
   * List all games with count of active available accounts
   */
  async getAllGames(includeInactive: boolean = false) {
    const where = includeInactive ? {} : { isActive: true };

    const games = await prisma.game.findMany({
      where,
      orderBy: { title: 'asc' },
      include: {
        _count: {
          select: {
            accounts: {
              where: { status: 'available' },
            },
          },
        },
      },
    });

    return games.map((game) => ({
      id: game.id.toString(),
      title: game.title,
      platform: game.platform,
      iconUrl: game.iconUrl,
      isActive: game.isActive,
      availableAccountsCount: game._count.accounts,
    }));
  }

  /**
   * Get single game by ID
   */
  async getGameById(id: string) {
    const game = await prisma.game.findUnique({
      where: { id: BigInt(id) },
      include: {
        _count: {
          select: {
            accounts: {
              where: { status: 'available' },
            },
          },
        },
      },
    });

    if (!game) {
      throw new NotFoundError(`Game with ID ${id} not found`);
    }

    return {
      id: game.id.toString(),
      title: game.title,
      platform: game.platform,
      iconUrl: game.iconUrl,
      isActive: game.isActive,
      availableAccountsCount: game._count.accounts,
    };
  }

  /**
   * Create a new game (Admin)
   */
  async createGame(data: CreateGameDTO) {
    const existing = await prisma.game.findFirst({
      where: {
        title: { equals: data.title, mode: 'insensitive' },
      },
    });

    if (existing) {
      throw new ConflictError(`Game with title "${data.title}" already exists`);
    }

    const game = await prisma.game.create({
      data: {
        title: data.title,
        platform: data.platform,
        iconUrl: data.iconUrl,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });

    return {
      id: game.id.toString(),
      title: game.title,
      platform: game.platform,
      iconUrl: game.iconUrl,
      isActive: game.isActive,
    };
  }

  /**
   * Update an existing game (Admin)
   */
  async updateGame(id: string, data: UpdateGameDTO) {
    const gameId = BigInt(id);

    const existing = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!existing) {
      throw new NotFoundError(`Game with ID ${id} not found`);
    }

    if (data.title && data.title !== existing.title) {
      const duplicate = await prisma.game.findFirst({
        where: {
          title: { equals: data.title, mode: 'insensitive' },
          id: { not: gameId },
        },
      });
      if (duplicate) {
        throw new ConflictError(`Another game with title "${data.title}" already exists`);
      }
    }

    const updated = await prisma.game.update({
      where: { id: gameId },
      data: {
        title: data.title,
        platform: data.platform,
        iconUrl: data.iconUrl,
        isActive: data.isActive,
      },
    });

    return {
      id: updated.id.toString(),
      title: updated.title,
      platform: updated.platform,
      iconUrl: updated.iconUrl,
      isActive: updated.isActive,
    };
  }
}

export const gameService = new GameService();
export default gameService;
