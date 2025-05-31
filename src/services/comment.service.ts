import { CommentRepository } from '../repositories/comment.repository';
import { ChatComment } from '../types/chat.types';
import { AppError } from '../utils/appError';

export class CommentService {
  private commentRepository: CommentRepository;

  constructor() {
    this.commentRepository = new CommentRepository();
  }

  async createComment(data: { chat_id: string; user_id: string; content: string }): Promise<ChatComment> {
    return this.commentRepository.create(data);
  }

  async getComment(id: string): Promise<ChatComment> {
    const comment = await this.commentRepository.findById(id);
    if (!comment) {
      throw new AppError('Comment not found', 404);
    }
    return comment;
  }

  async getChatComments(chatId: string): Promise<ChatComment[]> {
    return this.commentRepository.findByChatId(chatId);
  }

  async getUserComments(userId: string): Promise<ChatComment[]> {
    return this.commentRepository.findByUserId(userId);
  }

  async updateComment(id: string, userId: string, content: string): Promise<void> {
    const comment = await this.commentRepository.findById(id);
    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    if (comment.userId !== userId) {
      throw new AppError('Not authorized to update this comment', 403);
    }

    const success = await this.commentRepository.update(id, { content });
    if (!success) {
      throw new AppError('Failed to update comment', 500);
    }
  }

  async deleteComment(id: string, userId: string): Promise<void> {
    const comment = await this.commentRepository.findById(id);
    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    if (comment.userId !== userId) {
      throw new AppError('Not authorized to delete this comment', 403);
    }

    const success = await this.commentRepository.delete(id);
    if (!success) {
      throw new AppError('Failed to delete comment', 500);
    }
  }

  async getCommentCount(chatId: string): Promise<number> {
    return this.commentRepository.countByChatId(chatId);
  }
} 