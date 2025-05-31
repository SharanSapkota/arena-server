import { Request, Response } from 'express';
import { ChatService } from '../services/chat.service';
import { AppError } from '../utils/appError';

export class ChatController {
  private chatService: ChatService;

  constructor() {
    this.chatService = new ChatService();
  }

  createChat = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const { arenaId, content, type } = req.body;
      const chat = await this.chatService.createChat({
        arena_id: arenaId,
        user_id: userId,
        content,
        type,
      });
      res.status(201).json(chat);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getChat = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const chat = await this.chatService.getChat(id);
      res.json(chat);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getArenaChats = async (req: Request, res: Response) => {
    try {
      const { arenaId } = req.params;
      const chats = await this.chatService.getArenaChats(arenaId);
      res.json(chats);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getUserChats = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const chats = await this.chatService.getUserChats(userId);
      res.json(chats);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  updateChat = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const { id } = req.params;
      const { content } = req.body;
      await this.chatService.updateChat(id, userId, content);
      res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  deleteChat = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const { id } = req.params;
      await this.chatService.deleteChat(id, userId);
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