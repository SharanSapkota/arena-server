import { Request, Response } from 'express';
import { ArenaViewService } from '../services/arena-view.service';
import { AppError } from '../utils/appError';

export class ArenaViewController {
  private arenaViewService: ArenaViewService;

  constructor() {
    this.arenaViewService = new ArenaViewService();
  }

  addView = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const { arenaId } = req.params;
      const userAgent = req.headers['user-agent'] || 'Unknown';
      const ipAddress = req.ip || '0.0.0.0';
      const view = await this.arenaViewService.addView(
        arenaId,
        userId,
        ipAddress,
        userAgent
      );
      res.status(201).json(view);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getView = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const view = await this.arenaViewService.getView(id);
      res.json(view);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getArenaViews = async (req: Request, res: Response) => {
    try {
      const { arenaId } = req.params;
      const views = await this.arenaViewService.getArenaViews(arenaId);
      res.json(views);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getUserViews = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const views = await this.arenaViewService.getUserViews(userId);
      res.json(views);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  removeView = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const { id } = req.params;
      await this.arenaViewService.removeView(id, userId);
      res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getViewCount = async (req: Request, res: Response) => {
    try {
      const { arenaId } = req.params;
      const count = await this.arenaViewService.getViewCount(arenaId);
      res.json({ count });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };
} 