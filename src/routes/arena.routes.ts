import { Router } from 'express';
import { ArenaController } from '@/controllers/arena.controller';
import { protect } from '@/middleware/auth';

const router = Router();
const arenaController = new ArenaController();

// Public routes
router.get('/', arenaController.getAllArenas);
router.get('/:id', arenaController.getArena);
router.get('/:id/chats', arenaController.getChats);
router.get('/:id/comments', arenaController.getComments);
router.get('/:id/views', arenaController.getViews);
router.post('/:id/views', arenaController.addView);

// Protected routes
router.use(protect);
router.post('/', arenaController.createArena);
router.patch('/:id', arenaController.updateArena);
router.delete('/:id', arenaController.deleteArena);
router.post('/:id/invites', arenaController.inviteToArena);
router.delete('/:id/invites', arenaController.removeInvite);
router.post('/:id/chats', arenaController.addChat);
router.post('/:id/comments', arenaController.addComment);

export default router; 