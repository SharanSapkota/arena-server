import { Router } from 'express';
import { ChatLikeController } from '../controllers/chat-like.controller';
import { protect } from '../middleware/auth';

const router = Router();
const chatLikeController = new ChatLikeController();

// Protect all routes
router.use(protect);

// Like a chat
router.post('/:chatId', chatLikeController.likeChat);

// Get a specific like
router.get('/:id', chatLikeController.getLike);

// Get all likes for a chat
router.get('/chat/:chatId', chatLikeController.getChatLikes);

// Get all likes by the authenticated user
router.get('/user/likes', chatLikeController.getUserLikes);

// Unlike a chat
router.delete('/:chatId', chatLikeController.unlikeChat);

// Get like count for a chat
router.get('/count/:chatId', chatLikeController.getLikeCount);

export default router; 