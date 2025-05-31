import { Request, Response } from 'express';
import { ArenaService } from '../services/arena.service';
import { CreateArenaDto, UpdateArenaDto, CreateChatDto, CreateCommentDto } from '../types/arena.types';
import { AppError } from '../utils/appError';

export class ArenaController {
  private arenaService: ArenaService;

  constructor() {
    this.arenaService = new ArenaService();
  }

  createArena = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const arenaData: CreateArenaDto = req.body;
      const arena = await this.arenaService.createArena(userId, arenaData);
      res.status(201).json(arena);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getArena = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const arena = await this.arenaService.getArena(id);
      res.status(200).json(arena);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getAllArenas = async (req: Request, res: Response): Promise<void> => {
    try {
      const arenas = await this.arenaService.getAllArenas();
      res.status(200).json(arenas);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  updateArena = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const { id } = req.params;
      const updateData: UpdateArenaDto = req.body;
      const arena = await this.arenaService.updateArena(id, userId, updateData);
      res.status(200).json(arena);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  deleteArena = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const { id } = req.params;
      await this.arenaService.deleteArena(id, userId);
      res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  inviteToArena = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const { id: arenaId } = req.params;
      const { userId: inviteeId } = req.body;
      await this.arenaService.inviteToArena(arenaId, userId, inviteeId);
      res.status(200).json({ message: 'Invitation sent successfully' });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  removeInvite = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const { id: arenaId } = req.params;
      const { userId: inviteeId } = req.body;
      await this.arenaService.removeInvite(arenaId, userId, inviteeId);
      res.status(200).json({ message: 'Invitation removed successfully' });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  addChat = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const { id: arenaId } = req.params;
      const { message }: CreateChatDto = req.body;
      const chat = await this.arenaService.addChat(arenaId, userId, message);
      res.status(201).json(chat);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getChats = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id: arenaId } = req.params;
      const chats = await this.arenaService.getChats(arenaId);
      res.status(200).json(chats);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  addComment = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const { id: arenaId } = req.params;
      const { comment }: CreateCommentDto = req.body;
      const newComment = await this.arenaService.addComment(arenaId, userId, comment);
      res.status(201).json(newComment);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getComments = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id: arenaId } = req.params;
      const comments = await this.arenaService.getComments(arenaId);
      res.status(200).json(comments);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  addView = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id: arenaId } = req.params;
      const userId = req.user?.id;
      const view = await this.arenaService.addView(arenaId, {
        viewerId: userId,
        ipAddress: req.ip || '0.0.0.0',
        userAgent: req.headers['user-agent'] || '',
      });
      res.status(201).json(view);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getViews = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id: arenaId } = req.params;
      const views = await this.arenaService.getViews(arenaId);
      res.status(200).json(views);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };
} 