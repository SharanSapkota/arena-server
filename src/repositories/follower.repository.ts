import prisma from '../lib/prisma';
import { Follower } from '../types/user.types';

export class FollowerRepository {
  async findById(id: string): Promise<Follower | null> {
    return prisma.follower.findUnique({
      where: { id },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
        following: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
    });
  }

  async findByFollowerId(followerId: string): Promise<Follower[]> {
    return prisma.follower.findMany({
      where: { followerId },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
    });
  }

  async findByFollowingId(followingId: string): Promise<Follower[]> {
    return prisma.follower.findMany({
      where: { followingId },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
    });
  }

  async create(data: { follower_id: string; following_id: string }): Promise<Follower> {
    return prisma.follower.create({
      data: {
        followerId: data.follower_id,
        followingId: data.following_id,
      },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
        following: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
    });
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.follower.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteByFollowerAndFollowing(followerId: string, followingId: string): Promise<boolean> {
    try {
      await prisma.follower.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
} 