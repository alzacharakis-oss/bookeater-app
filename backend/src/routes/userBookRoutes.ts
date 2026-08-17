import { Router } from 'express';
import * as userBookController from '../controllers/userBookController';

const router = Router();

router.get('/user/:userId', userBookController.getUserBooks);
router.post('/', userBookController.addToWishlist);
router.patch('/:id', userBookController.updateUserBook);
router.delete('/:id', userBookController.removeUserBook);

export default router;