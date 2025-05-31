import { Router } from 'express';
import { ArenaInviteController } from '../controllers/arena-invite.controller';
import { protect } from '../middleware/auth';

const router = Router();
const arenaInviteController = new ArenaInviteController();

// Protect all routes
router.use(protect);

// Create a new invite
router.post('/', arenaInviteController.createInvite);

// Get a specific invite
router.get('/:id', arenaInviteController.getInvite);

// Get all invites for an arena
router.get('/arena/:arenaId', arenaInviteController.getArenaInvites);

// Get all invites for the authenticated user
router.get('/user/invites', arenaInviteController.getUserInvites);

// Remove an invite
router.delete('/:id', arenaInviteController.removeInvite);

// Remove an invite by arena and user
router.delete('/arena/:arenaId/user/:userId', arenaInviteController.removeInviteByArenaAndUser);

export default router; 