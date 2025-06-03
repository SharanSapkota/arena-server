import { Router } from 'express';
import { protect } from '../middleware/auth';
import { UserController } from '@/controllers/user.controller';

const router = Router();
const userController = new UserController();

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.use(protect);
router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);
router.delete('/profile', userController.deleteProfile);

export default router; 