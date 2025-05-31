import { Request, Response } from 'express';
import { ChatLikeService } from '../services/chat-like.service';
import { AppError } from '../utils/appError';

export class ChatLikeController {
  private chatLikeService: ChatLikeService;

  constructor() {
    this.chatLikeService = new ChatLikeService();
  }

  likeChat = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const { chatId } = req.params;
      const like = await this.chatLikeService.likeChat(chatId, userId);
      res.status(201).json(like);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getLike = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const like = await this.chatLikeService.getLike(id);
      res.json(like);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getChatLikes = async (req: Request, res: Response) => {
    try {
      const { chatId } = req.params;
      const likes = await this.chatLikeService.getChatLikes(chatId);
      res.json(likes);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getUserLikes = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const likes = await this.chatLikeService.getUserLikes(userId);
      res.json(likes);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  unlikeChat = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const { chatId } = req.params;
      await this.chatLikeService.unlikeChat(chatId, userId);
      res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getLikeCount = async (req: Request, res: Response) => {
    try {
      const { chatId } = req.params;
      const count = await this.chatLikeService.getLikeCount(chatId);
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