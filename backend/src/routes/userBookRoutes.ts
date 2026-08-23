import { Router } from 'express';
import * as userBookController from '../controllers/userBookController';
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get('/', requireAuth, userBookController.getUserBooks);
router.post('/', requireAuth, userBookController.addToWishlist);
router.patch('/:id', requireAuth, userBookController.updateUserBook);
router.delete('/:id', requireAuth, userBookController.removeUserBook);

export default router;