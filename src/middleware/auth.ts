import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError';
import { UserService } from '../services/user.service';

const userService = new UserService();

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1) Check if token exists
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in', 401));
    }

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // 3) Check if user still exists
    const user = await userService.getProfile(decoded.id);
    if (!user) {
      return next(new AppError('User no longer exists', 401));
    }

    // 4) Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    next(new AppError('Invalid token', 401));
  }
}; 