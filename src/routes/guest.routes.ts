import { Router } from 'express';
import { GuestController } from '../controllers/guest.controller';

const router = Router();
const guestController = new GuestController();

// Public routes
router.post('/', guestController.createGuest);
router.get('/:id', guestController.getGuest);
router.get('/session/:sessionId', guestController.getGuestBySessionId);
router.delete('/:id', guestController.deleteGuest);

export default router; 