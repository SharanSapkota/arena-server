import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto, LoginDto } from '../types/user.types';
import { AppError } from '../utils/appError';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const result = await this.userService.register(userData);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const loginData: LoginDto = req.body;
      const result = await this.userService.login(loginData);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const profile = await this.userService.getProfile(userId);
      res.status(200).json(profile);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const updateData: UpdateUserDto = req.body;
      const updatedProfile = await this.userService.updateProfile(userId, updateData);
      res.status(200).json(updatedProfile);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  deleteProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      await this.userService.deleteProfile(userId);
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