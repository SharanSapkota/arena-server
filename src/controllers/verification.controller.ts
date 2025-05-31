import { Request, Response } from 'express';
import { VerificationService } from '../services/verification.service';
import { AppError } from '../utils/appError';

export class VerificationController {
  private verificationService: VerificationService;

  constructor() {
    this.verificationService = new VerificationService();
  }

  addVerification = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const { provider } = req.body;
      if (!provider || !['twitter', 'linkedin'].includes(provider)) {
        throw new AppError('Invalid provider', 400);
      }

      const verification = await this.verificationService.addVerification(userId, provider);
      res.status(201).json(verification);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getVerifications = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const verifications = await this.verificationService.getVerifications(userId);
      res.status(200).json(verifications);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getVerification = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const verification = await this.verificationService.getVerification(id);
      res.status(200).json(verification);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  removeVerification = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const { id } = req.params;
      await this.verificationService.removeVerification(id, userId);
      res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };
} 