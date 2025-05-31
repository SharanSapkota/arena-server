import { AppError } from '@/utils/appError';
import { PaymentRepository } from '../repositories/payment.repository';
import { PaymentMethod, Payment, CreatePaymentMethodDto, CreatePaymentDto } from '../types/payment.types';

export class PaymentService {
  private paymentRepository: PaymentRepository;

  constructor() {
    this.paymentRepository = new PaymentRepository();
  }

  async addPaymentMethod(userId: string, data: CreatePaymentMethodDto): Promise<PaymentMethod> {
    return this.paymentRepository.createPaymentMethod(userId, data);
  }

  async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    return this.paymentRepository.findPaymentMethodByUserId(userId);
  }

  async removePaymentMethod(id: string, userId: string): Promise<void> {
    const paymentMethod = await this.paymentRepository.findPaymentMethodById(id);
    if (!paymentMethod) {
      throw new AppError('Payment method not found', 404);
    }

    if (paymentMethod.user_id !== userId) {
      throw new AppError('Not authorized to remove this payment method', 403);
    }

    const success = await this.paymentRepository.deletePaymentMethod(id);
    if (!success) {
      throw new AppError('Failed to remove payment method', 500);
    }
  }

  async createPayment(payerId: string, data: CreatePaymentDto): Promise<Payment> {
    // Verify payment method belongs to payer
    const paymentMethod = await this.paymentRepository.findPaymentMethodById(data.method_id);
    if (!paymentMethod) {
      throw new AppError('Payment method not found', 404);
    }

    if (paymentMethod.user_id !== payerId) {
      throw new AppError('Not authorized to use this payment method', 403);
    }

    return this.paymentRepository.createPayment(payerId, data);
  }

  async getPayment(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findPaymentById(id);
    if (!payment) {
      throw new AppError('Payment not found', 404);
    }
    return payment;
  }

  async getPaymentsByPayer(payerId: string): Promise<Payment[]> {
    return this.paymentRepository.findPaymentsByPayerId(payerId);
  }

  async getPaymentsByReceiver(receiverId: string): Promise<Payment[]> {
    return this.paymentRepository.findPaymentsByReceiverId(receiverId);
  }
} 