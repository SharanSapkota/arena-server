import { AppError } from '@/utils/appError';
import { ArenaRepository } from '../repositories/arena.repository';
import { Arena, CreateArenaDto, UpdateArenaDto, Chat, Comment, ArenaView } from '../types/arena.types';

export class ArenaService {
  private arenaRepository: ArenaRepository;

  constructor() {
    this.arenaRepository = new ArenaRepository();
  }

  async createArena(creatorId: string, data: CreateArenaDto): Promise<Arena> {
    return this.arenaRepository.create({
      ...data,
      creator_id: creatorId,
    });
  }

  async getArena(id: string): Promise<Arena> {
    const arena = await this.arenaRepository.findById(id);
    if (!arena) {
      throw new AppError('Arena not found', 404);
    }
    return arena;
  }

  async getAllArenas(): Promise<Arena[]> {
    return this.arenaRepository.findAll();
  }

  async updateArena(id: string, creatorId: string, data: UpdateArenaDto): Promise<Arena> {
    const arena = await this.arenaRepository.findById(id);
    if (!arena) {
      throw new AppError('Arena not found', 404);
    }

    if (arena.creatorId !== creatorId) {
      throw new AppError('Not authorized to update this arena', 403);
    }

    const updatedArena = await this.arenaRepository.update(id, data);
    if (!updatedArena) {
      throw new AppError('Failed to update arena', 500);
    }

    return updatedArena;
  }

  async deleteArena(id: string, creatorId: string): Promise<void> {
    const arena = await this.arenaRepository.findById(id);
    if (!arena) {
      throw new AppError('Arena not found', 404);
    }

    if (arena.creatorId !== creatorId) {
      throw new AppError('Not authorized to delete this arena', 403);
    }

    const success = await this.arenaRepository.delete(id);
    if (!success) {
      throw new AppError('Failed to delete arena', 500);
    }
  }

  async inviteToArena(arenaId: string, creatorId: string, userId: string): Promise<void> {
    const arena = await this.arenaRepository.findById(arenaId);
    if (!arena) {
      throw new AppError('Arena not found', 404);
    }

    if (arena.creatorId !== creatorId) {
      throw new AppError('Not authorized to invite users to this arena', 403);
    }

    await this.arenaRepository.addInvite(arenaId, userId);
  }

  async removeInvite(arenaId: string, creatorId: string, userId: string): Promise<void> {
    const arena = await this.arenaRepository.findById(arenaId);
    if (!arena) {
      throw new AppError('Arena not found', 404);
    }

    if (arena.creatorId !== creatorId) {
      throw new AppError('Not authorized to remove invites from this arena', 403);
    }

    await this.arenaRepository.removeInvite(arenaId, userId);
  }

  async addChat(arenaId: string, senderId: string, message: string): Promise<Chat> {
    const arena = await this.arenaRepository.findById(arenaId);
    if (!arena) {
      throw new AppError('Arena not found', 404);
    }

    return this.arenaRepository.addChat(arenaId, senderId, message);
  }

  async getChats(arenaId: string): Promise<Chat[]> {
    const arena = await this.arenaRepository.findById(arenaId);
    if (!arena) {
      throw new AppError('Arena not found', 404);
    }

    return this.arenaRepository.getChats(arenaId);
  }

  async addComment(arenaId: string, commenterId: string, comment: string): Promise<Comment> {
    const arena = await this.arenaRepository.findById(arenaId);
    if (!arena) {
      throw new AppError('Arena not found', 404);
    }

    return this.arenaRepository.addComment(arenaId, commenterId, comment);
  }

  async getComments(arenaId: string): Promise<Comment[]> {
    const arena = await this.arenaRepository.findById(arenaId);
    if (!arena) {
      throw new AppError('Arena not found', 404);
    }

    return this.arenaRepository.getComments(arenaId);
  }

  async addView(arenaId: string, data: { viewerId?: string; guestId?: string; ipAddress: string; userAgent: string }): Promise<ArenaView> {
    const arena = await this.arenaRepository.findById(arenaId);
    if (!arena) {
      throw new AppError('Arena not found', 404);
    }

    return this.arenaRepository.addView(arenaId, data);
  }

  async getViews(arenaId: string): Promise<ArenaView[]> {
    const arena = await this.arenaRepository.findById(arenaId);
    if (!arena) {
      throw new AppError('Arena not found', 404);
    }

    return this.arenaRepository.getViews(arenaId);
  }
} 