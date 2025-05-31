import { ArenaViewRepository } from '../repositories/arena-view.repository';
import { ArenaView } from '../types/arena.types';
import { AppError } from '../utils/appError';

export class ArenaViewService {
  private arenaViewRepository: ArenaViewRepository;

  constructor() {
    this.arenaViewRepository = new ArenaViewRepository();
  }

  async addView(arenaId: string, userId: string, ipAddress: string, userAgent: string): Promise<ArenaView> {
    const view = await this.arenaViewRepository.create({
      arena_id: arenaId,
      viewer_id: userId,
      ip_address: ipAddress,
      user_agent: userAgent,
    });
    if (!view) {
      throw new AppError('Failed to create arena view', 500);
    }
    return view;
  }

  async getView(id: string): Promise<ArenaView> {
    const view = await this.arenaViewRepository.findById(id);
    if (!view) {
      throw new AppError('Arena view not found', 404);
    }
    return view;
  }

  async getArenaViews(arenaId: string): Promise<ArenaView[]> {
    return this.arenaViewRepository.findByArenaId(arenaId);
  }

  async getUserViews(userId: string): Promise<ArenaView[]> {
    return this.arenaViewRepository.findByUserId(userId);
  }

  async removeView(id: string, userId: string): Promise<void> {
    const view = await this.arenaViewRepository.findById(id);
    if (!view) {
      throw new AppError('Arena view not found', 404);
    }

    if (view.viewerId !== userId) {
      throw new AppError('Not authorized to remove this view', 403);
    }

    const success = await this.arenaViewRepository.delete(id);
    if (!success) {
      throw new AppError('Failed to remove arena view', 500);
    }
  }

  async getViewCount(arenaId: string): Promise<number> {
    return this.arenaViewRepository.countByArenaId(arenaId);
  }
} 