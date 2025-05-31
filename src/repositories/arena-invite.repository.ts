import prisma from '../lib/prisma';
import { ArenaInvite } from '../types/arena.types';

export class ArenaInviteRepository {
  async findById(id: string): Promise<ArenaInvite | null> {
    return prisma.arenaInvite.findUnique({
      where: { id },
      include: {
        arena: {
          select: {
            id: true,
            title: true,
            creator: {
              select: {
                id: true,
                username: true,
                fullName: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
    });
  }

  async findByArenaId(arenaId: string): Promise<ArenaInvite[]> {
    return prisma.arenaInvite.findMany({
      where: { arenaId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
    });
  }

  async findByUserId(userId: string): Promise<ArenaInvite[]> {
    return prisma.arenaInvite.findMany({
      where: { userId },
      include: {
        arena: {
          select: {
            id: true,
            title: true,
            creator: {
              select: {
                id: true,
                username: true,
                fullName: true,
              },
            },
          },
        },
      },
    });
  }

  async create(data: { arena_id: string; user_id: string }): Promise<ArenaInvite> {
    return prisma.arenaInvite.create({
      data: {
        arenaId: data.arena_id,
        userId: data.user_id,
      },
      include: {
        arena: {
          select: {
            id: true,
            title: true,
            creator: {
              select: {
                id: true,
                username: true,
                fullName: true,
              },
            },
          },
        },
        user: {
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
      await prisma.arenaInvite.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteByArenaAndUser(arenaId: string, userId: string): Promise<boolean> {
    try {
      await prisma.arenaInvite.delete({
        where: {
          arenaId_userId: {
            arenaId,
            userId,
          },
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
} 