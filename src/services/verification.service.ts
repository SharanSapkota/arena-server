import { VerificationRepository } from '../repositories/verification.repository';
import { UserVerification } from '../types/user.types';
import { AppError } from '../utils/appError';

export class VerificationService {
  private verificationRepository: VerificationRepository;

  constructor() {
    this.verificationRepository = new VerificationRepository();
  }

  async addVerification(userId: string, provider: 'twitter' | 'linkedin'): Promise<UserVerification> {
    // Check if verification already exists
    const existingVerification = await this.verificationRepository.findByProvider(userId, provider);
    if (existingVerification) {
      throw new AppError('Verification already exists for this provider', 400);
    }

    return this.verificationRepository.create({
      user_id: userId,
      provider,
    });
  }

  async getVerifications(userId: string): Promise<UserVerification[]> {
    return this.verificationRepository.findByUserId(userId);
  }

  async getVerification(id: string): Promise<UserVerification> {
    const verification = await this.verificationRepository.findById(id);
    if (!verification) {
      throw new AppError('Verification not found', 404);
    }
    return verification;
  }

  async removeVerification(id: string, userId: string): Promise<void> {
    const verification = await this.verificationRepository.findById(id);
    if (!verification) {
      throw new AppError('Verification not found', 404);
    }

    if (verification.user_id !== userId) {
      throw new AppError('Not authorized to remove this verification', 403);
    }

    const success = await this.verificationRepository.delete(id);
    if (!success) {
      throw new AppError('Failed to remove verification', 500);
    }
  }
} 