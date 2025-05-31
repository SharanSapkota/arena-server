import { ArenaInviteRepository } from '../repositories/arena-invite.repository';
import { ArenaRepository } from '../repositories/arena.repository';
import { ArenaInvite } from '../types/arena.types';
import { AppError } from '../utils/appError';

export class ArenaInviteService {
  private arenaInviteRepository: ArenaInviteRepository;
  private arenaRepository: ArenaRepository;

  constructor() {
    this.arenaInviteRepository = new ArenaInviteRepository();
    this.arenaRepository = new ArenaRepository();
  }

  async createInvite(arenaId: string, creatorId: string, userId: string): Promise<ArenaInvite> {
    // Check if arena exists and user is creator
    const arena = await this.arenaRepository.findById(arenaId);
    if (!arena) {
      throw new AppError('Arena not found', 404);
    }

    if (arena.creatorId !== creatorId) {
      throw new AppError('Not authorized to invite users to this arena', 403);
    }

    // Create invite
    return this.arenaInviteRepository.create({
      arena_id: arenaId,
      user_id: userId,
    });
  }

  async getInvite(id: string): Promise<ArenaInvite> {
    const invite = await this.arenaInviteRepository.findById(id);
    if (!invite) {
      throw new AppError('Invite not found', 404);
    }
    return invite;
  }

  async getArenaInvites(arenaId: string): Promise<ArenaInvite[]> {
    return this.arenaInviteRepository.findByArenaId(arenaId);
  }

  async getUserInvites(userId: string): Promise<ArenaInvite[]> {
    return this.arenaInviteRepository.findByUserId(userId);
  }

  async removeInvite(id: string, creatorId: string): Promise<void> {
    const invite = await this.arenaInviteRepository.findById(id);
    if (!invite) {
      throw new AppError('Invite not found', 404);
    }

    // Check if user is arena creator
    const arena = await this.arenaRepository.findById(invite.arena_id);
    if (!arena || arena.creatorId !== creatorId) {
      throw new AppError('Not authorized to remove this invite', 403);
    }

    const success = await this.arenaInviteRepository.delete(id);
    if (!success) {
      throw new AppError('Failed to remove invite', 500);
    }
  }

  async removeInviteByArenaAndUser(arenaId: string, userId: string, creatorId: string): Promise<void> {
    // Check if user is arena creator
    const arena = await this.arenaRepository.findById(arenaId);
    if (!arena || arena.creatorId !== creatorId) {
      throw new AppError('Not authorized to remove this invite', 403);
    }

    const success = await this.arenaInviteRepository.deleteByArenaAndUser(arenaId, userId);
    if (!success) {
      throw new AppError('Failed to remove invite', 500);
    }
  }
} 