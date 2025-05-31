import prisma from '../lib/prisma';
import { Arena, CreateArenaDto, UpdateArenaDto, Chat, Comment, ArenaView } from '@/types/arena.types';

export class ArenaRepository {
  async findById(id: string): Promise<Arena | null> {
    return prisma.arena.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
    });
  }

  async findAll(): Promise<Arena[]> {
    return prisma.arena.findMany({
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
    });
  }

  async create(data: CreateArenaDto & { creator_id: string }): Promise<Arena> {
    return prisma.arena.create({
      data: {
        title: data.title,
        description: data.description,
        creatorId: data.creator_id,
        isPublic: data.is_public,
      },
    });
  }

  async update(id: string, data: UpdateArenaDto): Promise<Arena | null> {
    const updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.description) updateData.description = data.description;
    if (typeof data.is_public === 'boolean') updateData.isPublic = data.is_public;

    return prisma.arena.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.arena.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async addInvite(arenaId: string, userId: string): Promise<void> {
    await prisma.arenaInvite.create({
      data: {
        arenaId,
        userId,
      },
    });
  }

  async removeInvite(arenaId: string, userId: string): Promise<void> {
    await prisma.arenaInvite.delete({
      where: {
        arenaId_userId: {
          arenaId,
          userId,
        },
      },
    });
  }

  async addChat(arenaId: string, senderId: string, message: string): Promise<Chat> {
    return prisma.chat.create({
      data: {
        arenaId,
        senderId,
        message,
      },
    });
  }

  async getChats(arenaId: string): Promise<Chat[]> {
    return prisma.chat.findMany({
      where: { arenaId },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
      orderBy: {
        sentAt: 'desc',
      },
    });
  }

  async addComment(arenaId: string, commenterId: string, comment: string): Promise<Comment> {
    return prisma.comment.create({
      data: {
        arenaId,
        commenterId,
        comment,
      },
    });
  }

  async getComments(arenaId: string): Promise<Comment[]> {
    return prisma.comment.findMany({
      where: { arenaId },
      include: {
        commenter: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
      orderBy: {
        commentedAt: 'desc',
      },
    });
  }

  async addView(arenaId: string, data: { viewerId?: string; guestId?: string; ipAddress: string; userAgent: string }): Promise<ArenaView> {
    return prisma.arenaView.create({
      data: {
        arenaId,
        viewerId: data.viewerId,
        guestId: data.guestId,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
  }

  async getViews(arenaId: string): Promise<ArenaView[]> {
    return prisma.arenaView.findMany({
      where: { arenaId },
      include: {
        viewer: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
      orderBy: {
        viewedAt: 'desc',
      },
    });
  }
} 