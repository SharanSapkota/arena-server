import prisma from '../lib/prisma';
import { PaymentMethod, Payment, CreatePaymentMethodDto, CreatePaymentDto } from '../types/payment.types';

export class PaymentRepository {
  async findPaymentMethodById(id: string): Promise<PaymentMethod | null> {
    return prisma.paymentMethod.findUnique({
      where: { id },
    });
  }

  async findPaymentMethodByUserId(userId: string): Promise<PaymentMethod[]> {
    return prisma.paymentMethod.findMany({
      where: { userId },
    });
  }

  async createPaymentMethod(userId: string, data: CreatePaymentMethodDto): Promise<PaymentMethod> {
    return prisma.paymentMethod.create({
      data: {
        userId,
        methodType: data.method_type,
        details: data.details,
      },
    });
  }

  async deletePaymentMethod(id: string): Promise<boolean> {
    try {
      await prisma.paymentMethod.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async findPaymentById(id: string): Promise<Payment | null> {
    return prisma.payment.findUnique({
      where: { id },
      include: {
        payer: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
        arena: {
          select: {
            id: true,
            title: true,
          },
        },
        method: true,
      },
    });
  }

  async findPaymentsByPayerId(payerId: string): Promise<Payment[]> {
    return prisma.payment.findMany({
      where: { payerId },
      include: {
        receiver: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
        arena: {
          select: {
            id: true,
            title: true,
          },
        },
        method: true,
      },
      orderBy: {
        paidAt: 'desc',
      },
    });
  }

  async findPaymentsByReceiverId(receiverId: string): Promise<Payment[]> {
    return prisma.payment.findMany({
      where: { receiverId },
      include: {
        payer: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
        arena: {
          select: {
            id: true,
            title: true,
          },
        },
        method: true,
      },
      orderBy: {
        paidAt: 'desc',
      },
    });
  }

  async createPayment(payerId: string, data: CreatePaymentDto): Promise<Payment> {
    return prisma.payment.create({
      data: {
        payerId,
        receiverId: data.receiver_id,
        arenaId: data.arena_id,
        methodId: data.method_id,
        amount: data.amount,
      },
      include: {
        payer: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
        arena: {
          select: {
            id: true,
            title: true,
          },
        },
        method: true,
      },
    });
  }
} 