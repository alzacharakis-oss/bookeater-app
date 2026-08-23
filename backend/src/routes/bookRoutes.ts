import { Router } from 'express';
import * as bookController from '../controllers/bookController';
import { requireAuth, requireAdmin } from '../middleware/auth'

const router = Router();

router.get('/', bookController.getAllBooks); // public
router.get('/:id', bookController.getBookById); // public
router.post('/', requireAuth, bookController.createBook); // requires login
router.put('/:id', requireAuth, requireAdmin, bookController.updateBook); // requires login as admin
router.delete('/:id', requireAuth, requireAdmin, bookController.deleteBook); // requires login as admin

export default router;