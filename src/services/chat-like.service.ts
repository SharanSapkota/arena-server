import { ChatLikeRepository } from '../repositories/chat-like.repository';
import { ChatLike } from '../types/chat.types';
import { AppError } from '../utils/appError';

export class ChatLikeService {
  private chatLikeRepository: ChatLikeRepository;

  constructor() {
    this.chatLikeRepository = new ChatLikeRepository();
  }

  async likeChat(chatId: string, userId: string): Promise<ChatLike> {
    return this.chatLikeRepository.create({
      chat_id: chatId,
      user_id: userId,
    });
  }

  async getLike(id: string): Promise<ChatLike> {
    const like = await this.chatLikeRepository.findById(id);
    if (!like) {
      throw new AppError('Like not found', 404);
    }
    return like;
  }

  async getChatLikes(chatId: string): Promise<ChatLike[]> {
    return this.chatLikeRepository.findByChatId(chatId);
  }

  async getUserLikes(userId: string): Promise<ChatLike[]> {
    return this.chatLikeRepository.findByUserId(userId);
  }

  async unlikeChat(chatId: string, userId: string): Promise<void> {
    const success = await this.chatLikeRepository.deleteByChatAndUser(chatId, userId);
    if (!success) {
      throw new AppError('Failed to unlike chat', 500);
    }
  }

  async getLikeCount(chatId: string): Promise<number> {
    return this.chatLikeRepository.countByChatId(chatId);
  }
} 