import { Router } from 'express';
import { ArenaViewController } from '../controllers/arena-view.controller';
import { protect } from '../middleware/auth';

const router = Router();
const arenaViewController = new ArenaViewController();

// Protect all routes
router.use(protect);

// Arena view routes
router.post('/:arenaId', arenaViewController.addView);
router.get('/:id', arenaViewController.getView);
router.get('/arena/:arenaId', arenaViewController.getArenaViews);
router.get('/user/views', arenaViewController.getUserViews);
router.delete('/:id', arenaViewController.removeView);
router.get('/count/:arenaId', arenaViewController.getViewCount);

export default router; 