import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { protect } from '../middleware/auth';

const router = Router();
const chatController = new ChatController();

// Protect all routes
router.use(protect);

// Create a new chat
router.post('/', chatController.createChat);

// Get a specific chat
router.get('/:id', chatController.getChat);

// Get all chats for an arena
router.get('/arena/:arenaId', chatController.getArenaChats);

// Get all chats for the authenticated user
router.get('/user/chats', chatController.getUserChats);

// Update a chat
router.patch('/:id', chatController.updateChat);

// Delete a chat
router.delete('/:id', chatController.deleteChat);

export default router; 