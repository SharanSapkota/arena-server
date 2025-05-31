import { Request, Response } from 'express';
import { ArenaInviteService } from '../services/arena-invite.service';
import { AppError } from '../utils/appError';

export class ArenaInviteController {
  private arenaInviteService: ArenaInviteService;

  constructor() {
    this.arenaInviteService = new ArenaInviteService();
  }

  createInvite = async (req: Request, res: Response) => {
    try {
      const { arenaId, userId } = req.body;
      const creatorId = req.user?.id;

      if (!creatorId) {
        throw new AppError('Not authenticated', 401);
      }

      const invite = await this.arenaInviteService.createInvite(arenaId, creatorId, userId);
      res.status(201).json(invite);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getInvite = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const invite = await this.arenaInviteService.getInvite(id);
      res.json(invite);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getArenaInvites = async (req: Request, res: Response) => {
    try {
      const { arenaId } = req.params;
      const invites = await this.arenaInviteService.getArenaInvites(arenaId);
      res.json(invites);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getUserInvites = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const invites = await this.arenaInviteService.getUserInvites(userId);
      res.json(invites);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  removeInvite = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const creatorId = req.user?.id;

      if (!creatorId) {
        throw new AppError('Not authenticated', 401);
      }

      await this.arenaInviteService.removeInvite(id, creatorId);
      res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  removeInviteByArenaAndUser = async (req: Request, res: Response) => {
    try {
      const { arenaId, userId } = req.params;
      const creatorId = req.user?.id;

      if (!creatorId) {
        throw new AppError('Not authenticated', 401);
      }

      await this.arenaInviteService.removeInviteByArenaAndUser(arenaId, userId, creatorId);
      res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };
} 