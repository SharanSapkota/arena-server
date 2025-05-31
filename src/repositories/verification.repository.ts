import prisma from '../lib/prisma';
import { UserVerification } from '../types/user.types';

export class VerificationRepository {
  async findById(id: string): Promise<UserVerification | null> {
    return prisma.userVerification.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string): Promise<UserVerification[]> {
    return prisma.userVerification.findMany({
      where: { userId },
    });
  }

  async create(data: { user_id: string; provider: 'twitter' | 'linkedin' }): Promise<UserVerification> {
    return prisma.userVerification.create({
      data: {
        userId: data.user_id,
        provider: data.provider,
      },
    });
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.userVerification.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async findByProvider(userId: string, provider: 'twitter' | 'linkedin'): Promise<UserVerification | null> {
    return prisma.userVerification.findFirst({
      where: {
        userId,
        provider,
      },
    });
  }
} 