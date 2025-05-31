import { Request, Response } from 'express';
import Stripe from 'stripe';
import mongoose from 'mongoose';
import { Arena, IArena } from '../models/arena.model';
import { PaymentService } from '../services/payment.service';
import { CreatePaymentMethodDto, CreatePaymentDto } from '../types/payment.types';
import { AppError } from '../utils/appError';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  addPaymentMethod = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const data: CreatePaymentMethodDto = req.body;
      const paymentMethod = await this.paymentService.addPaymentMethod(userId, data);
      res.status(201).json(paymentMethod);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getPaymentMethods = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const paymentMethods = await this.paymentService.getPaymentMethods(userId);
      res.status(200).json(paymentMethods);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  removePaymentMethod = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const { id } = req.params;
      await this.paymentService.removePaymentMethod(id, userId);
      res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  createPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const data: CreatePaymentDto = req.body;
      const payment = await this.paymentService.createPayment(userId, data);
      res.status(201).json(payment);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const payment = await this.paymentService.getPayment(id);
      res.status(200).json(payment);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getPaymentsByPayer = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const payments = await this.paymentService.getPaymentsByPayer(userId);
      res.status(200).json(payments);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getPaymentsByReceiver = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const payments = await this.paymentService.getPaymentsByReceiver(userId);
      res.status(200).json(payments);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };
}

// @desc    Create payment intent
// @route   POST /api/payments/create
// @access  Private
export const createPayment = async (req: Request, res: Response) => {
  try {
    const { arenaId } = req.body;

    const arena = await Arena.findById(arenaId) as IArena;
    if (!arena) {
      return res.status(404).json({
        success: false,
        message: 'Arena not found',
      });
    }

    if (!arena.entryFee || arena.entryFee <= 0) {
      return res.status(400).json({
        success: false,
        message: 'This arena has no entry fee',
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: arena.entryFee * 100, // Convert to cents
      currency: 'usd',
      metadata: {
        arenaId: (arena._id as mongoose.Types.ObjectId).toString(),
        userId: req.user._id.toString(),
      },
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Verify payment
// @route   POST /api/payments/verify
// @access  Private
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment not successful',
      });
    }

    const arenaId = paymentIntent.metadata.arenaId;
    const userId = paymentIntent.metadata.userId;

    // Add user to arena participants
    const arena = await Arena.findById(arenaId) as IArena;
    if (!arena) {
      return res.status(404).json({
        success: false,
        message: 'Arena not found',
      });
    }

    const userIdObjectId = new mongoose.Types.ObjectId(userId);
    if (!arena.participants.includes(userIdObjectId)) {
      arena.participants.push(userIdObjectId);
      await arena.save();
    }

    res.json({
      success: true,
      message: 'Payment verified and user added to arena',
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}; 