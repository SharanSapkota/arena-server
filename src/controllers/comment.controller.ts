import { Request, Response } from 'express';
import { CommentService } from '../services/comment.service';
import { AppError } from '../utils/appError';

export class CommentController {
  private commentService: CommentService;

  constructor() {
    this.commentService = new CommentService();
  }

  createComment = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const { chatId, content } = req.body;
      const comment = await this.commentService.createComment({
        chat_id: chatId,
        user_id: userId,
        content,
      });
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getComment = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const comment = await this.commentService.getComment(id);
      res.json(comment);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getChatComments = async (req: Request, res: Response) => {
    try {
      const { chatId } = req.params;
      const comments = await this.commentService.getChatComments(chatId);
      res.json(comments);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getUserComments = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const comments = await this.commentService.getUserComments(userId);
      res.json(comments);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  updateComment = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const { id } = req.params;
      const { content } = req.body;
      await this.commentService.updateComment(id, userId, content);
      res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  deleteComment = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const { id } = req.params;
      await this.commentService.deleteComment(id, userId);
      res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getCommentCount = async (req: Request, res: Response) => {
    try {
      const { chatId } = req.params;
      const count = await this.commentService.getCommentCount(chatId);
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