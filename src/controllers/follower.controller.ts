import { Request, Response } from 'express';
import { FollowerService } from '../services/follower.service';
import { AppError } from '../utils/appError';

export class FollowerController {
  private followerService: FollowerService;

  constructor() {
    this.followerService = new FollowerService();
  }

  followUser = async (req: Request, res: Response) => {
    try {
      const followerId = req.user?.id;
      if (!followerId) {
        throw new AppError('Not authenticated', 401);
      }

      const { followingId } = req.params;
      const follower = await this.followerService.followUser(followerId, followingId);
      res.status(201).json(follower);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getFollower = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const follower = await this.followerService.getFollower(id);
      res.json(follower);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getFollowers = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const followers = await this.followerService.getFollowers(userId);
      res.json(followers);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getFollowing = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const following = await this.followerService.getFollowing(userId);
      res.json(following);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  unfollowUser = async (req: Request, res: Response) => {
    try {
      const followerId = req.user?.id;
      if (!followerId) {
        throw new AppError('Not authenticated', 401);
      }

      const { followingId } = req.params;
      await this.followerService.unfollowUser(followerId, followingId);
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