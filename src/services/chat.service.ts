import { ChatRepository } from '../repositories/chat.repository';
import { Chat } from '../types/chat.types';
import { AppError } from '../utils/appError';

export class ChatService {
  private chatRepository: ChatRepository;

  constructor() {
    this.chatRepository = new ChatRepository();
  }

  async createChat(data: {
    arena_id: string;
    user_id: string;
    content: string;
    type: 'text' | 'image' | 'video';
  }): Promise<Chat> {
    return this.chatRepository.create(data);
  }

  async getChat(id: string): Promise<Chat> {
    const chat = await this.chatRepository.findById(id);
    if (!chat) {
      throw new AppError('Chat not found', 404);
    }
    return chat;
  }

  async getArenaChats(arenaId: string): Promise<Chat[]> {
    return this.chatRepository.findByArenaId(arenaId);
  }

  async getUserChats(userId: string): Promise<Chat[]> {
    return this.chatRepository.findByUserId(userId);
  }

  async updateChat(id: string, userId: string, content: string): Promise<void> {
    const chat = await this.chatRepository.findById(id);
    if (!chat) {
      throw new AppError('Chat not found', 404);
    }

    if (chat.userId !== userId) {
      throw new AppError('Not authorized to update this chat', 403);
    }

    const success = await this.chatRepository.update(id, { content });
    if (!success) {
      throw new AppError('Failed to update chat', 500);
    }
  }

  async deleteChat(id: string, userId: string): Promise<void> {
    const chat = await this.chatRepository.findById(id);
    if (!chat) {
      throw new AppError('Chat not found', 404);
    }

    if (chat.userId !== userId) {
      throw new AppError('Not authorized to delete this chat', 403);
    }

    const success = await this.chatRepository.delete(id);
    if (!success) {
      throw new AppError('Failed to delete chat', 500);
    }
  }
} 