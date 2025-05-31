import prisma from '../lib/prisma';
import { Guest } from '../types/user.types';

export class GuestRepository {
  async findById(id: string): Promise<Guest | null> {
    return prisma.guest.findUnique({
      where: { id },
    });
  }

  async findBySessionId(sessionId: string): Promise<Guest | null> {
    return prisma.guest.findUnique({
      where: { sessionId },
    });
  }

  async create(data: { ip_address: string; user_agent: string; session_id: string }): Promise<Guest> {
    return prisma.guest.create({
      data: {
        ipAddress: data.ip_address,
        userAgent: data.user_agent,
        sessionId: data.session_id,
      },
    });
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.guest.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async findByCondition(condition: { [key: string]: any }): Promise<Guest[]> {
    return prisma.guest.findMany({
      where: condition,
    });
  }
} 