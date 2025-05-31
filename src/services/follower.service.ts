import { FollowerRepository } from '../repositories/follower.repository';
import { Follower } from '../types/user.types';
import { AppError } from '../utils/appError';

export class FollowerService {
  private followerRepository: FollowerRepository;

  constructor() {
    this.followerRepository = new FollowerRepository();
  }

  async followUser(followerId: string, followingId: string): Promise<Follower> {
    return this.followerRepository.create({ follower_id: followerId, following_id: followingId });
  }

  async getFollower(id: string): Promise<Follower> {
    const follower = await this.followerRepository.findById(id);
    if (!follower) {
      throw new AppError('Follower not found', 404);
    }
    return follower;
  }

  async getFollowers(userId: string): Promise<Follower[]> {
    return this.followerRepository.findByFollowingId(userId);
  }

  async getFollowing(userId: string): Promise<Follower[]> {
    return this.followerRepository.findByFollowerId(userId);
  }

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    const success = await this.followerRepository.deleteByFollowerAndFollowing(followerId, followingId);
    if (!success) {
      throw new AppError('Failed to unfollow user', 500);
    }
  }
} 