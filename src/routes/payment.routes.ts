import { Router } from 'express';
import { PaymentController } from '@/controllers/payment.controller';
import { protect } from '@/middleware/auth';

const router = Router();
const paymentController = new PaymentController();

// Protected routes
router.use(protect);
router.post('/methods', paymentController.addPaymentMethod);
router.get('/methods', paymentController.getPaymentMethods);
router.delete('/methods/:id', paymentController.removePaymentMethod);
router.post('/', paymentController.createPayment);
router.get('/:id', paymentController.getPayment);
router.get('/payer/:payerId', paymentController.getPaymentsByPayer);
router.get('/receiver/:receiverId', paymentController.getPaymentsByReceiver);

export default router; 