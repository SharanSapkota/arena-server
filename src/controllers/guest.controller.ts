import { Request, Response } from 'express';
import { GuestService } from '../services/guest.service';
import { AppError } from '../utils/appError';

export class GuestController {
  private guestService: GuestService;

  constructor() {
    this.guestService = new GuestService();
  }

  createGuest = async (req: Request, res: Response): Promise<void> => {
    try {
      const guest = await this.guestService.createGuest(
        req.ip || '0.0.0.0',
        req.headers['user-agent'] || ''
      );
      res.status(201).json(guest);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getGuest = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const guest = await this.guestService.getGuest(id);
      res.status(200).json(guest);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getGuestBySessionId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { sessionId } = req.params;
      const guest = await this.guestService.getGuestBySessionId(sessionId);
      res.status(200).json(guest);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  deleteGuest = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.guestService.deleteGuest(id);
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