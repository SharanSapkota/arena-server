import express from 'express';
import { register, login, verifySocialAccount } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-social', protect, verifySocialAccount);

export default router; 