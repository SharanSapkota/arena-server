import { Router } from 'express';
import { CommentController } from '../controllers/comment.controller';
import { protect } from '../middleware/auth';

const router = Router();
const commentController = new CommentController();

// Protect all routes
router.use(protect);

// Comment routes
router.post('/', commentController.createComment);
router.get('/:id', commentController.getComment);
router.get('/chat/:chatId', commentController.getChatComments);
router.get('/user/comments', commentController.getUserComments);
router.patch('/:id', commentController.updateComment);
router.delete('/:id', commentController.deleteComment);
router.get('/count/:chatId', commentController.getCommentCount);

export default router; 