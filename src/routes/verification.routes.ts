import { Router } from 'express';
import { VerificationController } from '../controllers/verification.controller';
import { protect } from '../middleware/auth';

const router = Router();
const verificationController = new VerificationController();

// Protected routes
router.use(protect);
router.post('/', verificationController.addVerification);
router.get('/', verificationController.getVerifications);
router.get('/:id', verificationController.getVerification);
router.delete('/:id', verificationController.removeVerification);

export default router; 